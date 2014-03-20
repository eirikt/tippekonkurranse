/* global require: false, console: false, __dirname: false */

// Module dependencies, external
var _ = require("underscore"),
    promise = require("promised-io/promise"),
    request = require("request"),
    cheerio = require("cheerio");


// www.fotball.no-specific stuff
var _fotballNoCurrentTippeligaTableUrl =
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

                currentTable[team] = { no: parseInt(no, 10), matches: matches };
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
    };
// /www.fotball.no-specific stuff


var _getCurrentTippeligaTableUrl = function () {
        return _fotballNoCurrentTippeligaTableUrl;
    },

    _parseCurrentTippeligaTableData = _parseFotballNoTippeligaTable,

    _getCurrentAdeccoligaTableUrl = function () {
        return _fotballNoCurrentAdeccoligaTableUrl;
    },

    _parseCurrentAdeccoligaTableData = _parseFotballNoAdeccoligaTable;


var _getCurrentTippeligaTable = exports.getCurrentTippeligaTable = function () {
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
