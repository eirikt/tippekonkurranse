# Tippekonkurranse

A simple, idiomatic, full-stack JavaScript-based web application,
persisting data using [MongoDB][51],
with server-side functional composition using [RQ][52],
and keeping client-side somewhat tidy with [Backbone][53].
In production [here][1].

[![Build Status](https://travis-ci.org/eirikt/tippekonkurranse.png?branch=master)](https://travis-ci.org/eirikt/tippekonkurranse)
&nbsp;&nbsp;&nbsp;
[![Coverage Status](https://coveralls.io/repos/eirikt/tippekonkurranse/badge.png?branch=master)](https://coveralls.io/r/eirikt/tippekonkurranse?branch=master)
&nbsp;&nbsp;&nbsp;
[![Dependency Status](https://david-dm.org/eirikt/tippekonkurranse.png)](https://david-dm.org/eirikt/tippekonkurranse)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/eirikt.svg)](https://saucelabs.com/u/eirikt)



## Scope
* Screen-scraping norwegian soccer result web pages
* Simple calculations
* Simple multi-device-friendly presentation
* Deployment to [Heroku][30]



## Version history/roadmap


#### v1.2.4 :
* Refactorings: Cyclic complexity reduced to 5 (one 8-exception only ...)
* Dependencies update
* Multi-browser testing with Sauce Labs

_Status: In progress_


#### v1.2.3 : _Delivered 29.09.2014_
* Dependencies update (Node.js v0.10.32)

_Status: Done_


#### v1.2.2 : _Delivered 17.09.2014_
* Bugfix: "Gjeldende resultater"

_Status: Done_


#### v1.2.1 : _Delivered 14.09.2014_
* Navigating (via time-line) historic ratings and scores
* ~~Full screen option
  (Not supported in iOS, neither by Safari nor Chrome -> iPad useless :-\)
  (Not supported by Android Browser and scrolling disabled for Android Chrome it seems -> Android useless :-\)~~
* Automatic reload when Heroku single-dyno server sleeps/restart

_Status: Done_


#### v1.2.0 : ~~_Delivery goal 20.06.2014_~~ _Delivered 16.07.2014_
* Simple graph presentation of historic rating trends

_Status: Done_


#### v1.1.6 : _Delivery goal 06.06.2014_
* Altered participant rating, skipping non-used rating numbers
* Bugfix: Sorting of participants

_Status: Done_


#### v1.1.5 : _Delivery goal 18.05.2014_
* Improved notifications with toastr
* Client-side routing established

_Status: Done_


#### v1.1.4 : _Delivery goal 05.05.2014_
* An attempt to make better Facebook URL presence ~~(must be tested/verified live)~~ yep, looks better
* Offline capability / Resilient against Tippekonkurranse server dropouts
* An attempt for improved response times with some caching
* Bugfix: Previous rating number (+ improved UX)

_Status: Done_


#### v1.1.3 : _Delivery goal 28.04.2014_
* View current Tippeliga results, and other relevant data
* Better touch device UX: uniform finger-friendly buttons
* Better touch device UX: remove hover striping
* Better touch device UX: colours and font sizes

_Status: Done_


#### v1.1.2 : Bugfix release
* Tippeliga 2014, round 4 bugfixes
* Bugfix: MongoDB won't save new data
* Bugfix: Won't update round with 16 ongoing matches (masked by previous bug :-)
* Bugfix: Previous rating sometimes dropping out

_Status: Done_


#### v1.1.1 : _Delivery goal 21.04.2014_
* View all user's predictions

_Status: Done_


#### v1.1.0 : _Delivery goal 16.04.2014_
* Persistent data with MongoDB
* Tendency markers in table (moving up or down compared to previous round)

_Status: Done_


#### v1.0.0 : _Delivery goal 06.04.2014_
* __First feature-complete version__

_Status: Done_


#### v0.0.11 : Last iteration
* Implement "adecco-opprykk" point calculations
* Add specifications
* Feedback and fixes ...

_Status: Done_


#### v0.0.10 : UX
* Complete adding of user predictions for this year
* Proper participant rating numbers
* Automatic page refresh

_Status: Done_


#### v0.0.9 : More business logic
* Implement "tippeliga-nedrykk" point calculations

_Status: Done_


#### v0.0.8 : Business logic
* Implement "pall" points calculations
* Implement "cupmester" point calculations
* Implement "toppscorer" point calculations

_Status: Done_


#### v0.0.7 : RESTful service calls from client
* Add some test user data

_Status: Done_


#### v0.0.6 : Client-side UX for showing table results

_Status: Done_


#### v0.0.5 : Demo/placeholder web-site
* Establish simple campaign-like client-side UX
* First presentable version ...
* Launch it!

_Status: Done_


#### v0.0.4 : User data and business rules (proof-of-concept)
* Establish user data model and business rules logic
* Implement "tabellplassering" points calculations

_Status: Done_


#### v0.0.3 : Remote data retrieval (proof-of-concept) (server-side)
* ~~Try get Tippeliga data from some service => [NFF][10] (no live updates)~~
* Try get Tippeliga data from some service => [altomfotball.no][11]
* Screen-scrape and parse data (server-side), e.g. like [this][20]
* Acquire Tippeliga information

_Status: Done_


#### v0.0.2 : Initial server version (proof-of-concept)
* Establish (minimalistic) server version with Node.js
* Very minimalistic client version (just a web page skeleton)
* ~~[Deploy][31] to Heroku => http://lit-ravine-2113.herokuapp.com~~
* [Deploy][31] to Heroku => http://tippekonkurranse.herokuapp.com
* ~~Custom shortened URL using [Tiny.cc][40] => http://tiny.cc/tippekonkurranse~~ (obsolete)
* Deploy it!

_Status: Done_


#### v0.0.1 : Single-local-file browser-app version
_Abandoned!_ Couldn't find any CORS/JSONP-supporting Tippeliga data service ...



## Backlog

#### v? : Touch/Mobile
* Mobile app, using Apache Cordova or something
* Touch-friendly version, uniform finger-friendly buttons
* ~~Touch-device aware => remove striping~~ Done!
* ~~Small-screen-friendly version ...~~ Seems to be just fine

#### v? : Proper URL
* [Heroku/Custom domains][31]

#### v? : Error handling
* Gather onerror-info via GitHub Issues API

#### v? : Some kind of Facebook integration
* User images
* Better Facebook URL presence: see http://stackoverflow.com/questions/1138460/how-does-facebook-sharer-select-images?lq=1
* More improved Facebook URL presence (large version)
* Inline presentation of tippekonkurranse standings ...
* Create Facebook custom story? (see https://developers.facebook.com/docs/opengraph)

#### v? : Better Apple/iOS presense
* Bookmarking thumbnails

#### v? : Public and official (hopefully) Tippeliga data service
* Verify/validate data micro-formats in use
* Establish proper REST service for Tippeliga data for everybody to use without leaning to crappy web scraping routines
* Brag about it

#### v? : Admin UI
* Admin UI for data management

#### v? : Public web app
* Establish multi-tenant 'Tippeligakonkurranse' groups with full web-based user- and group administration

#### v? : Misc. improvements
* Revisit automatic reloading of web page
* Simple countdown timer
* Real SPA instead of the HTTP refresh
* ~~Compress the wire with gzip~~ (Obsolete by AppCache usage really)
* Multiple draggable windows (with predictions and results): see http://stackoverflow.com/questions/13526712/make-div-draggable-using-css
* Show 'Gjeldende resultater' contextual to what round is actively chosen, as done with 'Trend'
* Rewrite norwegian soccer result data retrieval to use
  http://www.nrk.no/sport/folg-hele-eliteserierunden-1.11601821
  and other resources from NRK
* Configurable strategy-based rules for calculating scores. The rules may differ from year to year ...



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
[50]: http://nodejs.org
[51]: https://www.mongodb.org
[52]: https://github.com/douglascrockford/RQ
[53]: http://backbonejs.org
