/* global root:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    applicationRootAbsolutePath = __dirname,
    productionWebRootRelativePath = "../../build",
    developmentWebRootRelativePath = "../../client",
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
if (env === "development") {
    app.use(express.static(path.join(applicationRootAbsolutePath, developmentWebRootRelativePath)));
} else {
    app.use(express.static(path.join(applicationRootAbsolutePath, productionWebRootRelativePath)));
}

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
    console.log(utils.logPreamble() + "Tippekonkurranse, Node.js Express server listening on port %d in %s mode", port, env);
});


// Development tweaks ...
if (env === "development") {
    // Override live data retrieval with stored Tippeliga data => for statistics/history/development ...
    root.overrideTippeligaDataWithYear = 2014;
    root.overrideTippeligaDataWithRound = 7;
}
