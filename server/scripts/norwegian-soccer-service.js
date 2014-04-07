/* global require: false, exports: false */

// Module dependencies, external
var _ = require("underscore"),
    promise = require("promised-io/promise"),
    request = require("request"),
    cheerio = require("cheerio"),


//////////////////////////////////
// www.fotball.no (NFF)
// (no live updates there ...)
//////////////////////////////////


//////////////////////////////////
// www.altomfotball.no
//////////////////////////////////

    _altomfotballCurrentTippeligaTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=1&subCmd=total&live=true&useFullUrl=false",

    _parseAltomfotballTippeligaTable = function (body) {
        "use strict";
        var currentTable = {},
            $ = cheerio.load(body),
            rows = $($).find("tbody").find("tr");

        _.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[0]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...

            // The data format
            currentTable[team] = { no: parseInt(no, 10), matches: matches };
        });
        return currentTable;
    },

    _altomfotballCurrentAdeccoligaTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=2&subCmd=total&live=true&useFullUrl=false",

    _parseAltomfotballAdeccoligaTable = function (body) {
        "use strict";
        var currentTable = {},
            $ = cheerio.load(body),
            rows = $($).find("tbody").find("tr");

        _.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[0]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...

            // The data format
            currentTable[team] = { no: parseInt(no, 10), matches: matches };
        });
        return currentTable;
    },

    _altomfotballCurrentToppscorerTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=statistics&subCmd=goals&tournamentId=1&seasonId=&teamId=&useFullUrl=false",

    _parseAltomfotballToppscorerTable = function (body) {
        "use strict";
        var toppscorers = [],
            $ = cheerio.load(body),
            rows = $($).find("tbody").find("tr"),
            maxGoals = 0;

        _.each(rows, function (element, index) {
            var $cells = $(element).find("td"),
                player = $cells.find("a").first().html(),
                goals = $($cells[3]).html();

            // Launder ...
            // => max two spaces in name ...
            player = player
                .replace("&nbsp;", " ")
                .replace("&nbsp;", " ");

            // Normalize ...

            // Filter ...
            if (index === 0) {
                maxGoals = goals;
                // The data format
                toppscorers.push(player);

            } else if (goals === maxGoals) {
                // The data format
                toppscorers.push(player);
            }
        });
        return toppscorers;
    },


//////////////////////////////////
// "Strategy switch" functions
// TODO: consider removing this
//////////////////////////////////

    _getCurrentTippeligaTableUrl = function () {
        "use strict";
        return _altomfotballCurrentTippeligaTableUrl;
    },

    _parseCurrentTippeligaTableData = _parseAltomfotballTippeligaTable,

    _getCurrentAdeccoligaTableUrl = function () {
        "use strict";
        return _altomfotballCurrentAdeccoligaTableUrl;
    },

    _parseCurrentAdeccoligaTableData = _parseAltomfotballAdeccoligaTable,

    _getCurrentTippeligaToppscorerUrl = function () {
        "use strict";
        return _altomfotballCurrentToppscorerTableUrl;
    },

    _parseCurrentTippeligaToppscorerData = _parseAltomfotballToppscorerTable,


//////////////////////////////////
// Public functions
//////////////////////////////////

    _getCurrentTippeligaTable = exports.getCurrentTippeligaTable = function () {
        "use strict";
        var dfd = new promise.Deferred();
        request(
            _getCurrentTippeligaTableUrl(),
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    dfd.resolve(_parseCurrentTippeligaTableData(body));
                }
                else {
                    dfd.reject();
                }
            }
        );
        return dfd.promise;
    },


    _getCurrentAdeccoligaTable = exports.getCurrentAdeccoligaTable = function () {
        "use strict";
        var dfd = new promise.Deferred();

        request(
            _getCurrentAdeccoligaTableUrl(),
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    dfd.resolve(_parseCurrentAdeccoligaTableData(body));
                }
                else {
                    dfd.reject();
                }
            }
        );
        return dfd.promise;
    },


    _getCurrentTippeligaToppscorer = exports.getCurrentTippeligaToppscorer = function () {
        "use strict";
        var dfd = new promise.Deferred();
        request(
            _getCurrentTippeligaToppscorerUrl(),
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    dfd.resolve(_parseCurrentTippeligaToppscorerData(body));
                }
                else {
                    dfd.reject();
                }
            }
        );
        return dfd.promise;
    },


    _getCurrentRemainingCupContenders = exports.getCurrentRemainingCupContenders = function () {
        "use strict";
        var dfd = new promise.Deferred();
        // For the cup title, just manually remove the teams when they consecutively screw up, one after the other ...
        // Only tippeliga teams relevant for 2014 predictions ...
        dfd.resolve([
            "Bodø/Glimt",
            "Brann",
            "Haugesund",
            "Lillestrøm",
            "Molde",
            "Odd",
            "Rosenborg",
            "Sandnes Ulf",
            "Sarpsborg 08",
            "Sogndal",
            "Stabæk",
            "Start",
            "Strømsgodset",
            "Viking",
            "Vålerenga",
            "Aalesund"
        ]);
        return dfd.promise;
    },


    _dataForRound201401 = exports.getDataForRound201401 = function () {
        "use strict";
        return {
            "2014-01": {
                "tippeliga": {
                    "Sarpsborg 08": { no: 1, matches: 1 },
                    "Stabæk": { no: 2, matches: 1 },
                    "Strømsgodset": { no: 3, matches: 1 },
                    "Molde": { no: 4, matches: 1 },
                    "Rosenborg": { no: 5, matches: 1 },
                    "Viking": { no: 6, matches: 1 },
                    "Bodø/Glimt": { no: 7, matches: 1 },
                    "Haugesund": { no: 8, matches: 1 },
                    "Lillestrøm": { no: 9, matches: 1 },
                    "Odd": { no: 10, matches: 1 },
                    "Sandnes Ulf": { no: 11, matches: 1 },
                    "Aalesund": { no: 12, matches: 1 },
                    "Start": { no: 13, matches: 1 },
                    "Vålerenga": { no: 14, matches: 1 },
                    "Brann": { no: 15, matches: 1 },
                    "Sogndal": { no: 16, matches: 1 }
                },
                "toppscorer": [
                    "Gustav Wikheim",
                    "Aaron Samuel",
                    "Ernest Asante",
                    "Jón Dadi Bödvarsson"
                ],
                "adeccoliga": {
                    "Alta": { no: 1, matches: 0 },
                    "Bryne": { no: 2, matches: 0 },
                    "Bærum": { no: 3, matches: 0 },
                    "Fredrikstad": { no: 4, matches: 0 },
                    "HamKam": { no: 5, matches: 0 },
                    "Hødd": { no: 6, matches: 0 },
                    "Hønefoss": { no: 7, matches: 0 },
                    "Kristiansund BK": { no: 8, matches: 0 },
                    "Mjøndalen": { no: 9, matches: 0 },
                    "Nest-Sotra": { no: 10, matches: 0 },
                    "Ranheim": { no: 11, matches: 0 },
                    "Sandefjord": { no: 12, matches: 0 },
                    "Strømmen": { no: 13, matches: 0 },
                    "Tromsdalen": { no: 14, matches: 0 },
                    "Tromsø": { no: 15, matches: 0 },
                    "Ullensaker/Kisa": { no: 16, matches: 0 }
                },
                "remainingCupContenders": [
                    "Bodø/Glimt",
                    "Brann",
                    "Haugesund",
                    "Lillestrøm",
                    "Molde",
                    "Odd",
                    "Rosenborg",
                    "Sandnes Ulf",
                    "Sarpsborg 08",
                    "Sogndal",
                    "Stabæk",
                    "Start",
                    "Strømsgodset",
                    "Viking",
                    "Vålerenga",
                    "Aalesund"
                ]
            }
        };
    },


    _getTippeligaTable2013 = exports.getTippeligaTable2013 = function () {
        "use strict";
        var dfd = new promise.Deferred();
        return dfd.resolve({
            "Strømsgodset": { no: 1, matches: 30 },
            "Rosenborg": { no: 2, matches: 30 },
            "Haugesund": { no: 3, matches: 30 },
            "Aalesund": { no: 4, matches: 30 },
            "Viking": { no: 5, matches: 30 },
            "Molde": { no: 6, matches: 30 },
            "Odd Ballklubb": { no: 7, matches: 30 },
            "Brann": { no: 8, matches: 30 },
            "Start": { no: 9, matches: 30 },
            "Lillestrøm": { no: 10, matches: 30 },
            "Vålerenga": { no: 11, matches: 30 },
            "Sogndal": { no: 12, matches: 30 },
            "Sandnes Ulf": { no: 13, matches: 30 },
            "Sarpsborg 08": { no: 14, matches: 30 },
            "Tromsø": { no: 15, matches: 30 },
            "Hønefoss BK": { no: 16, matches: 30 }
        });
    },


    _getAdeccoligaTable2013 = exports.getAdeccoligaTable2013 = function () {
        "use strict";
        var dfd = new promise.Deferred();
        return dfd.resolve({
            "Bodø/Glimt": { no: 1, matches: 30 },
            "Stabæk": { no: 2, matches: 30 },
            "Hødd": { no: 3, matches: 30 },
            "Ranheim TF": { no: 4, matches: 30 },
            "HamKam": { no: 5, matches: 30 },
            "Mjøndalen": { no: 6, matches: 30 },
            "Bryne": { no: 7, matches: 30 },
            "Sandefjord Fotball": { no: 8, matches: 30 },
            "Kristiansund": { no: 9, matches: 30 },
            "Fredrikstad": { no: 10, matches: 30 },
            "Strømmen": { no: 11, matches: 30 },
            "Ullensaker/Kisa": { no: 12, matches: 30 },
            "Vard Haugesund": { no: 13, matches: 30 },
            "Kongsvinger": { no: 14, matches: 30 },
            "Follo": { no: 15, matches: 30 },
            "Elverum": { no: 16, matches: 30 }
        });
    };
