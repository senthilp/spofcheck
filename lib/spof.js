// Defining the Global spof object, will be used in non-node environments
var spof = {};

!function(spof) {
	spof.analyze = function(pageContent, cssContent, $){
		console.log('\n PAGE CONTENT: \n' + pageContent.substring(0, 100).trim() + '\n CSS CONTENT: \n' + cssContent.substring(0, 100));
	};
}(typeof exports != 'undefined'? exports: spof);