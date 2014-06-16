/* global root:false */

// Environment
var env = process.env.NODE_ENV || "development",
    applicationRootAbsolutePath = __dirname,
    productionWebRootRelativePath = "../../build",
    developmentWebRootRelativePath = "../../client",

// Module dependencies, external
    path = require("path"),
    http = require("http"),
    express = require("express"),

// Module dependencies, local
    tippekonkurranseService = require("./tippekonkurranse-service.js"),
    utils = require("./utils.js"),
    initDb = require("./db-init.js"),
    app = require("./../../shared/scripts/app.models.js"),

// The app server
    server = express(),
    port = Number(process.env.PORT || 5000);


// Static resources (AppCache candidates) (files)
if (env === "development") {
    server.use(express.static(path.join(applicationRootAbsolutePath, developmentWebRootRelativePath)));
} else {
    server.use(express.static(path.join(applicationRootAbsolutePath, productionWebRootRelativePath)));
}

// Static resources (AppCache candidates) (RESTful service API) (Only JSON content type supported so far)
server.get(app.resource.predictions.uri, tippekonkurranseService.handlePredictionsRequest);

// Semi-static resources (RESTful service API) (Only JSON content type supported so far)
// (NOT AppCache candidates as the data is changing during the year/round)
// (But when the year/round is completed, the content become static from there and onwards)
server.get(app.resource.results.uri, tippekonkurranseService.handleResultsRequest);
server.get(app.resource.scores.uri, tippekonkurranseService.handleScoresRequest);
server.get(app.resource.ratingHistory.uri, tippekonkurranseService.handleRatingHistoryRequest);

// Dynamic resources (RESTful service API) (Only JSON content type supported so far)
server.get([app.resource.results.baseUri, app.resource.uri.element.current].join("/"), tippekonkurranseService.handleResultsRequest);
server.get([app.resource.scores.baseUri, app.resource.uri.element.current].join("/"), tippekonkurranseService.handleScoresRequest);

// Start HTTP server
server.listen(port, function () {
    "use strict";
    console.log(utils.logPreamble() + app.name + ", Node.js Express server listening on port %d in %s mode", port, env);
});


// Development tweaks ...
if (env === "development") {
    // Override live data retrieval with stored Tippeliga data => for statistics/history/development ...
    root.overrideTippeligaDataWithYear = 2014;
    //root.overrideTippeligaDataWithRound = 12;
}
