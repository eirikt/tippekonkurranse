// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    applicationRoot = __dirname,
    path = require("path"),
    http = require("http"),
    express = require("express"),

// Module dependencies, local
    tippekonkurranseService = require("./tippekonkurranse-service.js"),
    initDb = require("./db-init.js"),
    utils = require("./utils.js"),

// The app server
    app = express(),
    port = Number(process.env.PORT || 5000),
    server;

// Static resources
app.use(express.static(path.join(applicationRoot, "../../build")));

// Dynamic resources (RESTful service API)
app.get("/predictions/:userId", tippekonkurranseService.handlePredictionsRequest);
app.get("/current-scores", tippekonkurranseService.handleCurrentScoreRequest);

// HTTP server
server = http.createServer(app);
server.listen(port, function () {
    "use strict";
    console.log(utils.logPreamble() + "Tippekonkurranse, Node.js Express server (%s) listening on port %d", env, port);
});
