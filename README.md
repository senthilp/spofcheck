 [![Build Status](https://secure.travis-ci.org/senthilp/spofcheck.png?branch=master)](https://travis-ci.org/senthilp/spofcheck)
##SPOFCheck - FIghting Frontend [SPOF](http://en.wikipedia.org/wiki/Single_point_of_failure) at its root

With the increase in 3rd party widgets and modernization of web applications, Frontend Single Point Of Failure (SPOF) has 
become a critical focus point. Thanks to [Steve Souders](https://twitter.com/souders) for his 
[initial research](http://www.stevesouders.com/blog/2010/06/01/frontend-spof/) 
on this topic, we now have a list of common patterns which causes SPOF. The awareness of Frontend SPOF has also increased 
tremendously among engineers, thanks to some of the recent blogs and [articles](http://calendar.perfplanet.com/2012/spof-bug/) 
emphasizing the importance of it.  

There are already a bunch of utilities and plugins out there which can detect possible SPOF vulnerabilities in a web application. 
The most notable ones being [webpagetest.org](http://blog.patrickmeenan.com/2011/10/testing-for-frontend-spof.html), 
[SPOF-O-Matic](https://chrome.google.com/webstore/detail/spof-o-matic/plikhggfbplemddobondkeogomgoodeg?hl=en-US) chrome 
plugin and [YSlow 3PO](http://www.phpied.com/3po/) extension. At eBay we wanted to detect SPOF at a very early stage, during
the development cycle itself. This means an additional hook in our automated testing pipeline. The solution resulted in 
creating a simple tool which works on our test URLs and produces SPOF alerts. The tool is **spofcheck**.

spofcheck is a [Command Line Interface](http://en.wikipedia.org/wiki/Command-line_interface) (CLI) built in Node.js to detect 
possible Frontend SPOF for web pages. The output is generated in an XML format
that can be consumed and reported by [CI](http://en.wikipedia.org/wiki/Continuous_integration) jobs. The tool is integrated 
with our secondary jobs, which run daily automation on a testing server where a development branch is deployed. In case of 
a SPOF alert, engineers are notified and they act on it accordingly. This process ensures that SPOFs are contained within 
the development cycle and do not sneak into staging or production. 

Thanks to github projects [spof-o-matic](https://github.com/pmeenan/spof-o-matic) and [3po](https://github.com/stoyan/yslow), 
a lot of the code logic has been re-used here. The design and packaging of the tool is based on [csslint](https://github.com/stubbornella/csslint), 
thanks to [Nicholas Zakas](https://twitter.com/slicknet) and [Nicole Sullivan](https://twitter.com/stubbornella).

##The command line interface
spofcheck provides a simple command line interface and runs on Node.js 

To install spofcheck run the following

    $ npm install -g spofcheck

To run spofcheck, use the following format

    spofcheck [options]* [urls]*
    
    Options
    --help | -h                       		     Displays this information.
    --format=<format> | -f <format>   		     Indicate which format [junit-xml | spof-xml | text] to use for output.
    --outputdir=<dir> | -o <dir>      		     Outputs the spof results to this directory.
    --rules=<rule[,rule]+> | -r <rule[,rule]+>   Indicate which rules to include.
    --print | -p                      		     Outputs the results in console, instead of saving to a file.
    --quiet | -q                      		     Keeps the console clear from logging.

Example

    $ spofcheck -f junit-xml -o /tests www.ebay.com www.amazon.com

##Rules
spofcheck by default runs with 5 rules (checks). The rules are maintained in the [rules.js](https://github.com/senthilp/spofcheck/blob/master/lib/rules.js) 
file. New rules can be easily added by pushing entries to the [rules](https://github.com/senthilp/spofcheck/blob/master/lib/rules.js#L6) 
array or calling the spof api [registerRules](https://github.com/senthilp/spofcheck/blob/master/lib/engine.js#L142). The 
default rules comes from Souder's original [list](http://www.stevesouders.com/blog/2010/06/01/frontend-spof/) outlined below
 
1. `3rdparty-scripts` - Always load 3rd party external scripts asyncronously in a non-blocking pattern 
1. `application-js` - Load application JS in a non-blocking pattern or towards the end of page
1. `fontface-stylesheet` - Try to inline @font-face style. Also make the font files compressed and cacheable
1. `fontface-inline` - Make sure the fonts files are compressed, cached and small in size
1. `fontface-inline-precede-script-IE` - Make sure inlined @font-face is not preceded by a SCRIPT tag, causes SPOF in IE

##Output
spofcheck run creates a file and writes results in one of the below formats
* `junit-xml` - a format most ci servers can parse, the default format
* `spof-xml` - an XML format that can be consumed by other utilities
* `text` - a textual representation of the results

The format can be specified using the `--format` or `-f` option. For just printing results i.e. no file creation, use the 
`--print` or `-p` option

##Testing
Currently tests are written for the Command Line Interface as a whole and not individual modules. The main test file is [spofcheck.js](https://github.com/senthilp/spofcheck/blob/master/tests/spofcheck.js) 
and uses the default Node.js [assert](https://npmjs.org/package/assert) module. To run the tests - clone the [repo](https://github.com/senthilp/spofcheck), 
install the package `$ npm install` and execute

    $ npm test

##Issues
Have a bug or a feature request? [Please open a new issue](https://github.com/senthilp/spofcheck/issues)

##Authors
**Senthil Padmanabhan** - [github](https://github.com/senthilp) | [twitter](https://twitter.com/senthil_hi)
<br/>
**Venkat Sundramurthy** - [github](https://github.com/vsundramurthy) | [twitter](https://twitter.com/vsundramurthy)

##License 
