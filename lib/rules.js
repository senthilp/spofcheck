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
		var rule = this,
			// Known 3rd-party assets
			// Ref: https://github.com/pmeenan/spof-o-matic/blob/master/src/background.js
			BLOCK_PATTERN = [
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
                 '.*\.lognornal\.com'
		    ],
		    is3p = function(url) {
				var patterns = BLOCK_PATTERN,
					i,
					l,
					regEx;
				
				for(i = 0, l = patterns.length; i < l; i++) {
					regEx = new RegExp(patterns[i], 'im');
					if(regEx.test(url)) {
						return true;
					}
				}
				return false;
			},
			html = $('html').html(),
			pageLength = html.length,
			scripts = $('script'),
			getSeverity = function(src) {
				var value = 100 - (((html.indexOf(src) + src.length) / pageLength ) * 100);
				return Math.round(value);
			},
			i,
			l,
			script,
			src;
			
		for(i = 0, l = scripts.length; i < l; i++) {
			script = scripts[i];
			src = script.src;
			if(src && is3p(src)) {
				if(!script.defer || !script.async) {
					reporter.error("ERROR: Possible SPOF attack due to 3rd party script - " + src, src, getSeverity(src), rule);			
				}
			}
		}		
	}
});

// Exporting the rules for node environment
if(typeof exports != 'undefined') {
	exports.rules = rules;	
} 	
