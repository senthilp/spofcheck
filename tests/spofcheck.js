var exec   = require('child_process').exec,
	assert = require('assert'), 
	fs     = require('fs'),
	rimraf = require('rimraf');

// Help message, when no options
exec('node bin/spofcheck', function(error, stdout, stderr) {
	if(error) {
		throw error;
	}
	assert(typeof stdout == 'string', 'Should output help text, when called with no options');
	assert(/USAGE/.test(stdout), 'Outputs USAGE text');
	assert(/Example/.test(stdout), 'Outputs an example on how to use spofcheck');
});

