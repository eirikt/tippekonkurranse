/* global require:false, __dirname:false, process:false, console:false */

// Module dependencies, external
var applicationRoot = __dirname,
    path = require("path"),
    http = require("http"),
    express = require("express"),

// Module dependencies, local
//fun = require("./fun.js"), // Replaced by "curry" lib
    tippekonkurranseService = require("./tippekonkurranse-service.js"),
    initDb = require("./db-init.js"),
    utils = require("./utils.js"),

// The app server
    app = express(),
    port,
    server;


// Static resources
app.use(express.static(path.join(applicationRoot, "../../build")));

// Dynamic resources (RESTful service API)
app.get("/current-scores", tippekonkurranseService.handleCurrentScoreRequest);


server = http.createServer(app);
port = Number(process.env.PORT || 5000);
server.listen(port, function () {
    "use strict";
    console.log(utils.logPreamble() + "Tippekonkurranse, Node.js Express server listening on port %d", port);
});
