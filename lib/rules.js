/**
 * A standalone rules array to hold the basic spof rules 
 * @property rules
 * @type Object[]
 */
var rules = [];

/**
 * Rule: Load 3rd party JS asynchronously
 */
rules.push({
	// Rule metadata
	id: "3rdparty-scripts",	
	name: "Load 3rd Party JS Asynchronously",	
	desc: "Always load 3rd party external scripts asyncronously to prevent frontend spof",
	
	// The check function to verify the rule
	check: function($, cssContent, reporter) {
		var rule = this;
		reporter.error("Test Message 1", "abc.com", 70, rule);
		reporter.error("Test Message 2", "xyz.com", 43, rule);
	}
});

// Exporting the rules for node environment
if(typeof exports != 'undefined') {
	exports.rules = rules;	
} 	
