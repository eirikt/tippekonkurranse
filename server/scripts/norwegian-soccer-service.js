/* global require: false, exports: false */

// Module dependencies, external
var _ = require("underscore"),
    promise = require("promised-io/promise"),
    request = require("request"),
    cheerio = require("cheerio"),


// www.fotball.no-specific stuff
    _fotballNoCurrentTippeligaTableUrl =
        "http://www.fotball.no/Landslag_og_toppfotball/Toppfotball/tippeligaen",

    _parseFotballNoTippeligaTable = function (body) {
        "use strict";
        var currentTable = {},
            $ = cheerio.load(body),
            heading = $("h2:contains('Tippeligaen')"),
            rows = heading.next("table").find("tr");

        rows.each(function (idx, element) {
            if (idx > 0) {
                var tableCells = $(element).find("td");
                var no = $(tableCells[0]).html();
                var team = $(tableCells[1]).find("a").html();
                var matches = $(tableCells[2]).html();

                // The data format
                currentTable[team] = { no: parseInt(no, 10), matches: parseInt(matches, 10) };
            }
        });
        return currentTable;
    },


    _fotballNoCurrentAdeccoligaTableUrl =
        "http://www.fotball.no/Landslag_og_toppfotball/Toppfotball/1_divisjon_menn",

    _parseFotballNoAdeccoligaTable = function (body) {
        "use strict";
        var currentTable = {},
            $ = cheerio.load(body),
            heading = $("h2:contains('Adeccoligaen')"),
            rows = heading.next("table").find("tr");
        rows.each(function (idx, element) {
            if (idx > 0) {
                var tableCells = $(element).find("td"),
                    no = $(tableCells[0]).html(),
                    team = $(tableCells[1]).find("a").html(),
                    matches = $(tableCells[2]).html();

                // The data format
                currentTable[team] = { no: parseInt(no, 10), matches: matches };
            }
        });
        return currentTable;
    },
// /www.fotball.no-specific stuff

// www.altomfotball.no stuff
    _altomfotballCurrentTippeligaTableUrl =
        "http://www.altomfotball.no/element.do?cmd=tournament&tournamentId=1&useFullUrl=false",

    _parseAltomfotballTippeligaTable = function (body) {
        "use strict";
        var currentTable = {},
            $ = cheerio.load(body),
            rows = $("#sd_table_1").find("tbody").find("tr");

        _.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[0]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...
            if (team === "Sarpsborg 08") {
                team = "Sarpsborg";
            }

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
            player = player.replace("&nbsp;", " ");
            player = player.replace("&nbsp;", " "); // => max two spaces in name ...

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

// /www.altomfotball.no stuff


// "Strategy switch" functions
    _getCurrentTippeligaTableUrl = function () {
        "use strict";
        return _altomfotballCurrentTippeligaTableUrl;
    },

    _parseCurrentTippeligaTableData = _parseAltomfotballTippeligaTable,

    _getCurrentAdeccoligaTableUrl = function () {
        "use strict";
        return _fotballNoCurrentAdeccoligaTableUrl;
    },

    _parseCurrentAdeccoligaTableData = _parseFotballNoAdeccoligaTable,

    _getCurrentTippeligaToppscorerUrl = function () {
        "use strict";
        return _altomfotballCurrentToppscorerTableUrl;
    },

    _parseCurrentTippeligaToppscorerData = _parseAltomfotballToppscorerTable,
// /"Strategy switch" functions


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
        // TODO: fake it for now ...
        dfd.resolve({
            "Alta": { no: 1, matches: 0 },
            "Bærum": { no: 2, matches: 0 },
            "Bryne": { no: 3, matches: 0 },
            "Fredrikstad": { no: 4, matches: 0 },
            "HamKam": { no: 5, matches: 0 },
            "Hønefoss": { no: 6, matches: 0 },
            "Hødd": { no: 7, matches: 0 },
            "Nest-Sotra": { no: 8, matches: 0 },
            "Kristiansund": { no: 9, matches: 0 },
            "Mjøndalen": { no: 10, matches: 0 },
            "Ranheim": { no: 11, matches: 0 },
            "Sandefjord": { no: 12, matches: 0 },
            "Strømmen": { no: 13, matches: 0 },
            "Tromsdalen": { no: 14, matches: 0 },
            "Tromsø": { no: 15, matches: 0 },
            "Ullensaker/Kisa": { no: 16, matches: 0 }
        });
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
        // For the cup title, just manually remove the clubs when they screw up, one by one ...
        // Only tippeliga clubs relevant here ...
        dfd.resolve([
            "Bodø/Glimt",
            "Brann",
            "Haugesund",
            "Lillestrøm",
            "Molde",
            "Odd",
            "Rosenborg",
            "Sandnes Ulf",
            "Sarpsborg",
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
