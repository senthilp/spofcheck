// Defining the Global spof object, will be used in non-node environments
var spof = {};

!function(exports) {
	
	var spofApi = function() {
		
		var rulesStack = []; // A stack to hold the rules
		
		return {
			analyze: function($, cssContent, ruleset) {
				ruleset = ruleset? ruleset: this.getRules();  
				if(!ruleset.length) {
					throw new Error("Empty ruleset.");
				}
				console.log($('html').html());
				return "";
			},
			
			getRules: function() {
				return rulesStack;
			},
			
			setRules: function(rules) {
				rules = Array.isArray(rules)? rules: [rules];
				rules.forEach(function(rule) {
					rulesStack.push(rule);
				});				
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