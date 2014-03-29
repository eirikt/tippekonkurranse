/* global require:false, console:false, __dirname:false, process:false */

// Module dependencies, external
var path = require("path"),
    http = require("http"),
    express = require("express"),

// Module dependencies, local
    tippekonkurranseService = require("./tippekonkurranse-service.js"),

// The app server
    app = express(),
    port,
    server;

// Static resources
app.use(express.static(path.join(__dirname, "../../build")));

// Dynamic resources (RESTful service API)
app.get("/current-scores", tippekonkurranseService.calculateCurrentScore);

server = http.createServer(app);

// NB! Heroku port acquiring idiom
port = Number(process.env.PORT || 5000);

server.listen(port, function () {
    "use strict";
    console.log("Tippekonkurranse, Node.js Express server listening on port %d", port);
});
