/**
 * Copyright (c) 2012 eBay Inc.
 * Author: Senthil Padmanabhan
 *
 * Released under the MIT License
 * http://www.opensource.org/licenses/MIT
 *
 * A standalone rules array to hold the basic spof rules
 * @property rules
 * @type Object[]
 */
var rules = [];

/**
 * A global function to check if a given URL belongs to the a third party domain.
 * A block pattern is maintained which lists all the possible third party scripts
 * that can be included in a page
 * @param {String} url The url to be verified
 * @return {Boolean} The flag indicating if the given url belongs to a third party domain
 * @method is3P
 */
function is3P(url) {
    // Known 3rd-party assets
    // Ref: https://github.com/pmeenan/spof-o-matic/blob/master/src/background.js
    var BLOCK_PATTERN = [
            'platform\.twitter\.com',
            'connect\.facebook\.net',
            'platform\.linkedin\.com',
            'assets\.pinterest\.com',
            'widgets\.digg\.com',
            '.*\.addthis\.com',
            'ajax\.googleapis\.com',
            'code\.jquery\.com',
            'cdn\.jquerytools\.org',
            'apis\.google\.com',
            '.*\.google-analytics\.com',
            '.*\.chartbeat\.com',
            'static\.chartbeat\.com',
            '.*\.2o7\.net',
            '.*\.revsci\.net',
            '.*\.omtrdc\.net',
            'b\.scorecardresearch\.com',
            'cdn\.sailthru\.com',
            '.*browserid\.org',
            'ad\.doubleclick\.net',
            'js\.adsonar\.com',
            'ycharts\.com',
            '.*\.googlecode\.com',
            '.*\.gstatic\.com',
            '.*\.quantserve\.com',
            '.*\.brightcove\.com',
            '.*\.disqus\.com',
            '.*\.lognormal\.com'
        ],
        i,
        l,
        regEx;

    for (i = 0, l = BLOCK_PATTERN.length; i < l; i++) {
        regEx = new RegExp(BLOCK_PATTERN[i], 'im');
        if (regEx.test(url)) {
            return true;
        }
    }
    return false;
}

/**
 * Rule: Load 3rd party JS Asynchronously
 */
rules.push({
    // Rule metadata
    id: "3rdparty-scripts",
    name: "Load 3rd Party JS Asynchronously",
    desc: "Always load 3rd party external scripts asyncronously in a non-blocking pattern",

    // The check function to verify the rule
    check: function($, cssContent, reporter) {
        var rule = this,
            html = $('html').html(),
            pageLength = html.length,
            scripts = $('script'),
            /** 
             * Determines the SPOF score for the script url in the page
             * @param {String} src The script source for which the score should be determined
             * @return {int} The score
             * @method getScore
             */
            getScore = function(src) {
                var value = 100 - (((html.indexOf(src) + src.length) / pageLength) * 100);
                return Math.round(value);
            },
            i,
            l,
            script,
            src;

        for (i = 0, l = scripts.length; i < l; i++) {
            script = scripts[i];
            src = script.src;
            if (src && is3P(src)) {
                if (!script.defer || !script.async) {
                    reporter.error("ERROR: Possible SPOF attack due to 3rd party script - " + src, src, getScore(src), rule);
                }
            }
        }
    }
});

/**
 * Rule: Load Application JS Non-blocking
 */
rules.push({
    // Rule metadata
    id: "application-js",
    name: "Load Application JS Non-blocking",
    desc: "Load application JS in a non-blocking pattern or towards the end of page",

    // The check function to verify the rule
    check: function($, cssContent, reporter) {
        var rule = this,
            html = $('html').html(),
            pageLength = html.length,
            scripts = $('script'),
            /** 
             * Determines the SPOF score for the script url in the page
             * @param {String} src The script source for which the score should be determined
             * @return {int} The score
             * @method getScore
             */
            getScore = function(src) {
                var value = 100 - (((html.indexOf(src) + src.length) / pageLength) * 100);
                return Math.round(value);
            },
            i,
            l,
            script,
            src,
            score;

        for (i = 0, l = scripts.length; i < l; i++) {
            script = scripts[i];
            src = script.src;
            if (src && !is3P(src)) {
                score = getScore(src);
                if (score > 50 && (!script.defer || !script.async)) {
                    reporter.warn("WARNING: Possible SPOF attack due to script " + src, src, score, rule);
                }
            }
        }
    }
});

/**
 * Rule: Stylesheet With @font-face
 */
rules.push({
    // Rule metadata
    id: "fontface-stylesheet",
    name: "Stylesheet With @font-face",
    desc: "Try to inline @font-face style. Also make the font files compressed and cacheable",

    // The check function to verify the rule
    check: function($, cssContent, reporter) {
        var rule = this,
            pattern = /@font-face[\s\n]*{([^{}]*)}/gim, // RegEx pattern for retrieving all the font-face styles
            urlPattern = /url\s*\(\s*['"]?([^'"]*)['"]?\s*\)/gim, // RegEx pattern for retrieving the urls  font-face styles
            fontFaceMatches,
            fontUrl;

        if (!cssContent || cssContent === "") {
            // Return immediately if CSS content is empty
            return;
        }

        fontFaceMatches = cssContent.match(pattern);
        if (!fontFaceMatches) {
            // Return if no font-face style
            return;
        }

        fontFaceMatches.forEach(function(match) {
            while (fontUrl = urlPattern.exec(match)) {
                fontUrl[1] && reporter.warn("WARNING: Possible SPOF attack due to @font-face style in external stylesheet", fontUrl[1], "NA", rule);
            }
        });
    }
});

/**
 * Rule: Inline @font-face
 */
rules.push({
    // Rule metadata
    id: "fontface-inline",
    name: "Inline @font-face",
    desc: "Make sure the fonts files are compressed, cached and small in size",

    // The check function to verify the rule
    check: function($, cssContent, reporter) {
        var rule = this,
            html = $('html').html(),
            pattern = /@font-face[\s\n]*{([^{}]*)}/gim, // RegEx pattern for retrieving all the font-face styles
            urlPattern = /url\s*\(\s*['"]?([^'"]*)['"]?\s*\)/gim, // RegEx pattern for retrieving the urls  font-face styles
            fontFaceMatches,
            fontUrl;

        fontFaceMatches = html.match(pattern);
        if (!fontFaceMatches) {
            // Return if no font-face style
            return;
        }

        fontFaceMatches.forEach(function(match) {
            while (fontUrl = urlPattern.exec(match)) {
                fontUrl[1] && reporter.warn("WARNING: Possible SPOF attack due to inline @font-face style", fontUrl[1], "NA", rule);
            }
        });
    }
});

/**
 * Rule: Inline @font-face precede Script tag IE issue
 */
rules.push({
    // Rule metadata
    id: "fontface-inline-precede-script-IE",
    name: "Inline @font-face precede Script tag IE issue",
    desc: "Make sure inlined @font-face is not preceded by a SCRIPT tag, causes SPOF in IE",

    // The check function to verify the rule
    check: function($, cssContent, reporter) {
        var rule = this,
            html = $('html').html(),
            scriptStylePattern = /<script[^>]*>[\s\S]*?<\/script>\s*<style[^>]*>[\s\S]*?<\/style>/gim,
            scriptStyleMatches,
            multipleMsg;

        scriptStyleMatches = html.match(scriptStylePattern);
        if (!scriptStyleMatches) {
            // Return if no font-face style
            return;
        }

        multipleMsg = scriptStyleMatches.length > 1 ? 'multiple occurances of ' : '';
        reporter.warn("WARNING: Possible SPOF attack in IE due to " + multipleMsg + "inline @font-face preceded by a SCRIPT tag", "NA", "NA", rule);
    }
});


// Exporting the rules for node environment
if (typeof exports != 'undefined') {
    exports.rules = rules;
}