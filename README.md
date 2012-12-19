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

spofcheck is a [Command Line Interface](http://en.wikipedia.org/wiki/Command-line_interface) built in Node.js to detect 
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

    npm install -g spofcheck

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

    spofcheck -f junit-xml -o /tests www.ebay.com www.amazon.com

##Rules
spofcheck by default runs with 5 rules. The rules are maintained in the [rules.js](https://github.com/senthilp/spofcheck/blob/master/lib/rules.js) 
file. New rules can be easily added by pushing entries to the [rules](https://github.com/senthilp/spofcheck/blob/master/lib/rules.js#L6) 
array or calling the spof api [registerRules](https://github.com/senthilp/spofcheck/blob/master/lib/engine.js#L142).     

