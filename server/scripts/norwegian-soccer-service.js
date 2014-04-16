/* global require: false, exports: false */

// Module dependencies, external
var __ = require("underscore"),
    promise = require("promised-io/promise"),
    request = require("request"),
    cheerio = require("cheerio"),


//////////////////////////////////
// www.altomfotball.no
//////////////////////////////////

    _currentTippeligaTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=1&subCmd=total&live=true&useFullUrl=false",

    _parseTippeligaTable = function (body) {
        "use strict";
        var currentTable = [],
            $ = cheerio.load(body),
            rows = $($).find("tbody").find("tr");

        __.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[0]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...

            // The data format
            currentTable.push({ name: team, no: parseInt(no, 10), matches: matches });
        });
        return currentTable;
    },

    _currentAdeccoligaTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=2&subCmd=total&live=true&useFullUrl=false",

    _parseAdeccoligaTable = function (body) {
        "use strict";
        var currentTable = [],
            $ = cheerio.load(body),
            rows = $($).find("tbody").find("tr");

        __.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[0]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[2]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...

            // The data format
            currentTable.push({ name: team, no: parseInt(no, 10), matches: matches });
        });
        return currentTable;
    },

    _currentTippeligaToppscorerTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=statistics&subCmd=goals&tournamentId=1&seasonId=&teamId=&useFullUrl=false",

    _parseTippeligaToppscorerTable = function (body) {
        "use strict";
        var toppscorers = [],
            $ = cheerio.load(body),
            rows = $($).find("tbody").find("tr"),
            maxGoals = 0;

        __.each(rows, function (element, index) {
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
// Public functions
//////////////////////////////////

    _getCurrentTippeligaTable = exports.getCurrentTippeligaTable = function () {
        "use strict";
        var dfd = new promise.Deferred();
        request(
            _currentTippeligaTableUrl,
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    dfd.resolve(_parseTippeligaTable(body));
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
            _currentAdeccoligaTableUrl,
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    dfd.resolve(_parseAdeccoligaTable(body));
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
            _currentTippeligaToppscorerTableUrl,
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    dfd.resolve(_parseTippeligaToppscorerTable(body));
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


    _dataForRound201401 = exports.round201401 = {
        year: 2014,
        round: 1,
        tippeliga: [
            { name: "Sarpsborg 08", no: 1, matches: 1 },
            { name: "Stabæk", no: 2, matches: 1 },
            { name: "Strømsgodset", no: 3, matches: 1 },
            { name: "Molde", no: 4, matches: 1 },
            { name: "Rosenborg", no: 5, matches: 1 },
            { name: "Viking", no: 6, matches: 1 },
            { name: "Bodø/Glimt", no: 7, matches: 1 },
            { name: "Haugesund", no: 8, matches: 1 },
            { name: "Lillestrøm", no: 9, matches: 1 },
            { name: "Odd", no: 10, matches: 1 },
            { name: "Sandnes Ulf", no: 11, matches: 1 },
            { name: "Aalesund", no: 12, matches: 1 },
            { name: "Start", no: 13, matches: 1 },
            { name: "Vålerenga", no: 14, matches: 1 },
            { name: "Brann", no: 15, matches: 1 },
            { name: "Sogndal", no: 16, matches: 1 }
        ],
        toppscorer: [
            "Gustav Wikheim",
            "Aaron Samuel",
            "Ernest Asante",
            "Jón Dadi Bödvarsson"
        ],
        adeccoliga: [
            { name: "Alta", no: 1, matches: 0 },
            { name: "Bryne", no: 2, matches: 0 },
            { name: "Bærum", no: 3, matches: 0 },
            { name: "Fredrikstad", no: 4, matches: 0 },
            { name: "HamKam", no: 5, matches: 0 },
            { name: "Hødd", no: 6, matches: 0 },
            { name: "Hønefoss", no: 7, matches: 0 },
            { name: "Kristiansund BK", no: 8, matches: 0 },
            { name: "Mjøndalen", no: 9, matches: 0 },
            { name: "Nest-Sotra", no: 10, matches: 0 },
            { name: "Ranheim", no: 11, matches: 0 },
            { name: "Sandefjord", no: 12, matches: 0 },
            { name: "Strømmen", no: 13, matches: 0 },
            { name: "Tromsdalen", no: 14, matches: 0 },
            { name: "Tromsø", no: 15, matches: 0 },
            { name: "Ullensaker/Kisa", no: 16, matches: 0 }
        ],
        remainingCupContenders: [
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
    },


    _dataForRound201402 = exports.round201402 = {
        year: 2014,
        round: 2,
        tippeliga: [
            { name: "Stabæk", no: 1, matches: 2 },
            { name: "Lillestrøm", no: 2, matches: 2 },
            { name: "Sarpsborg 08", no: 3, matches: 2 },
            { name: "Strømsgodset", no: 4, matches: 2 },
            { name: "Odd", no: 5, matches: 2 },
            { name: "Molde", no: 6, matches: 2 },
            { name: "Start", no: 7, matches: 2 },
            { name: "Vålerenga", no: 8, matches: 2 },
            { name: "Rosenborg", no: 9, matches: 2 },
            { name: "Viking", no: 10, matches: 2 },
            { name: "Aalesund", no: 11, matches: 2 },
            { name: "Bodø/Glimt", no: 12, matches: 2 },
            { name: "Haugesund", no: 13, matches: 2 },
            { name: "Sandnes Ulf", no: 14, matches: 2 },
            { name: "Sogndal", no: 15, matches: 2 },
            { name: "Brann", no: 16, matches: 2 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson",
            "Gustav Wikheim",
            "Franck Boli",
            "Jón Dadi Bödvarsson",
            "Aaron Samuel",
            "Ernest Asante"
        ],
        adeccoliga: [
            { name: "Alta", no: 1, matches: 1 },
            { name: "Mjøndalen", no: 2, matches: 1 },
            { name: "Sandefjord", no: 3, matches: 1 },
            { name: "Tromsø", no: 4, matches: 1 },
            { name: "Bærum", no: 5, matches: 1 },
            { name: "Nest-Sotra", no: 6, matches: 1 },
            { name: "Tromsdalen", no: 7, matches: 1 },
            { name: "Hødd", no: 8, matches: 1 },
            { name: "Hønefoss", no: 9, matches: 1 },
            { name: "Ranheim", no: 10, matches: 1 },
            { name: "Strømmen", no: 11, matches: 1 },
            { name: "HamKam", no: 12, matches: 1 },
            { name: "Bryne", no: 13, matches: 1 },
            { name: "Fredrikstad", no: 14, matches: 1 },
            { name: "Ullensaker/Kisa", no: 15, matches: 1 },
            { name: "Kristiansund BK", no: 16, matches: 1 }
        ],
        remainingCupContenders: [
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
    },


    _dataForRound201403 = exports.round201403 = {
        year: 2014,
        round: 3,
        tippeliga: [
            { name: "Strømsgodset", no: 1, matches: 3 },
            { name: "Molde", no: 2, matches: 3 },
            { name: "Stabæk", no: 3, matches: 3 },
            { name: "Sarpsborg 08", no: 4, matches: 3 },
            { name: "Rosenborg", no: 5, matches: 3 },
            { name: "Viking", no: 6, matches: 3 },
            { name: "Lillestrøm", no: 7, matches: 3 },
            { name: "Bodø/Glimt", no: 8, matches: 3 },
            { name: "Start", no: 9, matches: 3 },
            { name: "Vålerenga", no: 10, matches: 3 },
            { name: "Odd", no: 11, matches: 3 },
            { name: "Haugesund", no: 12, matches: 3 },
            { name: "Aalesund", no: 13, matches: 3 },
            { name: "Sandnes Ulf", no: 14, matches: 3 },
            { name: "Brann", no: 15, matches: 3 },
            { name: "Sogndal", no: 16, matches: 3 }
        ],
        toppscorer: [
            "Jón Dadi Bödvarsson",
            "Vidar Örn Kjartansson",
            "Ulrik Flo"
        ],
        adeccoliga: [
            { name: "Nest-Sotra", no: 1, matches: 2 },
            { name: "Tromsø", no: 2, matches: 2 },
            { name: "Bærum", no: 3, matches: 2 },
            { name: "Mjøndalen", no: 4, matches: 2 },
            { name: "Tromsdalen", no: 5, matches: 2 },
            { name: "Hødd", no: 6, matches: 2 },
            { name: "Alta", no: 7, matches: 2 },
            { name: "Sandefjord", no: 8, matches: 2 },
            { name: "Strømmen", no: 9, matches: 2 },
            { name: "Kristiansund BK", no: 10, matches: 2 },
            { name: "Hønefoss", no: 11, matches: 2 },
            { name: "Fredrikstad", no: 12, matches: 2 },
            { name: "Bryne", no: 13, matches: 2 },
            { name: "HamKam", no: 14, matches: 2 },
            { name: "Ranheim", no: 15, matches: 2 },
            { name: "Ullensaker/Kisa", no: 16, matches: 2 }
        ],
        remainingCupContenders: [
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
    },


    _getTippeligaTable2013 = exports.getTippeligaTable2013 = function () {
        "use strict";
        var dfd = new promise.Deferred();
        return dfd.resolve([
            { name: "Strømsgodset", no: 1, matches: 30 },
            { name: "Rosenborg", no: 2, matches: 30 },
            { name: "Haugesund", no: 3, matches: 30 },
            { name: "Aalesund", no: 4, matches: 30 },
            { name: "Viking", no: 5, matches: 30 },
            { name: "Molde", no: 6, matches: 30 },
            { name: "Odd", no: 7, matches: 30 },
            { name: "Brann", no: 8, matches: 30 },
            { name: "Start", no: 9, matches: 30 },
            { name: "Lillestrøm", no: 10, matches: 30 },
            { name: "Vålerenga", no: 11, matches: 30 },
            { name: "Sogndal", no: 12, matches: 30 },
            { name: "Sandnes Ulf", no: 13, matches: 30 },
            { name: "Sarpsborg 08", no: 14, matches: 30 },
            { name: "Tromsø", no: 15, matches: 30 },
            { name: "Hønefoss", no: 16, matches: 30 }
        ]);
    },


    _getAdeccoligaTable2013 = exports.getAdeccoligaTable2013 = function () {
        "use strict";
        var dfd = new promise.Deferred();
        return dfd.resolve([
            { name: "Bodø/Glimt", no: 1, matches: 30 },
            { name: "Stabæk", no: 2, matches: 30 },
            { name: "Hødd", no: 3, matches: 30 },
            { name: "Ranheim", no: 4, matches: 30 },
            { name: "HamKam", no: 5, matches: 30 },
            { name: "Mjøndalen", no: 6, matches: 30 },
            { name: "Bryne", no: 7, matches: 30 },
            { name: "Sandefjord", no: 8, matches: 30 },
            { name: "Kristiansund BK", no: 9, matches: 30 },
            { name: "Fredrikstad", no: 10, matches: 30 },
            { name: "Strømmen", no: 11, matches: 30 },
            { name: "Ullensaker/Kisa", no: 12, matches: 30 },
            { name: "Vard Haugesund", no: 13, matches: 30 },
            { name: "Kongsvinger", no: 14, matches: 30 },
            { name: "Follo", no: 15, matches: 30 },
            { name: "Elverum", no: 16, matches: 30 }
        ]);
    };
