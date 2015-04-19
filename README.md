# Tippekonkurranse

A full-stack JavaScript-based web application,
using [Express][51],
persisting data using [Mongoose][53],
with server-side functional composition by [RQ][54],
and keeping client-side somewhat tidy and sane with [Backbone][60].[Marionette][61].
Hosted [here][1].

##### Badge-o-rama ...

[![Build Status](https://travis-ci.org/eirikt/tippekonkurranse.png?branch=master)](https://travis-ci.org/eirikt/tippekonkurranse)
&nbsp;&nbsp;&nbsp;
[![Codacy Badge](https://www.codacy.com/project/badge/4f9fda90eb834d27ae6cc2f539ae263c)](https://www.codacy.com/public/eiriktorske/tippekonkurranse)
&nbsp;&nbsp;&nbsp;
[![License](http://img.shields.io/badge/license-MIT-yellow.svg?style=flat)](https://github.com/eirikt/tippekonkurranse/blob/master/README.md#license)

<sub><sup>__Server-side__:</sup></sub> [![Dependency Status](https://www.versioneye.com/user/projects/54690c9395082540da000012/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54690c9395082540da000012)
&nbsp;&nbsp;&nbsp;
[![Coverage Status](https://coveralls.io/repos/eirikt/tippekonkurranse/badge.png?branch=master)](https://coveralls.io/r/eirikt/tippekonkurranse?branch=master)

<sub><sup>__Client-side__:</sup></sub> [![Dependency Status](https://www.versioneye.com/user/projects/54690c92950825928500000b/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54690c92950825928500000b)
&nbsp;&nbsp;&nbsp;
[![Sauce Test Status](https://saucelabs.com/browser-matrix/tippekonkurranse.svg)](https://saucelabs.com/u/tippekonkurranse)



## Scope
* Idiomatic code base
* Screen-scraping norwegian soccer result web pages
* Calculating rating and rank
* Simple multi-device-friendly presentation
* Deployment to [Heroku][30]



## Version history/roadmap

#### v1.3.3 : _Deployed 17.04.2015_
* UX: Better robustness when loading application

_Status: Done_



#### v1.3.2 : _Deployed 13.04.2015_
* Modal notification (with forced page reload) on new version downloaded

_Status: Done_


#### v1.3.1 : _Deployed 07.04.2015_
* Bugfixes

_Status: Done_


#### v1.3.0 : _Deployed 06.04.2015_
* Multi-season handling with proper archiving
* Show 'Gjeldende resultater' contextual to what round is actively chosen, as done with 'Trend'
* Configurable strategy-based rules for calculating scores. The rules may differ from year to year ...
* No more HTTP refresh, now real SPA
* A simple countdown timer for page data refresh
* Button for manual page data refresh
* Remove all JSON file backup, leave it to MongoDB
* Backbone.Marionette

_Status: Done_


#### v1.2.5 : _Deployed 23.11.2014_
* Results for 2014 season completed
* Heroku environment upgraded to Cedar-14
* Heroku buildpack dependency removed
* Dependencies update

_Status: Done_


#### v1.2.4 : _Deployed 09.11.2014_
* Refactorings: Cyclic complexity reduced to 5 (a couple of silly 7-exceptions only ...)
* Dependencies update
* Multi-browser testing with Sauce Labs

_Status: Done_


#### v1.2.3 : _Deployed 29.09.2014_
* Dependencies update (Node.js v0.10.32)

_Status: Done_


#### v1.2.2 : _Deployed 17.09.2014_
* Bugfix: "Gjeldende resultater"

_Status: Done_


#### v1.2.1 : _Deployed 14.09.2014_
* Navigating (via time-line) historic ratings and scores
* ~~Full screen option
  (Not supported in iOS, neither by Safari nor Chrome -> iPad useless :-\)
  (Not supported by Android Browser and scrolling disabled for Android Chrome it seems -> Android useless :-\)~~
* Automatic reload when Heroku single-dyno server sleeps/restart

_Status: Done_


#### v1.2.0 : ~~_Delivery goal 20.06.2014_~~ _Deployed 16.07.2014_
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

#### v? : User administration
* User admin
* Admin UI for data management

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

#### v? : Public web app
* Establish multi-tenant 'Tippeligakonkurranse' groups with full web-based user- and group administration

#### v? : Misc. improvements
* Multiple draggable windows, no more modals (with predictions and results): see http://stackoverflow.com/questions/13526712/make-div-draggable-using-css
* ~~Compress the wire with gzip~~ (Obsolete by AppCache usage really)
* Rewrite norwegian soccer result data retrieval to use
  http://www.nrk.no/sport/folg-hele-eliteserierunden-1.11601821
  and other resources from NRK



## [License](#license)
The MIT License (MIT)

Copyright (c) 2014-2015 Eirik Torske

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
[35]: https://mongolab.com

[50]: http://nodejs.org
[51]: http://expressjs.com
[52]: https://www.mongodb.org
[53]: http://mongoosejs.com
[54]: https://github.com/douglascrockford/RQ

[60]: http://backbonejs.org
[61]: http://marionettejs.com
