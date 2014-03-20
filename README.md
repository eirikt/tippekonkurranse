# Tippekonkurranse

A simple Node-based web application (in norwegian).

[![Build Status](https://travis-ci.org/eirikt/tippekonkurranse.png?branch=master)](https://travis-ci.org/eirikt/tippekonkurranse)

[![Dependency Status](https://david-dm.org/eirikt/tippekonkurranse.png)](https://david-dm.org/eirikt/tippekonkurranse)
[![devDependency Status](https://david-dm.org/eirikt/tippekonkurranse/dev-status.png)](https://david-dm.org/eirikt/tippekonkurranse#info=devDependencies)


## Scope
* Screen-scraping norwegian soccer result web pages
* Simple calculations
* Simple presentation
* Deployment to [Heroku][30]


## Version history/roadmap

### v0.0.1 : Single-file browser-app version
_Abandoned!_ Couldn't find any CORS/JSONP-supporting Tippeliga data service ...

#### v0.0.2 : Initial server version (proof-of-concept)
* Establish (minimalistic) server version with Node.js
* Very minimalistic client version (just a web page skeleton)
* ~~[Deploy][31] to Heroku => http://lit-ravine-2113.herokuapp.com~~
* [Deploy][31] to Heroku => http://tippekonkurranse.herokuapp.com
* ~~Custom shortened URL using [Tiny.cc][40] => http://tiny.cc/tippekonkurranse~~ (obsolete)
* Deploy it!

_Status_: OK

#### v0.0.3 : Remote data retrieval (proof-of-concept) (server-side)
* Try get Tippeliga data from some service => [NFF][10]
* Screen-scrape and parse data (server-side), e.g. like [this][20]
* Acquire Tippeliga information

_Status_: OK

#### v0.0.4 : User data and business rules (proof-of-concept)
* Establish user data model and business rules logic
* Implement "tabellplassering" points calculations

_Status_: OK

#### v0.0.5 : Demo/placeholder web-site
* Establish simple campaign-like client-side UX
* First presentable version ...
* Launch it!

_Status_: OK

#### v0.0.6 :
* Add some test user data
* Establish RESTful service calls from client
* Implement "pall" points calculations

#### v0.0.7 :
* Implement "cupmester" point calculations
* Implement "toppscorer" point calculations

#### v0.0.8 :
* Implement "tippeliga-nedrykk" point calculations
* Implement "adecco-opprykk" point calculations

#### v0.0.9 :
* Feedback and fixes ...

#### v0.0.10
* Add/hard-code user predictions for this year

#### v0.0.11 :
* Feedback and fixes ...

#### v0.0.12 :
* Establish client-side UX for showing table results

#### v0.0.13 :
* Feedback and fixes ...

#### v1.0.0 : _Delivery goal 28.03.2014_
* __First feature-complete usable version__

#### v1.0.1 :
* Bugfixes

...

#### v1.1 : _Delivery goal 01.05.2014_
* Presentation of historic data

#### v1.1.x
* Graphs and whatnot

#### v2.0
* Mobile app
* Touch-friendly version ...
* Small-screen-friendly version ...

#### v2.x : Proper URL
* [Heroku/Custom domains][31]

#### v2.x
* Establish proper REST service for Tippeliga data for everybody to use without leaning to crappy web scraping routines ...


## License
The MIT License (MIT)

Copyright (c) 2014 Eirik Torske

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[1]:  http://tiny.cc/tippekonkurranse
[2]:  http://lit-ravine-2113.herokuapp.com
[10]: http://www.fotball.no/Landslag_og_toppfotball/Toppfotball/tippeligaen
[20]: https://www.digitalocean.com/community/articles/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
[30]: https://www.heroku.com
[31]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
[32]: https://devcenter.heroku.com/articles/custom-domains
[40]: http://tiny.cc
