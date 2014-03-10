var express = require("express");
var logfmt = require("logfmt");

var app = express();

app.use(logfmt.requestLogger());

app.get('/', function (req, res) {
    res.send('Tippekonkurranse 2014, coming soon! [v0.0.2]');
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function () {
    console.log("Listening on " + port);
});
