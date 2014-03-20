/* global require: false, console: false, __dirname: false */

// Module dependencies, external
var _ = require("underscore"),
    //promise = require("promised-io/promise"),
    //logfmt = require("logfmt"),
    path = require("path"),
    http = require("http"),
    express = require("express"),
    //request = require("request"),
    //cheerio = require("cheerio"),


// Module dependencies, local
    tippekonkurranseService = require("./tippekonkurranse-service.js");


var app = express();

// Static resources
app.use(express.static(path.join(__dirname, "../../build")));

// Dynamic resources (RESTful service API)
app.get("/currentScores", tippekonkurranseService.calculateCurrentScore);
app.get("/scores", tippekonkurranseService.calculateCurrentScore);          // Alias
app.get("/results", tippekonkurranseService.calculateCurrentScore);         // Alias
app.get("/res", tippekonkurranseService.calculateCurrentScore);             // Alias

var server = http.createServer(app);

// NB! Heroku port acquiring idiom
var port = Number(process.env.PORT || 5000);

server.listen(port, function () {
    "use strict";
    console.log("Tippekonkurranse, Node.js Express server listening on port %d", port);
});
