 [![Build Status](https://secure.travis-ci.org/senthilp/spofcheck.png?branch=master)](https://travis-ci.org/senthilp/spofcheck)
##SPOFCheck - FIghting Frontend [SPOF](http://en.wikipedia.org/wiki/Single_point_of_failure) at its origin

With the increase in 3rd party widgets and modernization of web applications, Frontend Single Point Of Failure (SPOF) has 
become a critical focus point. Thanks to [Steve Souders](https://twitter.com/souders) for his 
[initial research](http://www.stevesouders.com/blog/2010/06/01/frontend-spof/) 
on this topic, we now have a list of common patterns which causes SPOF. The awareness of Frontend SPOF has also increased 
tremendously among engineers, thanks to some of the recent blogs and [articles](http://calendar.perfplanet.com/2012/spof-bug/) 
emphasizing the importance of it.  

There are already a bunch of utilities and plugins out there which can detect possible SPOF vulnerabilities in a web application. 
The most notable ones are [webpagetest.org](http://blog.patrickmeenan.com/2011/10/testing-for-frontend-spof.html), 
[SPOF-O-Matic](https://chrome.google.com/webstore/detail/spof-o-matic/plikhggfbplemddobondkeogomgoodeg?hl=en-US) chrome 
plugin and [YSlow 3PO](http://www.phpied.com/3po/) extension.  

spofcheck is a [Command Line Interface](http://en.wikipedia.org/wiki/Command-line_interface) built in Node.js to detect 
possible Frontend SPOF for web pages. The output is generated in an XML format
that can be consumed by [CI](http://en.wikipedia.org/wiki/Continuous_integration) jobs. 
