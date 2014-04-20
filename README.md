# Tippekonkurranse

A simple Node-based web application (in norwegian).
In production [here][1].

[![Build Status](https://travis-ci.org/eirikt/tippekonkurranse.png?branch=master)](https://travis-ci.org/eirikt/tippekonkurranse)
&nbsp;&nbsp;&nbsp;
[![Coverage Status](https://coveralls.io/repos/eirikt/tippekonkurranse/badge.png?branch=master)](https://coveralls.io/r/eirikt/tippekonkurranse?branch=master)
&nbsp;&nbsp;&nbsp;
[![Dependency Status](https://david-dm.org/eirikt/tippekonkurranse.png)](https://david-dm.org/eirikt/tippekonkurranse)


## Scope
* Screen-scraping norwegian soccer result web pages
* Simple calculations
* Simple presentation
* Deployment to [Heroku][30]


## Version history/roadmap

#### v0.0.1 : Single-local-file browser-app version
_Abandoned!_ Couldn't find any CORS/JSONP-supporting Tippeliga data service ...

#### v0.0.2 : Initial server version (proof-of-concept)
* Establish (minimalistic) server version with Node.js
* Very minimalistic client version (just a web page skeleton)
* ~~[Deploy][31] to Heroku => http://lit-ravine-2113.herokuapp.com~~
* [Deploy][31] to Heroku => http://tippekonkurranse.herokuapp.com
* ~~Custom shortened URL using [Tiny.cc][40] => http://tiny.cc/tippekonkurranse~~ (obsolete)
* Deploy it!

_Status: OK_

#### v0.0.3 : Remote data retrieval (proof-of-concept) (server-side)
* ~~Try get Tippeliga data from some service => [NFF][10] (no live updates)~~
* Try get Tippeliga data from some service => [altomfotball.no][11]
* Screen-scrape and parse data (server-side), e.g. like [this][20]
* Acquire Tippeliga information

_Status: OK_

#### v0.0.4 : User data and business rules (proof-of-concept)
* Establish user data model and business rules logic
* Implement "tabellplassering" points calculations

_Status: OK_

#### v0.0.5 : Demo/placeholder web-site
* Establish simple campaign-like client-side UX
* First presentable version ...
* Launch it!

_Status: OK_

#### v0.0.6 : Client-side UX for showing table results

_Status: OK_

#### v0.0.7 : RESTful service calls from client
* Add some test user data

_Status: OK_

#### v0.0.8 : Business logic
* Implement "pall" points calculations
* Implement "cupmester" point calculations
* Implement "toppscorer" point calculations

_Status: OK_

#### v0.0.9 : More business logic
* Implement "tippeliga-nedrykk" point calculations

_Status: OK_

#### v0.0.10 : UX
* Complete adding of user predictions for this year
* Proper participant rating numbers
* Automatic page refresh

_Status: OK_

#### v0.0.11 : Last iteration
* Implement "adecco-opprykk" point calculations
* Add specifications
* Feedback and fixes ...

_Status: OK_

#### v1.0.0 : _Delivery goal 06.04.2014_
* __First feature-complete version__

_Status: OK_

#### v1.1.0 : _Delivery goal 16.04.2014_
* Persistent data with MongoDB
* Tendency markers in table (moving up or down compared to previous round)

_Status: OK_

#### v1.1.1 : _Delivery goal 21.04.2014_
* View all user's predictions

_Status: OK_

...

#### v1.1.2 : _Delivery goal 27.04.2014_
* View current Tippeliga table, and other relevant results

_Status: In progress_

#### v1.1.3 : _Delivery goal 04.05.2014_
* Revisit automatic reload of page
* Simple countdown timer

_Status: In progress_

#### v1.2 : _Delivery goal 01.06.2014_
* Some simple presentation of historic data

_Status: In progress_

#### v1.2.x
* More cool graphs and whatnot

#### v? : Touch/Mobile
* Mobile app
* Touch-friendly version
* ~~Small-screen-friendly version ...~~ Seems to be just fine

#### v? : Proper URL
* [Heroku/Custom domains][31]

#### v? : Offline support
* Create offline-capable solution just for the heck of it

#### v? : Some kind of Facebook integration
* User image
* Inline presentation of tippekonkurranse standings

#### v? : Public and official! Tippeliga data service
* Verify/validate data micro-formats in use
* Establish proper REST service for Tippeliga data for everybody to use without leaning to crappy web scraping routines
* Brag about it

#### v? : Admin UI
* Admin UI for data management

#### v? : Public web app
* Establish multi-tenant 'Tippeligakonkurranse' groups with full web-based user- and group administration


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


[1]:  http://tippekonkurranse.herokuapp.com
[10]: http://www.fotball.no/Landslag_og_toppfotball/Toppfotball/tippeligaen
[11]: http://www.altomfotball.no
[20]: https://www.digitalocean.com/community/articles/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping
[30]: https://www.heroku.com
[31]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
[32]: https://devcenter.heroku.com/articles/custom-domains
[40]: http://tiny.cc
