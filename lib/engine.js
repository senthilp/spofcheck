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
	     * @param {int} severity The severity of the issue.
	     * @param {Object} rule The rule this message relates to.
	     * @param {String} type (optional) The type of the finding, default is info.
	     * @method report
	     */		
		report: function(message, entity, severity, rule, type) {
			this._messages.push({
				type: type || "info",
				message: message,
				entity: entity,
				severity: severity,
				rule: rule || {}
			});
		},
		
	    /**
	     * Report an error.
	     * @param {String} message The message to store.
	     * @param {String} entity The entity which caused the issue.
	     * @param {int} severity The severity of the issue.
	     * @param {Object} rule The rule this message relates to.
	     * @method report
	     */				
		error: function(message, entity, severity, rule) {
			this.report(message, entity, severity, rule, 'error');
		},

	    /**
	     * Report a warning.
	     * @param {String} message The message to store.
	     * @param {String} entity The entity which caused the issue.
	     * @param {int} severity The severity of the issue.
	     * @param {Object} rule The rule this message relates to.
	     * @method report
	     */						
		warn: function(message, entity, severity, rule) {
			this.report(message, entity, severity, rule, 'warn');
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
				formatter && formatters.push(formatter);
			}
		};
	}();
	
	// Exporting the spof api to the global scope, based on environment
	if(typeof exports != 'undefined') {
		exports.spof = spofApi;	
	} else {
		spof = spofApi;
	}
}(exports);