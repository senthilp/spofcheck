#!/usr/bin/env node

/**
 * Copyright (c) 2012 eBay Inc.
 * Author: Senthil Padmanabhan
 *
 * Released under the MIT License
 * http://www.opensource.org/licenses/MIT
 *
 * spofcheck
 *
 * CLI for frontend spof detection
 *
 */

// dependencies
var path = require('path'),
    fs = require('fs'),
    nopt = require('nopt'),
    request = require('request'),
    async = require('async'),
    jsdom = require('jsdom').jsdom,
    mkdirp = require('mkdirp'),
    Q = require('q'),
    $ = require('jquery')(jsdom().defaultView);

// Setting jsdom global config
require("jsdom").defaultDocumentFeatures = {
    FetchExternalResources: false,
    ProcessExternalResources: false,
    MutationEvents: false,
    QuerySelector: false
};

// Locals
var options = {
        "outputdir": path,
        "format": String,
        "help": Boolean,
        "rules": String,
        "print": Boolean,
        "quiet": Boolean
    },
    shortHand = {
        "o": ['--outputdir'],
        "f": ['--format'],
        "h": ['--help'],
        "r": ['--rules'],
        "p": ['--print'],
        "q": ['--quiet']
    };

// options
options = nopt(options, shortHand);

/**
 * Convert a given relative URL to absolute URL
 * @param {String} url The url to be converted to absolute.
 * @param {String} mainUrl The main URL of the page.
 * @return {String} The fully qualified absolute URL.
 * @method getAbsoluteUrl
 */
function getAbsoluteUrl(url, mainUrl) {
    // If url or mainUrl not present return the given url
    if (!url || !mainUrl) {
        return url;
    }
    // If url begins with http(s) then it is already an absolute URL, so return given url
    if (/^http[s]?:\/\//i.test(url)) {
        return url;
    }
    // If url begins with // it is shortcut to use main page protocol
    // Change given URL with mainPage url protocol and return
    if (/^\/\//.test(url)) {
        return /^http[s]?:/i.exec(mainUrl) + url;
    }
    var protocol = /^http[s]?/i.exec(mainUrl),
        domain = /^http[s]?:\/\/([^\/]*)[\/]?/i.exec(mainUrl)[1],
        path = '',
        depth = url.match(/\.\./g) ? url.match(/\.\./g).length : 0,
        index;
    // If url needs depth i.e. has folder traverse (..), then strip the folder information
    url = url.replace(/\.\.\//g, '');

    // If given url starts with / then ignore path
    if (!/^\//.test(url)) {
        path = mainUrl.replace(protocol + '://' + domain, '');
        // if path is present then remove the resource from the path
        if (path.length) {
            index = path.lastIndexOf('/');
            path = index < 1 ? '/' : path.substr(0, index + 1); // path should always end with slash /
            // If there is a folder traverse (..) in given url, then traverse upto the depth
            while (depth-- && path.length > 1) {
                path = path.replace(/[^\/]*\/$/, '');
            }
        }
    }

    return protocol + '://' + domain + path + url;
}

/**
 * Retrieve the list of external CSS URLs in the page
 * @param {Object} $dom The DOM handler (jQuery) for the page.
 * @return {Array} An array of URLs.
 * @param {String} mainUrl The main URL of the page.
 * @return {Array} The CSS urls in the page
 * @method getCssUrls
 */
function getCssUrls($dom, mainUrl) {
    // Retrieving the link elements, using both type and rel attributes 
    var urls = [].concat($dom('link[type="text/css"]').get())
        .concat($dom('link[rel="stylesheet"]').get());

    // Retrieving the actual urls
    urls = urls.map(function(url) {
        return getAbsoluteUrl(url.href, mainUrl);
    });

    // removing duplicates and returning
    return urls.filter(function(url, index) {
        return this.indexOf(url) === index;
    }, urls);
}

/**
 * Creates a CSS callback function stack to be executed after each external
 * CSS is loaded
 * @param {Array} urls The external CSS URLs
 * @return {Array} An array of functions.
 * @method getCssFnStack
 */
function getCssFnStack(urls) {
    var cssFnStack = [];
    urls.forEach(function(url) {
        cssFnStack.push(function(callback) {
            request(url, function(error, response, body) {
                if (error || response.statusCode !== 200) {
                    body = '';
                    log('spof: ERROR Unable to load CSS resource ' + url);
                }
                callback(null, body);
            });
        });
    });
    return cssFnStack;
}

/**
 * Checks if spofcheck was triggered from command line
 * Wrapper for console.log, checks for quiet mode first
 * @return {Boolean} true if triggered from a command line interface
 * @method isCLI
 */
function isCLI() {
    return require.main === module;
}

/**
 * Wrapper for console.log, checks for quiet mode first
 * @param {String} message The message to be logged
 * @method log
 */
function log(message) {
    // Return if quiet mode
    if (options.quiet) {
        return;
    }
    console.log(message);
}

/**
 * Wrapper for process.exit, checks for command line mode, print the message & exit
 * @param {String} message The message to be logged
 * @method exit
 */
function exit(message) {
    if (isCLI()) {
        console.log(message);
        process.exit(0);
    }
}


/**
 * Opens a file and writes the given message
 * @param {String} file The full path file name to write a message
 * @param {String} message The message to be written
 * @method write
 */
function write(file, message) {
    var fd = fs.openSync(file, 'w');
    fs.writeSync(fd, message);
}

/**
 * Normalizes the rules based on the ruleIds provided in option (-r)
 * and previously registered with spof engine
 * @param {Array} ruleIds The rule IDs to be included in the analysis
 * @param {Array} rules The rules registered with the spof engine
 * @return {Array} Normalized set of rules
 * @method gatherRules
 */
function gatherRules(ruleIds, rules) {
    var idHash = {};
    // Normalize ruleIds
    if (!Array.isArray(ruleIds)) {
        ruleIds = ruleIds.split(',');
    }
    ruleIds.forEach(function(id) {
        idHash[id] = 1;
    });

    return rules.filter(function(rule) {
        return idHash[rule.id];
    });

}

/**
 * Creates a CSS callback function stack to be executed after each external
 * CSS is loaded
 * @param {Array} args The URLS(s) to run spofcheck
 * @param {Object} deferred (optional) The deferred object to reject/resolve based on the result
 * @method exec
 */
function exec(args, deferred) {
    var spof = require('../lib/spof.js').spof,
        rules = spof.getRules(), // Get the default registered ruleset
        usage = [
            "\nUSAGE: spofcheck [options]* [urls]*",
            " ",
            "Options:",
            "  --help | -h                      			Displays this information.",
            "  --format=<format> | -f <format>  			Indicate which format [junit-xml | spof-xml | text] to use for output",
            "  --outputdir=<dir> | -o <dir>     			Outputs the spof results to this directory.",
            "  --rules=<rule[,rule]+> | -r <rule[,rule]+>   Indicate which rules to include.",
            "  --print | -p                     			Outputs the results in console, instead of saving to a file.",
            "  --quiet | -q                     			Keeps the console clear from logging.",
            " ",
            "Example:",
            "  spofcheck -f junit-xml -o /tests www.ebay.com www.amazon.com",
            " "
        ].join("\n"),
        formatter = spof.getFormatter(options.format || 'junit-xml'),
        length = args.length,
        counter = 0,
        msg = '',
        resultsQ = [], // Queue to hold the analyzed results
        formattedResultsQ = [], // Queue to hold the formatted results
        /**
         * Flush the spof results to a file
         * @param {String} results The spof results to flush
         * @method flush
         * @private
         */
        flush = function(results) {
            var buffer = [],
                file = (options.outputdir || '.') + '/' + formatter.id + '.' + formatter.extension,
                output;

            if (options.outputdir) {
                // Create output directory
                mkdirp.sync(options.outputdir);
            }

            log('spof: Flushing the results');
            // Buffer the formatter start
            output = formatter.startFormat();
            if (output) {
                buffer.push(output);
            }

            // Buffer the results
            if (results.length) {
                buffer.push(results);
            }

            // Buffer the formatter end
            output = formatter.endFormat();
            if (output) {
                buffer.push(output);
            }

            // Flush the buffer
            if (options.print) {
                log('\nspof: Output\n');
                console.log(buffer.join('\n'));
            } else {
                write(file, buffer.join('\n'));
                log('\nspof: Results available at ' + file);
            }
            log('\nspof: SPOF check DONE!\n');
        };

    // if deferred is null create noops
    deferred = deferred || {
        reject: function() {},
        resolve: function() {}
    };

    if (!length || options.help) {
        // Reject the promise
        deferred.reject(new Error(usage));
        // Exit immediately
        return exit(usage);
    }

    if (!formatter) {
        msg = 'spof:  Unknown format \'' + options.format + '\'. Cannot proceed';
        // Reject the promise
        deferred.reject(new Error(msg));
        // Exit immediately		
        return exit(msg);
    }

    // Normalize the rules
    if (options.rules) {
        // Normalize the rules
        rules = gatherRules(options.rules, rules);
        if (!rules.length) {
            msg = 'spof: Invalid rules - ' + options.rules;
            deferred.reject(new Error(msg));
            return exit(msg);
        }
    }

    args.forEach(function(url) {
        // Check if http is present, else append it
        url = /^http[s]?:\/\//.test(url) ? url : 'http://' + url;
        log('spof: Analyzing ' + url);
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // Create the DOM window from the page 
                var win = jsdom(body, null, null).defaultView,
                    // Get the jQuery DOM interface
                    $dom = require('jquery')(win),
                    // Create the CSS function stack for the async parallelization
                    cssFnStack = getCssFnStack(getCssUrls($dom, url));

                // Retrieve the CSS results in parallel and join them
                log('spof: Processing external CSS resources for ' + url);
                async.parallel(cssFnStack, function(err, results) {
                    var result = spof.analyze($dom, results.join(), rules),
                        formattedResults = formatter.formatResults(result, url);

                    // Push the formatted results & the original results to their corresponding Queues
                    if (formattedResults && formattedResults.length) {
                        formattedResultsQ.push(formattedResults);
                        // Add the url to the result before pushing
                        result.url = url;
                        resultsQ.push(result);
                    }

                    // Publish the results if last url
                    if (++counter === length) {
                        // If CLI flush the results, else resolve promise
                        if (isCLI()) {
                            flush(formattedResultsQ.join('\n'));
                        } else {
                            deferred.resolve(resultsQ);
                        }
                    }
                });
            } else {
                // Decrement the length
                length--;
                msg = 'spof: ERROR Unable to load ' + url;
                log(msg);
                // Reject the promise
                deferred.reject(new Error(msg));
            }
        });
    });
}

// Start the execution only if CLI
if (isCLI()) {
    exec(options.argv.remain);
}

/** SPOFCheck programmable API **/
/**
 * The programmable API interface for SPOFCheck
 * @param {Array|String} urls The URL(s) to perform the spof check
 * @param {Object} opts The options to run SPOFCheck, same as the command line
 * @return {Promise} A spof check results promise to be fullfilled by the caller
 * @method run
 */
var run = function(urls, opts) {
    var deferred = Q.defer();
    if (!urls) {
        urls = [];
    }
    urls = Array.isArray(urls) ? urls : [urls];
    options = $.extend({}, {
        quiet: true // for the programmable API make it quiet by default
    }, opts);
    // Execute
    exec(urls, deferred);
    // Retunr the promise
    return deferred.promise;
};

// Expose the API
module.exports.run = run;