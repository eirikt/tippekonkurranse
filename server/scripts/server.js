/* global require: false, console: false, __dirname: false */
var //_ = require("underscore"),
    //logfmt = require("logfmt"),
    path = require("path"),
    http = require("http"),
    express = require("express"),
    request = require("request"),
    cheerio = require("cheerio");


// TODO: move to 'user-predictions-2014.js'
var predictions2014 = {
    "eirik": {
        tabell: {
            "Strømsgodset": 2,
            "Rosenborg": 1,
            "Haugesund": 6,
            "Aalesund": 4,
            "Viking": 5,
            "Molde": 3,
            "Odd Ballklubb": 7,
            "Brann": 8,
            "Start": 9,
            "Lillestrøm": 10,
            "Vålerenga": 11,
            "Sogndal": 12,
            "Sandnes Ulf": 13,
            "Sarpsborg 08": 14,
            "Tromsø": 15,
            "Hønefoss BK": 16
        },
        toppscorer: "",
        opprykk: ["", ""]
    }
};
// /TODO: move to 'user-predictions-2014.js'


// TODO: move to '???.js'
var currentTable = {};


var currentStanding = {
    "eirik": null
};


var fotball_no_currentTippeligaTableUrl = "http://www.fotball.no/Landslag_og_toppfotball/Toppfotball/tippeligaen";

var _parseFotballNoTippeligaTable = function (body) {
    "use strict";
    var $ = cheerio.load(body);
    var heading = $("h2:contains('Tippeligaen')");
    var rows = heading.next("table").find("tr");
    rows.each(function (idx, element) {
        if (idx > 0) {
            var no = $($(element).find("td")[0]).html();
            var team = $($(element).find("td")[1]).find("a").html();
            currentTable[team] = parseInt(no, 10);
        }
    });
};


var _getTableScore = function (predictedPlacing, actualPlacing) {
    "use strict";
    return Math.abs(predictedPlacing - actualPlacing);
};


var _updateTableScores = function () {
    "use strict";
    for (var contender in predictions2014) {
        if (predictions2014.hasOwnProperty(contender)) {
            currentStanding[contender] = 0;
            var contenderObj = predictions2014[contender];
            var tablePredictions = contenderObj.tabell;
            for (var team in tablePredictions) {
                if (tablePredictions.hasOwnProperty(team)) {
                    var predictedTeamPlacing = tablePredictions[team];
                    var actualTeamPlacing = currentTable[team];
                    currentStanding[contender] +=
                        _getTableScore(predictedTeamPlacing, actualTeamPlacing);
                }
            }
        }
    }
};


var _handleTablePredictions = function (req, resp) {
    "use strict";
    request(
        fotball_no_currentTippeligaTableUrl,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                _parseFotballNoTippeligaTable(body);
                _updateTableScores();
                resp.send(JSON.stringify(currentStanding));
            }
            else {
                //throw new Error();
                resp.send(500);
            }
        }
    );
};
// /TODO: move to '???.js'


var app = express();

// Static resources
app.use(express.static(path.join(__dirname, "../../build")));

// Dynamic resources (RESTful service API)
app.get("/currentScores", _handleTablePredictions);
app.get("/scores", _handleTablePredictions);    // Alias
app.get("/results", _handleTablePredictions);   // Alias
app.get("/res", _handleTablePredictions);       // Alias

var server = http.createServer(app);

// NB! Heroku port acquiring idiom
var port = Number(process.env.PORT || 5000);

server.listen(port, function () {
    "use strict";
    console.log("Tippekonkurranse, Node.js Express server listening on port %d", port);
});
