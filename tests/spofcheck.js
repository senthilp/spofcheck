/**
 * Copyright (c) 2012 eBay Inc.
 * Author: Senthil Padmanabhan
 *
 * Released under the MIT License
 * http://www.opensource.org/licenses/MIT
 *
 * spofcheck.js
 *
 * Test suite for the spofcheck CLI
 *
 */

var exec = require('child_process').exec,
    assert = require('assert'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    spofcheck = require('../bin/spofcheck'); // SPOFCheck programmable API

/**
 * Basic with no options
 */
exec('node bin/spofcheck', function(error, stdout) {
    if (error) {
        throw error;
    }
    assert(typeof stdout === 'string', 'Should output help text, when called with no options');
    assert(/USAGE/.test(stdout), 'Outputs USAGE text');
    assert(/Example/.test(stdout), 'Outputs an example on how to use spofcheck');
});

/**
 * Rule: Load 3rd Party JS Asynchronously
 * Formatter: junit-xml
 * URL: http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html
 */
exec('node bin/spofcheck -p -q -r 3rdparty-scripts http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Load 3rd Party JS Asynchronously',
            formatter = 'junit-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html',
            message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
        assert(stdout !== '', 'Should print results for ' + message);
        assert(/<\?xml version="1.0" encoding="utf-8"\?><testsuites>[\s\S]*?<\/testsuites>/.test(stdout),
            'Should print results in junit-xml format for ' + message);
        assert(/ERROR: Possible SPOF attack due to 3rd party script/.test(stdout),
            'Should print error message for ' + message);
    }
);

/**
 * Rule: Load 3rd Party JS Asynchronously
 * Formatter: text
 * URL: http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html
 */
exec('node bin/spofcheck -p -q -r 3rdparty-scripts -f text http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Load 3rd Party JS Asynchronously',
            formatter = 'text',
            url = 'http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html',
            message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
        assert(stdout !== '', 'Should print results for ' + message);
        assert(/spof:[\s\S\n]*?Severity:[\s\S\n]*?Entity:[\s\S\n]*?Score:[\s\S\n]*?Fix:/.test(stdout),
            'Should print results in junit-xml format for ' + message);
        assert(/ERROR: Possible SPOF attack due to 3rd party script/.test(stdout),
            'Should print error message for ' + message);
    }
);

/**
 * Rule: Load 3rd Party JS Asynchronously
 * Formatter: spof-xml
 * URL: http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html
 */
exec('node bin/spofcheck -p -q -r 3rdparty-scripts -f spof-xml http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Load 3rd Party JS Asynchronously',
            formatter = 'spof-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html',
            message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
        assert(stdout !== '', 'Should print results for ' + message);
        assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout),
            'Should print results in junit-xml format for ' + message);
        assert(/ERROR: Possible SPOF attack due to 3rd party script/.test(stdout),
            'Should print error message for ' + message);
    }
);

/**
 * Rule: Load Application JS Non-blocking
 * Formatter: junit-xml
 * URL: http://senthilp.github.com/spofcheck/tests/application-js.html
 */
exec('node bin/spofcheck -p -q -r application-js http://senthilp.github.com/spofcheck/tests/application-js.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Load Application JS Non-blocking',
            formatter = 'junit-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/application-js.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/application-js.html
 */
exec('node bin/spofcheck -p -q -r application-js -f text http://senthilp.github.com/spofcheck/tests/application-js.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Load Application JS Non-blocking',
            formatter = 'text',
            url = 'http://senthilp.github.com/spofcheck/tests/application-js.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/application-js.html
 */
exec('node bin/spofcheck -p -q -r application-js -f spof-xml http://senthilp.github.com/spofcheck/tests/application-js.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Load Application JS Non-blocking',
            formatter = 'spof-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/application-js.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html
 */
exec('node bin/spofcheck -p -q -r fontface-stylesheet http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Stylesheet With @font-face',
            formatter = 'junit-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html
 */
exec('node bin/spofcheck -p -q -r fontface-stylesheet -f text http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Stylesheet With @font-face',
            formatter = 'text',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html
 */
exec('node bin/spofcheck -p -q -r fontface-stylesheet -f spof-xml http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Stylesheet With @font-face',
            formatter = 'spof-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-stylesheet.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-inline.html
 */
exec('node bin/spofcheck -p -q -r fontface-inline http://senthilp.github.com/spofcheck/tests/fontface-inline.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Inline @font-face',
            formatter = 'junit-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-inline.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-inline.html
 */
exec('node bin/spofcheck -p -q -r fontface-inline -f text http://senthilp.github.com/spofcheck/tests/fontface-inline.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Inline @font-face',
            formatter = 'text',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-inline.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-inline.html
 */
exec('node bin/spofcheck -p -q -r fontface-inline -f spof-xml http://senthilp.github.com/spofcheck/tests/fontface-inline.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Inline @font-face',
            formatter = 'spof-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-inline.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html
 */
exec('node bin/spofcheck -p -q -r fontface-inline-precede-script-IE http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Inline @font-face precede Script tag IE issue',
            formatter = 'junit-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html
 */
exec('node bin/spofcheck -p -q -r fontface-inline-precede-script-IE -f text http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Inline @font-face precede Script tag IE issue',
            formatter = 'text',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html',
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
 * URL: http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html
 */
exec('node bin/spofcheck -p -q -r fontface-inline-precede-script-IE -f spof-xml http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html', {
        "timeout": 20000
    },
    function(error, stdout) {
        if (error) {
            throw error;
        }
        var rule = 'Inline @font-face precede Script tag IE issue',
            formatter = 'spof-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/fontface-inline-precede-script-IE.html',
            message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
        assert(stdout !== '', 'Should print results for ' + message);
        assert(/<\?xml version="1.0" encoding="utf-8"\?><spof>[\s\S]*?<\/spof>/.test(stdout),
            'Should print results in spof-xml format for ' + message);
        assert(/WARNING: Possible SPOF attack in IE due to [\s\S]*?inline @font-face preceded by a SCRIPT tag/.test(stdout),
            'Should print warning message for ' + message);
    }
);

/**
 * Save to Disk, verifying --outputdir option
 * Rule: Load Application JS Non-blocking
 * Formatter: junit-xml
 * URL: http://senthilp.github.com/spofcheck/tests/application-js.html
 */
exec('node bin/spofcheck -o dist/spof -q http://senthilp.github.com/spofcheck/tests/application-js.html', {
        "timeout": 20000
    },
    function(error) {
        if (error) {
            throw error;
        }
        var rule = 'Load Application JS Non-blocking',
            formatter = 'junit-xml',
            url = 'http://senthilp.github.com/spofcheck/tests/application-js.html',
            message = 'Rule: ' + rule + ', Formatter: ' + formatter + ', URL: ' + url;
        assert(fs.existsSync('dist/spof'), 'dist/spof directory should be created for ' + message);
        assert(fs.existsSync('dist/spof/junit-xml.xml'), 'dist/spof/junit-xml.xml should be file created for ' + message);
        rimraf.sync('dist');
    }
);

/** Programmable API test **/
/**
 * Empty URL test
 */
spofcheck.run('').then(function() {}, function(errorObj) {
    assert(/USAGE/i.test(errorObj.message), 'Programmable API: Should output usage text when no URLs are provided');
}).done();

/**
 * Invalid URL test
 */
spofcheck.run('www.invalidurlneverexists.com').then(function() {}, function(errorObj) {
    assert(/invalidurlneverexists/.test(errorObj.message), 'Programmable API: ' + errorObj.message);
}).done();

/**
 * Invalid format test
 */
spofcheck.run('http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html', {
    "format": "xml"
}).then(function() {}, function(errorObj) {
    assert(/format/i.test(errorObj.message), 'Programmable API: Should output an unknown format error message');
}).done();

/**
 * Invalid rule check
 */
spofcheck.run('http://senthilp.github.com/spofcheck/tests/application-js.html', {
    rules: ['invalid-rule']
}).then(function() {}, function(errorObj) {
    assert(/invalid-rule/.test(errorObj.message), 'Programmable API: ' + errorObj.message);
}).done();

/**
 * Valid URL test for 3rdparty-scripts rule
 */
spofcheck.run('http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html', {
    rules: ['3rdparty-scripts']
}).then(function(results) {
    results[0].messages.forEach(function(message) {
        assert(message.rule.id === '3rdparty-scripts', 'Programmable API: The rule ID should be 3rdparty-scripts instead of ' + message.rule.id);
    });
}).done();

/**
 * Multiple URL test for 3rdparty-scripts rule
 */
spofcheck.run(['http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html', 'http://senthilp.github.com/spofcheck/tests/3rdparty-scripts.html']).then(function(results) {
    assert(results.length === 2, 'Programmable API: Should have results for 2 URLs');
}).done();
