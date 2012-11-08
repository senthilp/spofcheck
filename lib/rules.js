
var rules = {};

!function(exports) {
	
	rulesStack = [];
	
	// Adding first rule
	rulesStack.push({
		test: "senthil"		
	});
	
	// Exporting the rules to the global scope, based on environment
	if(typeof exports != 'undefined') {
		exports.rules = rulesStack;	
	} else {
		rules = rulesStack;
	}		
}(exports);