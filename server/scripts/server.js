/* global root:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    applicationRootAbsolutePath = __dirname,
    wwwRootRelativePath = "../../build",
    path = require("path"),
    http = require("http"),
    express = require("express"),

// Module dependencies, local
    tippekonkurranseService = require("./tippekonkurranse-service.js"),
    utils = require("./utils.js"),
    initDb = require("./db-init.js"),

// The app server
    app = express(),
    port = Number(process.env.PORT || 5000),
    server;

// Static resources (AppCache candidate) (files)
app.use(express.static(path.join(applicationRootAbsolutePath, wwwRootRelativePath)));

// TODO: Move URLs to common function in 'shared'

// Static resources (AppCache candidate) (RESTful service API)
app.get("/api/predictions/:userId", tippekonkurranseService.handlePredictionsRequest);

// Dynamic resources (RESTful service API)
app.get("/api/results/:year/:round", tippekonkurranseService.handleResultsRequest);
app.get("/api/results/current", tippekonkurranseService.handleResultsRequest);
app.get("/api/scores/:year/:round", tippekonkurranseService.handleScoresRequest);
app.get("/api/scores/current", tippekonkurranseService.handleScoresRequest);

// HTTP server
server = http.createServer(app);
server.listen(port, function () {
    "use strict";
    console.log(utils.logPreamble() + "Tippekonkurranse, Node.js Express server (%s) listening on port %d", env, port);
});


// Override live data retrieval with stored Tippeliga data => for statistics/history/development ...
global.overrideTippeligaDataWithYear = 2014;
global.overrideTippeligaDataWithRound = 7;
