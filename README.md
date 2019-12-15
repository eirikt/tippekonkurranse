# Tippekonkurranse

A full-stack JavaScript-based web application,
using [Express][52],
persisting data using [Mongoose][54],
with server-side functional composition by [RQ][55],
and keeping client-side somewhat tidy and sane with [Backbone][61].[Marionette][62] and [RequireJS][60].
Hosted [here][1].

##### Badge-o-rama ...

[![Build Status](https://travis-ci.org/eirikt/tippekonkurranse.png?branch=master)](https://travis-ci.org/eirikt/tippekonkurranse)
&nbsp;&nbsp;&nbsp;
[![Codacy Badge](https://app.codacy.com/project/badge/4f9fda90eb834d27ae6cc2f539ae263c)](https://app.codacy.com/project/eiriktorske/tippekonkurranse/dashboard)
&nbsp;&nbsp;&nbsp;
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eirikt/tippekonkurranse/blob/master/README.md#license)

<sub><sup>__Server-side__:</sup></sub> [![Dependency Status](https://www.versioneye.com/user/projects/54690c9395082540da000012/badge.svg)](https://www.versioneye.com/user/projects/54690c9395082540da000012)
&nbsp;&nbsp;&nbsp;
[![Coverage Status](https://coveralls.io/repos/eirikt/tippekonkurranse/badge.svg?branch=master&service=github)](https://coveralls.io/github/eirikt/tippekonkurranse?branch=master)

<sub><sup>__Client-side__:</sup></sub> [![Dependency Status](https://www.versioneye.com/user/projects/54690c92950825928500000b/badge.svg)](https://www.versioneye.com/user/projects/54690c92950825928500000b)
&nbsp;&nbsp;&nbsp;
[![Sauce Test Status](https://saucelabs.com/browser-matrix/tippekonkurranse.svg)](https://saucelabs.com/u/tippekonkurranse)



## Scope
* Screen-scraping norwegian soccer result web pages
* Calculating rating and rank
* Simple multi-device-friendly presentation
* ~~Idiomatic code base~~ (2013/2014-style idiomatic code base, that is)
* Deployment to [Heroku][30]



## Version history/roadmap

#### v1.3.22 : _Deployed 15.12.2019_
* Cup results update

_Status: Done_


#### v1.3.21 : _Deployed 21.06.2019_
* Inactive users removed
* Cup results update
* Dependency updates

_Status: Done_


#### v1.3.20 : _Deployed 01.04.2019_
* 2019 predictions
* Dependency updates

_Status: Done_


#### v1.3.19 : _Deployed 01.01.2019_
* 2019 pre-season updates
* Node.js 10.x / npm 6.x
* Dependency updates

_Status: Done_


#### v1.3.18 : _Deployed 25.12.2018_
* 2019 pre-season updates
* Node.js 10.x / npm 6.x

~~_Status: Done_~~ Corrupted somehow


#### v1.3.17 : _Deployed 01.10.2018_
* Cup results update
* Dependency updates

_Status: Done_


#### v1.3.16 : _Deployed 10.01.2018_
* 2018 pre-season updates
* Bugfixes
* Dependency updates
* Node.js 8.x / npm 5.x

_Status: Done_


#### v1.3.15 : _Deployed 26.03.2017_
* 2017 rules modifications
* 'Tippeligaen' -> 'Eliteserien'
* Bugfix: OBOS-liga results handling
* Dependency updates

_Status: Done_


#### v1.3.14 : _Deployed 28.01.2017_
* 2017 pre-season updates
* Dependency updates
* Node.js 6.x

_Status: Done_


#### v1.3.13 : _Deployed 26.10.2016_
* Results updates
* Dependency updates

_Status: Done_


#### v1.3.12 : _Deployed 26.05.2016_
* HTML page 'og:description' updated (long overdue ...)
* Results updates
* Dependency updates

_Status: Done_


#### v1.3.11 : _Deployed 05.05.2016_
* Results updates
* Dependency updates

_Status: Done_


#### v1.3.10 : _Deployed 06.03.2016_
* Dependency updates

_Status: Done_


#### v1.3.9 : _Deployed 08.01.2016_
* More robust backend data handling
* Results and season input data updates
* Node.js 5.x
* Dependency updates

_Status: Done_


#### v1.3.8 : _Deployed 23.12.2015_
* Holiday down-time splash screen

_Status: Done_


#### v1.3.7 : _Deployed 13.08.2015_
* Results update
* io.js 3.x
* Dependency updates

_Status: Done_


#### v1.3.6 : _Deployed 27.06.2015_
* Cup results update
* Dependency updates (included the infamous [Underscore v1.7 template function incident](https://github.com/jashkenas/underscore/issues/1805))

_Status: Done_


#### v1.3.5 : _Deployed 05.06.2015_
* Cup results update
* io.js 2.x
* Modularizing RQ stuff via npm GitHub
* Dependency updates

_Status: Done_


#### v1.3.4 : _Deployed 07.05.2015_
* Cup results update
* ~~io.js 2.x~~ (too early it seems, rolled back to 1.x)
* ~~Modularizing RQ stuff via npm GitHub~~ (leads to 'unmet dependency', rolled back to copy of code ...)

_Status: Done_


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
* io.js

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


#### v1.1.6 : _Deployed 06.06.2014_
* Altered participant rating, skipping non-used rating numbers
* Bugfix: Sorting of participants

_Status: Done_


#### v1.1.5 : _Deployed 18.05.2014_
* Improved notifications with toastr
* Client-side routing established

_Status: Done_


#### v1.1.4 : _Deployed 05.05.2014_
* An attempt to make better Facebook URL presence ~~(must be tested/verified live)~~ yep, looks better
* Offline capability / Resilient against Tippekonkurranse server dropouts
* An attempt for improved response times with some caching
* Bugfix: Previous rating number (+ improved UX)

_Status: Done_


#### v1.1.3 : _Deployed 28.04.2014_
* View current Tippeliga results, and other relevant data
* Better touch device UX: uniform finger-friendly buttons
* Better touch device UX: remove hover striping
* Better touch device UX: colours and font sizes

_Status: Done_


#### v1.1.2 : Bugfix release, _deployed 22.04.2014_
* Tippeliga 2014, round 4 bugfixes
* Bugfix: MongoDB won't save new data
* Bugfix: Won't update round with 16 ongoing matches (masked by previous bug :-)
* Bugfix: Previous rating sometimes dropping out

_Status: Done_


#### v1.1.1 : _Deployed 21.04.2014_
* View all user's predictions

_Status: Done_


#### v1.1.0 : _Deployed 16.04.2014_
* Persistent data with MongoDB
* Tendency markers in table (moving up or down compared to previous round)

_Status: Done_


#### v1.0.0 : _Deployed 06.04.2014_
* __First feature-complete version__

_Status: Done_


#### v0.0.11 : Last iteration
* Implement "obos-opprykk" point calculations
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
* ~~Custom shortened URL using Tiny.cc => http://tiny.cc/tippekonkurranse~~ (obsolete)
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
* [Heroku/Custom domains][32]

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

Copyright (c) 2014-2019 Eirik Torske

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

[50]: https://nodejs.org
[51]: https://iojs.org
[52]: http://expressjs.com
[53]: https://www.mongodb.org
[54]: http://mongoosejs.com
[55]: https://github.com/douglascrockford/RQ

[60]: http://requirejs.org/
[61]: http://backbonejs.org
[62]: http://marionettejs.com
