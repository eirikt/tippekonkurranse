# Tippekonkurranse

A simple Node-based web application (in norwegian).


## Scope
* Screen-scraping norwegian soccer result web pages
* Simple calculations
* Simple presentation
* Deployment to [Heroku][30]


## Version history/roadmap

### v0.0.1 : Single-file browser-app version
_Abandoned!_ Couldn't find any CORS/JSONP-supporting Tippeliga data service ...

### v0.0.2 : Initial server version
* Establish (minimalistic) server version with Node.js
* Very minimalistic client version (just a web page skeleton)
* [Deploy][31] to Heroku => http://lit-ravine-2113.herokuapp.com
* Custom shortened URL using [Tiny.cc][40] => http://tiny.cc/tippekonkurranse
* Launch it!

_Status_: OK

### v0.0.3 : Remote data retrieval proof-of-concept (server-side)
* Try get Tippeliga data from some service => [NFF][10]
* Screen-scrape and parse data (server-side), e.g. like [this][20]
* Acquire Tippeliga information

_Status_: OK

### v0.0.4 :
* Establish user data model and business rules logic
* Implement "tabellplassering" point calculations

_Status_: OK

### v0.0.5 :
* Establish minimal client-side UX (simple SPA with RESTful service calls)
* First usable version ...kind of

### v0.0.6 :
* Implement "toppscorer" point calculations

### v0.0.7 :
* Implement "cupmester" point calculations

### v0.0.8 :
* Implement "adecco-opprykk" point calculations
* First feature-complete usable version

### v0.0.9 :
* Establish somewhat proper client-side UX

...

### v0.0.x
Add/hard-code user predictions for this year

### v0.0.x
Touch-friendly version ...

Small-screen-friendly version ...

### v0.0.x : Proper URL
[Heroku/Custom domains][31]

### v0.0.x
Establish proper REST service for Tippeliga data for everybody to use without leaning to crappy web scraping routines ...


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
