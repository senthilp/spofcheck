// Defining the Global spof object, will be used in non-node environments
var spof = {};

!function(exports) {

	/**
	 * An instance of Report is used to report results of the
	 * verification back to the main spof API.
	 * @class Reporter
	 * @constructor
	 */	
	function Reporter() {
	    /**
	     * List of messages being reported.
	     * @property messages 
	     * @type String[]
	     * @private
	     */		
		this._messages = [];
	}
	
	
	Reporter.prototype = {
		constructor: Reporter,
	
	    /**
	     * Report a finding.
	     * @param {String} message The message to store.
	     * @param {String} entity The entity which caused the issue.
	     * @param {int} score The score for this spof entity.
	     * @param {Object} rule The rule this message relates to.
	     * @param {String} type (optional) The type of the finding, default is info.
	     * @method report
	     */		
		report: function(message, entity, score, rule, type) {
			this._messages.push({
				type: type || "info",
				message: message,
				entity: entity,
				score: score,
				rule: rule || {}
			});
		},
		
	    /**
	     * Report an error.
	     * @param {String} message The message to store.
	     * @param {String} entity The entity which caused the issue.
	     * @param {int} score The score for this spof entity.
	     * @param {Object} rule The rule this message relates to.
	     * @method report
	     */				
		error: function(message, entity, score, rule) {
			this.report(message, entity, score, rule, 'error');
		},

	    /**
	     * Report a warning.
	     * @param {String} message The message to store.
	     * @param {String} entity The entity which caused the issue.
	     * @param {int} score The score for this spof entity.
	     * @param {Object} rule The rule this message relates to.
	     * @method report
	     */						
		warn: function(message, entity, score, rule) {
			this.report(message, entity, score, rule, 'warning');
		},

	    /**
	     * Returns the list of messages.
	     * @return {Array} Reported messages.
	     * @method getMessages
	     */								
		getMessages: function() {
			return this._messages;
		}
	};
	
	/**
	 * Main spof api object.
	 * @Object spofApi
	 * @static
	 */	
	var spofApi = function() {
		
		var rulesset = [], // Stack to hold the rules
			formatters = []; // Stack to hold the formatters  
		
		return {
		    /**
		     * Performs a SPOF analysis on the page
		     * @param {Object} $ The DOM handler (jQuery) for the page.
		     * @param {String} cssContent Externalized CSS content for the page.
		     * @param {Array} rules (optional) Additional rules to be applied, 
		     * 		  Will be merged with the previousy registered rules. 
		     * @return {Object} Results of the analysis. 
		     * @method analyze
		     */			
			analyze: function($, cssContent, rules) {				
				// Merge the new rules passed in param along with already set rules
				rules = rules? this.getRules().concat(rules): this.getRules();  
				
				// If empty ruleset throw error and return 
				if(!rules.length) {
					throw new Error("Empty ruleset.");
				}
				
				// Create a reporter instance
				var reporter = new Reporter();
				
				// Execute each rule
				rules.forEach(function(rule) {
					rule.check && rule.check($, cssContent, reporter);
				});
				return {
					messages: reporter.getMessages()
				};
			},

			/**
		     * Returns the rules array
		     * @return {Array} The rules to be applied. 
		     * @method getRules
		     */						
			getRules: function() {
				return rulesset;
			},
			
			/**
		     * Registers the given rule(s)
		     * @param {Array|String} rules The rules to be applied. 
		     * @method registerRules
		     */									
			registerRules: function(rules) {
				rules = Array.isArray(rules)? rules: [rules];
				Array.prototype.push.apply(rulesset, rules);
			},

			/**
		     * Add a formatter to the formatter stack
		     * @param {Object} formatter The formatter object 
		     * @method addFormatter
		     */												
			addFormatter: function(formatter) {
				formatter && (formatters[formatter.id] = formatter);
			},
			
		    /**
		     * Retrieves a formatter for use.
		     * @param {String} formatId The name of the format to retrieve.
		     * @return {Object} The formatter or undefined.
		     * @method getFormatter
		     */			
			getFormatter: function(formatId) {
				return formatters[formatId];
			}
		};
	}();
	
	// Adding formatters to the spof api
	spofApi.addFormatter({
		// Formatter metadata
		id: "junit-xml",
		name: "JUNIT XML format",
		extension: "xml",
		
	    /**
	     * Return opening root XML tag.
	     * @return {String} to prepend before all results
	     */
	    startFormat: function(){
	        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites>";
	    },

	    /**
	     * Return closing root XML tag.
	     * @return {String} to append after all results
	     */
	    endFormat: function() {
	        return "</testsuites>";
	    },
		
	    /**
	     * Given spof results for a url, return output for this format.
	     * @param {Object} results with error and warning messages
	     * @param {String} url The url for which the spof ran
	     * @return {String} output for results
	     */
	    formatResults: function(results, url) {

	        var messages = results.messages,
	            output = [],
	            tests = {
	                'error': 0,
	                'failure': 0
	            };

	        /**
	         * Generate a source string for a rule.
	         * JUNIT source strings usually resemble Java class names e.g
	         * net.spof.SomeRuleName
	         * @param {Object} rule
	         * @return rule source as {String}
	         */
	        var generateSource = function(rule) {
	            if (!rule || !('name' in rule)) {
	                return "";
	            }
	            return 'net.spof.' + rule.name.replace(/\s/g,'');
	        };

	        /**
	         * Replace special characters before write to output.
	         *
	         * Rules:
	         *  - single quotes is the escape sequence for double-quotes
	         *  - &lt; is the escape sequence for <
	         *  - &gt; is the escape sequence for >
	         *
	         * @param {String} message to escape
	         * @return escaped message as {String}
	         */
	        var escapeSpecialCharacters = function(str) {

	            if (!str || str.constructor !== String) {
	                return "";
	            }

	            return str.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;");

	        };

	        if (messages.length > 0) {
	            messages.forEach(function (message, i) {
	                // since junit has no warning class
	                // all issues as errors
	                var type = message.type === 'warning' ? 'error' : message.type;

                    // build the test case seperately, once joined
                    // we'll add it to a custom array filtered by type
                    output.push("<testcase time=\"0\" name=\"" + generateSource(message.rule) + "\">");
                    output.push("<" + type + " message=\"" + escapeSpecialCharacters(message.message + " Fix: " + message.rule.desc) + "\"><![CDATA[" + 'entity=' + message.entity + ':score=' + message.score + "%]]></" + type + ">");
                    output.push("</testcase>");
                    tests[type] += 1;	                
	            });
	            output.unshift("<testsuite time=\"0\" tests=\"" + messages.length + "\" skipped=\"0\" errors=\"" + tests.error + "\" failures=\"" + tests.failure + "\" package=\"net.spof\" name=\"" + url + "\">");
	            output.push("</testsuite>");
	        }
	        return output.join("");
	    }
	});
	
	spofApi.addFormatter({
	    // Formatter metadata
	    id: "text",
	    name: "Plain Text",
	    extension: "text",

	    /**
	     * Return content to be printed before all file results.
	     * @return {String} to prepend before all results
	     */
	    startFormat: function() {
	        return "";
	    },

	    /**
	     * Return content to be printed after all file results.
	     * @return {String} to append after all results
	     */
	    endFormat: function() {
	        return "";
	    },

	    /**
	     * Given spof results for a url, return output for this format.
	     * @param {Object} results with error and warning messages
	     * @param {String} url The url for which the spof ran
	     * @return {String} output for results
	     */
	    formatResults: function(results, url) {
	        var messages = results.messages,
	            output = "";

	        if (messages.length === 0) {
	            return "\nspof: " + url + " is SPOF free.";
	        }

	        output = "\nspof: There are " + messages.length  +  " problems in " + url + ".";

	        messages.forEach(function (message, i) {
                output += "\n\n" + (i+1) + ". " + message.message;
                output += "\n" + "Severity: " + message.type;
                output += "\n" + "Entity: " + message.entity;
                output += "\n" + "Score: " + message.score;
                output += "\n" + "Fix: " + message.rule.desc;
	        });
	        
	        output += "\n";
	        
	        return output;
	    }
	});	

	spofApi.addFormatter({
	    // Formatter metadata
	    id: "spof-xml",
	    name: "SPOF XML format",
	    extension: "xml",

	    /**
	     * Return content to be printed before all file results.
	     * @return {String} to prepend before all results
	     */
	    startFormat: function() {
	    	return "<?xml version=\"1.0\" encoding=\"utf-8\"?><spof>";
	    },

	    /**
	     * Return content to be printed after all file results.
	     * @return {String} to append after all results
	     */
	    endFormat: function() {
	        return "</spof>";
	    },

	    /**
	     * Given spof results for a url, return output for this format.
	     * @param {Object} results with error and warning messages
	     * @param {String} url The url for which the spof ran
	     * @return {String} output for results
	     */
	    formatResults: function(results, url) {
	        var messages = results.messages,
            output = [];

	        /**
	         * Replace special characters before write to output.
	         *
	         * Rules:
	         *  - single quotes is the escape sequence for double-quotes
	         *  - &amp; is the escape sequence for &
	         *  - &lt; is the escape sequence for <
	         *  - &gt; is the escape sequence for >
	         * 
	         * @param {String} message to escape
	         * @return escaped message as {String}
	         */
	        var escapeSpecialCharacters = function(str) {
	            if (!str || str.constructor !== String) {
	                return "";
	            }
	            return str.replace(/\"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	        };
	
	        if (messages.length > 0) {
	            output.push("<url location=\"" + url + "\">");
	            messages.forEach(function (message, i) {
                    output.push("<issue enity=\"" + message.entity + "\" score=\"" + message.score + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + escapeSpecialCharacters(message.message) + "\" fix=\"" + escapeSpecialCharacters(message.rule.desc) + "\"/>");	                
	            });
	            output.push("</url>");
	        }
	
	        return output.join("");
	    }
	});		
	
	// Exporting the spof api to the global scope, based on environment
	if(typeof exports != 'undefined') {
		exports.spof = spofApi;	
	} else {
		spof = spofApi;
	}
}(exports);