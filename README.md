 [![Build Status](https://secure.travis-ci.org/senthilp/spofcheck.png?branch=master)](https://travis-ci.org/senthilp/spofcheck)
##SPOFCheck - FIghting Frontend [SPOF](http://en.wikipedia.org/wiki/Single_point_of_failure) at its origin

With the increase in 3rd party widgets and modernization of web applications, Frontend Single Point Of Failure (SPOF) has 
become a critical focus point. Thanks to Steve Souders for his initial research on this topic we now have a list which 
causes this problem. 

spofcheck is a [Command Line Interface](http://en.wikipedia.org/wiki/Command-line_interface) built in Node.js to detect 
possible Frontend SPOF for web pages. The output is generated in an XML format
that can be consumed by [CI](http://en.wikipedia.org/wiki/Continuous_integration) jobs. 