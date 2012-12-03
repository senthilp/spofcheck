var exec   = require('child_process').exec,
	assert = require('assert'), 
	fs     = require('fs'),
	rimraf = require('rimraf');

/**
 * Basic with no options
 */
exec('node bin/spofcheck', function(error, stdout, stderr) {
	if(error) {
		throw error;
	}
	assert(typeof stdout == 'string', 'Should output help text, when called with no options');
	assert(/USAGE/.test(stdout), 'Outputs USAGE text');
	assert(/Example/.test(stdout), 'Outputs an example on how to use spofcheck');
});

/**
 * Rule: Load 3rd Party JS Asynchronously
 * Formatter: junit-xml
 * URL: http://techcrunch.com/
 */
exec('node bin/spofcheck -p -q http://techcrunch.com/', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Load 3rd Party JS Asynchronously',
			formatter = 'junit-xml',
			url = 'http://techcrunch.com/',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><testsuites>[\s\S]*?<\/testsuites>/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/ERROR: Possible SPOF attack due to 3rd party script/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Load 3rd Party JS Asynchronously
 * Formatter: text
 * URL: http://techcrunch.com/
 */
exec('node bin/spofcheck -p -q -f text http://techcrunch.com/', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Load 3rd Party JS Asynchronously',
			formatter = 'text',
			url = 'http://techcrunch.com/',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/spof:[\s\S\n]*?Severity:[\s\S\n]*?Entity:[\s\S\n]*?Score:[\s\S\n]*?Fix:/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/ERROR: Possible SPOF attack due to 3rd party script/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Load 3rd Party JS Asynchronously
 * Formatter: spof-xml
 * URL: http://techcrunch.com/
 */
exec('node bin/spofcheck -p -q -f spof-xml http://techcrunch.com/', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Load 3rd Party JS Asynchronously',
			formatter = 'spof-xml',
			url = 'http://techcrunch.com/',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/ERROR: Possible SPOF attack due to 3rd party script/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Load Application JS Non-blocking
 * Formatter: junit-xml
 * URL: http://stevesouders.com/tests/spof/slow-script.php
 */
exec('node bin/spofcheck -p -q http://stevesouders.com/tests/spof/slow-script.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Load Application JS Non-blocking',
			formatter = 'junit-xml',
			url = 'http://stevesouders.com/tests/spof/slow-script.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><testsuites>[\s\S]*?<\/testsuites>/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack due to script/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Load Application JS Non-blocking
 * Formatter: text
 * URL: http://stevesouders.com/tests/spof/slow-script.php
 */
exec('node bin/spofcheck -p -q -f text http://stevesouders.com/tests/spof/slow-script.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Load Application JS Non-blocking',
			formatter = 'text',
			url = 'http://stevesouders.com/tests/spof/slow-script.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/spof:[\s\S\n]*?Severity:[\s\S\n]*?Entity:[\s\S\n]*?Score:[\s\S\n]*?Fix:/.test(stdout), 
				'Should print results in text format for ' + message);
		assert(/WARNING: Possible SPOF attack due to script/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Load Application JS Non-blocking
 * Formatter: spof-xml
 * URL: http://stevesouders.com/tests/spof/slow-script.php
 */
exec('node bin/spofcheck -p -q -f spof-xml http://stevesouders.com/tests/spof/slow-script.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Load Application JS Non-blocking',
			formatter = 'spof-xml',
			url = 'http://stevesouders.com/tests/spof/slow-script.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout), 
				'Should print results in spof-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack due to script/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Stylesheet With @font-face
 * Formatter: junit-xml
 * URL: http://stevesouders.com/tests/spof/slow-font-stylesheet.php
 */
exec('node bin/spofcheck -p -q http://stevesouders.com/tests/spof/slow-font-stylesheet.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Stylesheet With @font-face',
			formatter = 'junit-xml',
			url = 'http://stevesouders.com/tests/spof/slow-font-stylesheet.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><testsuites>[\s\S]*?<\/testsuites>/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack due to @font-face style in external stylesheet/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Stylesheet With @font-face
 * Formatter: text
 * URL: http://stevesouders.com/tests/spof/slow-font-stylesheet.php
 */
exec('node bin/spofcheck -p -q -f text http://stevesouders.com/tests/spof/slow-font-stylesheet.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Stylesheet With @font-face',
			formatter = 'text',
			url = 'http://stevesouders.com/tests/spof/slow-font-stylesheet.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/spof:[\s\S\n]*?Severity:[\s\S\n]*?Entity:[\s\S\n]*?Score:[\s\S\n]*?Fix:/.test(stdout), 
				'Should print results in text format for ' + message);
		assert(/WARNING: Possible SPOF attack due to @font-face style in external stylesheet/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Stylesheet With @font-face
 * Formatter: spof-xml
 * URL: http://stevesouders.com/tests/spof/slow-font-stylesheet.php
 */
exec('node bin/spofcheck -p -q -f spof-xml http://stevesouders.com/tests/spof/slow-font-stylesheet.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Stylesheet With @font-face',
			formatter = 'spof-xml',
			url = 'http://stevesouders.com/tests/spof/slow-font-stylesheet.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout), 
				'Should print results in spof-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack due to @font-face style in external stylesheet/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Inline @font-face
 * Formatter: junit-xml
 * URL: http://stevesouders.com/tests/spof/slow-font.php
 */
exec('node bin/spofcheck -p -q http://stevesouders.com/tests/spof/slow-font.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Inline @font-face',
			formatter = 'junit-xml',
			url = 'http://stevesouders.com/tests/spof/slow-font.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><testsuites>[\s\S]*?<\/testsuites>/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack due to inline @font-face style/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Inline @font-face
 * Formatter: text
 * URL: http://stevesouders.com/tests/spof/slow-font.php
 */
exec('node bin/spofcheck -p -q -f text http://stevesouders.com/tests/spof/slow-font.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Inline @font-face',
			formatter = 'text',
			url = 'http://stevesouders.com/tests/spof/slow-font.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/spof:[\s\S\n]*?Severity:[\s\S\n]*?Entity:[\s\S\n]*?Score:[\s\S\n]*?Fix:/.test(stdout), 
				'Should print results in text format for ' + message);
		assert(/WARNING: Possible SPOF attack due to inline @font-face style/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Inline @font-face
 * Formatter: spof-xml
 * URL: http://stevesouders.com/tests/spof/slow-font.php
 */
exec('node bin/spofcheck -p -q -f spof-xml http://stevesouders.com/tests/spof/slow-font.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Inline @font-face',
			formatter = 'spof-xml',
			url = 'http://stevesouders.com/tests/spof/slow-font.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout), 
				'Should print results in spof-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack due to inline @font-face style/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Inline @font-face precede Script tag IE issue
 * Formatter: junit-xml
 * URL: http://stevesouders.com/tests/spof/slow-font-script.php
 */
exec('node bin/spofcheck -p -q http://stevesouders.com/tests/spof/slow-font-script.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Inline @font-face precede Script tag IE issue',
			formatter = 'junit-xml',
			url = 'http://stevesouders.com/tests/spof/slow-font-script.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><testsuites>[\s\S]*?<\/testsuites>/.test(stdout), 
				'Should print results in junit-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack in IE due to [\s\S]*?inline @font-face preceded by a SCRIPT tag/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Inline @font-face precede Script tag IE issue
 * Formatter: text
 * URL: http://stevesouders.com/tests/spof/slow-font-script.php
 */
exec('node bin/spofcheck -p -q -f text http://stevesouders.com/tests/spof/slow-font-script.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Inline @font-face precede Script tag IE issue',
			formatter = 'text',
			url = 'http://stevesouders.com/tests/spof/slow-font-script.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/spof:[\s\S\n]*?Severity:[\s\S\n]*?Entity:[\s\S\n]*?Score:[\s\S\n]*?Fix:/.test(stdout), 
				'Should print results in text format for ' + message);
		assert(/WARNING: Possible SPOF attack in IE due to [\s\S]*?inline @font-face preceded by a SCRIPT tag/.test(stdout), 
				'Should print warning message for ' + message);
	}
);

/**
 * Rule: Inline @font-face precede Script tag IE issue
 * Formatter: spof-xml
 * URL: http://stevesouders.com/tests/spof/slow-font-script.php
 */
exec('node bin/spofcheck -p -q -f spof-xml http://stevesouders.com/tests/spof/slow-font-script.php', 
	{
		"timeout": 5000
	},
	function(error, stdout, stderr) {
		if(error) {
			throw error;
		}
		var rule = 'Inline @font-face precede Script tag IE issue',
			formatter = 'spof-xml',
			url = 'http://stevesouders.com/tests/spof/slow-font-script.php',
			message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
		assert(stdout !== '', 'Should print results for ' + message);
		assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout), 
				'Should print results in spof-xml format for ' + message);
		assert(/WARNING: Possible SPOF attack in IE due to [\s\S]*?inline @font-face preceded by a SCRIPT tag/.test(stdout), 
				'Should print warning message for ' + message);
	}
);