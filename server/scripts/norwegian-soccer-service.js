/* global require: false, exports: false */

// Module dependencies, external
var __ = require("underscore"),
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

    _getCurrentTippeligaTable = exports.getCurrentTippeligaTable = function (requestion, arg) {
        "use strict";
        return request(
            _currentTippeligaTableUrl,
            function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    return requestion(_parseTippeligaTable(body));
                }
                else {
                    return requestion(undefined, err);
                }
            }
        );
    },


    _getCurrentAdeccoligaTable = exports.getCurrentAdeccoligaTable = function (requestion, arg) {
        "use strict";
        return request(
            _currentAdeccoligaTableUrl,
            function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    return requestion(_parseAdeccoligaTable(body));
                }
                else {
                    return requestion(undefined, err);
                }
            }
        );
    },


    _getCurrentTippeligaToppscorer = exports.getCurrentTippeligaToppscorer = function (requestion, arg) {
        "use strict";
        return request(
            _currentTippeligaToppscorerTableUrl,
            function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    return requestion(_parseTippeligaToppscorerTable(body));
                }
                else {
                    return requestion(undefined, err);
                }
            }
        );
    },


    _getCurrentRemainingCupContenders = exports.getCurrentRemainingCupContenders = function (requestion, arg) {
        "use strict";
        // For the cup title, just manually remove the teams when they consecutively screw up, one after the other ...
        // Only tippeliga teams relevant for 2014 predictions ...
        return requestion([
            "Bodø/Glimt",
            "Brann",
            "Molde",
            "Rosenborg",
            "Stabæk",
            "Vålerenga"
        ]);
    },


    _dataForRound201401 = exports.round201401 = {
        year: 2014,
        round: 1,
        date: "2014-03-30",
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
        date: "2014-04-06",
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
        date: "2014-04-13",
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


    _dataForRound201404 = exports.round201404 = {
        year: 2014,
        round: 4,
        date: "2014-04-21",
        tippeliga: [
            { name: "Strømsgodset", no: 1, matches: 4 },
            { name: "Molde", no: 2, matches: 4 },
            { name: "Viking", no: 3, matches: 4 },
            { name: "Vålerenga", no: 4, matches: 4 },
            { name: "Start", no: 5, matches: 4 },
            { name: "Odd", no: 6, matches: 4 },
            { name: "Rosenborg", no: 7, matches: 4 },
            { name: "Stabæk", no: 8, matches: 4 },
            { name: "Bodø/Glimt", no: 9, matches: 4 },
            { name: "Sarpsborg 08", no: 10, matches: 4 },
            { name: "Lillestrøm", no: 11, matches: 4 },
            { name: "Brann", no: 12, matches: 4 },
            { name: "Aalesund", no: 13, matches: 4 },
            { name: "Haugesund", no: 14, matches: 4 },
            { name: "Sandnes Ulf", no: 15, matches: 4 },
            { name: "Sogndal", no: 16, matches: 4 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Tromsø", no: 1, matches: 3 },
            { name: "Bærum", no: 2, matches: 3 },
            { name: "Mjøndalen", no: 3, matches: 3 },
            { name: "Tromsdalen", no: 4, matches: 3 },
            { name: "Nest-Sotra", no: 5, matches: 3 },
            { name: "Fredrikstad", no: 6, matches: 3 },
            { name: "Alta", no: 7, matches: 3 },
            { name: "Sandefjord", no: 8, matches: 3 },
            { name: "Hødd", no: 9, matches: 3 },
            { name: "Kristiansund BK", no: 10, matches: 3 },
            { name: "Strømmen", no: 11, matches: 3 },
            { name: "Hønefoss", no: 12, matches: 3 },
            { name: "Bryne", no: 13, matches: 3 },
            { name: "Ranheim", no: 14, matches: 3 },
            { name: "HamKam", no: 15, matches: 3 },
            { name: "Ullensaker/Kisa", no: 16, matches: 3 }
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


    _dataForRound201405 = exports.round201405 = {
        year: 2014,
        round: 5,
        date: "2014-04-28",
        tippeliga: [
            { name: "Strømsgodset", no: 1, matches: 5 },
            { name: "Molde", no: 2, matches: 5 },
            { name: "Viking", no: 3, matches: 5 },
            { name: "Rosenborg", no: 4, matches: 5 },
            { name: "Stabæk", no: 5, matches: 5 },
            { name: "Sarpsborg 08", no: 6, matches: 5 },
            { name: "Vålerenga", no: 7, matches: 5 },
            { name: "Start", no: 8, matches: 5 },
            { name: "Odd", no: 9, matches: 5 },
            { name: "Lillestrøm", no: 10, matches: 5 },
            { name: "Bodø/Glimt", no: 11, matches: 5 },
            { name: "Sogndal", no: 12, matches: 5 },
            { name: "Brann", no: 13, matches: 5 },
            { name: "Aalesund", no: 14, matches: 5 },
            { name: "Haugesund", no: 15, matches: 5 },
            { name: "Sandnes Ulf", no: 16, matches: 5 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson",
            "Aaron Samuel"
        ],
        adeccoliga: [
            { name: "Tromsø", no: 1, matches: 4 },
            { name: "Mjøndalen", no: 2, matches: 4 },
            { name: "Bærum", no: 3, matches: 4 },
            { name: "Hødd", no: 4, matches: 4 },
            { name: "Sandefjord", no: 5, matches: 4 },
            { name: "Tromsdalen", no: 6, matches: 4 },
            { name: "Kristiansund BK", no: 7, matches: 4 },
            { name: "Nest-Sotra", no: 8, matches: 4 },
            { name: "Fredrikstad", no: 9, matches: 4 },
            { name: "Alta", no: 10, matches: 4 },
            { name: "Bryne", no: 11, matches: 4 },
            { name: "Hønefoss", no: 12, matches: 4 },
            { name: "Strømmen", no: 13, matches: 4 },
            { name: "Ranheim", no: 14, matches: 4 },
            { name: "HamKam", no: 15, matches: 4 },
            { name: "Ullensaker/Kisa", no: 16, matches: 4 }
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


    _dataForRound201406 = exports.round201406 = {
        year: 2014,
        round: 6,
        date: "2014-05-01",
        tippeliga: [
            { name: "Molde", no: 1, matches: 6 },
            { name: "Viking", no: 2, matches: 6 },
            { name: "Strømsgodset", no: 3, matches: 6 },
            { name: "Rosenborg", no: 4, matches: 6 },
            { name: "Vålerenga", no: 5, matches: 6 },
            { name: "Odd", no: 6, matches: 6 },
            { name: "Stabæk", no: 7, matches: 6 },
            { name: "Lillestrøm", no: 8, matches: 6 },
            { name: "Sarpsborg 08", no: 9, matches: 6 },
            { name: "Start", no: 10, matches: 6 },
            { name: "Bodø/Glimt", no: 11, matches: 6 },
            { name: "Haugesund", no: 12, matches: 6 },
            { name: "Sandnes Ulf", no: 13, matches: 6 },
            { name: "Sogndal", no: 14, matches: 6 },
            { name: "Brann", no: 15, matches: 6 },
            { name: "Aalesund", no: 16, matches: 6 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Tromsø", no: 1, matches: 5 },
            { name: "Mjøndalen", no: 2, matches: 5 },
            { name: "Hødd", no: 3, matches: 5 },
            { name: "Sandefjord", no: 4, matches: 5 },
            { name: "Bærum", no: 5, matches: 5 },
            { name: "Nest-Sotra", no: 6, matches: 5 },
            { name: "Tromsdalen", no: 7, matches: 5 },
            { name: "Kristiansund BK", no: 8, matches: 5 },
            { name: "Alta", no: 9, matches: 5 },
            { name: "Fredrikstad", no: 10, matches: 5 },
            { name: "Strømmen", no: 11, matches: 5 },
            { name: "Ranheim", no: 12, matches: 5 },
            { name: "Bryne", no: 13, matches: 5 },
            { name: "Hønefoss", no: 14, matches: 5 },
            { name: "HamKam", no: 15, matches: 5 },
            { name: "Ullensaker/Kisa", no: 16, matches: 5 }
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


    _dataForRound201407 = exports.round201407 = {
        year: 2014,
        round: 7,
        date: "2014-05-05",
        tippeliga: [
            { name: "Molde", no: 1, matches: 7 },
            { name: "Strømsgodset", no: 2, matches: 7 },
            { name: "Viking", no: 3, matches: 7 },
            { name: "Vålerenga", no: 4, matches: 7 },
            { name: "Rosenborg", no: 5, matches: 7 },
            { name: "Lillestrøm", no: 6, matches: 7 },
            { name: "Sarpsborg 08", no: 7, matches: 7 },
            { name: "Odd", no: 8, matches: 7 },
            { name: "Stabæk", no: 9, matches: 7 },
            { name: "Start", no: 10, matches: 7 },
            { name: "Aalesund", no: 11, matches: 7 },
            { name: "Bodø/Glimt", no: 12, matches: 7 },
            { name: "Haugesund", no: 13, matches: 7 },
            { name: "Brann", no: 14, matches: 7 },
            { name: "Sandnes Ulf", no: 15, matches: 7 },
            { name: "Sogndal", no: 16, matches: 7 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Tromsø", no: 1, matches: 6 },
            { name: "Mjøndalen", no: 2, matches: 6 },
            { name: "Sandefjord", no: 3, matches: 6 },
            { name: "Nest-Sotra", no: 4, matches: 6 },
            { name: "Hødd", no: 5, matches: 6 },
            { name: "Kristiansund BK", no: 6, matches: 6 },
            { name: "Alta", no: 7, matches: 6 },
            { name: "Bærum", no: 8, matches: 6 },
            { name: "Tromsdalen", no: 9, matches: 6 },
            { name: "Bryne", no: 10, matches: 6 },
            { name: "Fredrikstad", no: 11, matches: 6 },
            { name: "Strømmen", no: 12, matches: 6 },
            { name: "Ranheim", no: 13, matches: 6 },
            { name: "Hønefoss", no: 14, matches: 6 },
            { name: "Ullensaker/Kisa", no: 15, matches: 6 },
            { name: "HamKam", no: 16, matches: 6 }
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


    _dataForRound201408 = exports.round201408 = {
        year: 2014,
        round: 8,
        date: "2014-05-12",
        tippeliga: [
            { name: "Molde", no: 1, matches: 8 },
            { name: "Strømsgodset", no: 2, matches: 8 },
            { name: "Viking", no: 3, matches: 8 },
            { name: "Rosenborg", no: 4, matches: 8 },
            { name: "Vålerenga", no: 5, matches: 8 },
            { name: "Lillestrøm", no: 6, matches: 8 },
            { name: "Stabæk", no: 7, matches: 8 },
            { name: "Sarpsborg 08", no: 8, matches: 8 },
            { name: "Odd", no: 9, matches: 8 },
            { name: "Bodø/Glimt", no: 10, matches: 8 },
            { name: "Start", no: 11, matches: 8 },
            { name: "Brann", no: 12, matches: 8 },
            { name: "Sogndal", no: 13, matches: 8 },
            { name: "Aalesund", no: 14, matches: 8 },
            { name: "Haugesund", no: 15, matches: 8 },
            { name: "Sandnes Ulf", no: 16, matches: 8 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Mjøndalen", no: 1, matches: 7 },
            { name: "Sandefjord", no: 2, matches: 7 },
            { name: "Nest-Sotra", no: 3, matches: 7 },
            { name: "Tromsø", no: 4, matches: 7 },
            { name: "Bærum", no: 5, matches: 7 },
            { name: "Hødd", no: 6, matches: 7 },
            { name: "Kristiansund BK", no: 7, matches: 7 },
            { name: "Tromsdalen", no: 8, matches: 7 },
            { name: "Alta", no: 9, matches: 7 },
            { name: "Strømmen", no: 10, matches: 7 },
            { name: "Ranheim", no: 11, matches: 7 },
            { name: "Bryne", no: 12, matches: 7 },
            { name: "Fredrikstad", no: 13, matches: 7 },
            { name: "Hønefoss", no: 14, matches: 7 },
            { name: "Ullensaker/Kisa", no: 15, matches: 7 },
            { name: "HamKam", no: 16, matches: 7 }
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


    _dataForRound201409 = exports.round201409 = {
        year: 2014,
        round: 9,
        date: "2014-05-16",
        tippeliga: [
            { name: "Molde", no: 1, matches: 9 },
            { name: "Strømsgodset", no: 2, matches: 9 },
            { name: "Viking", no: 3, matches: 9 },
            { name: "Rosenborg", no: 4, matches: 9 },
            { name: "Vålerenga", no: 5, matches: 9 },
            { name: "Lillestrøm", no: 6, matches: 9 },
            { name: "Stabæk", no: 7, matches: 9 },
            { name: "Sarpsborg 08", no: 8, matches: 9 },
            { name: "Odd", no: 9, matches: 9 },
            { name: "Bodø/Glimt", no: 10, matches: 9 },
            { name: "Start", no: 11, matches: 9 },
            { name: "Brann", no: 12, matches: 9 },
            { name: "Sogndal", no: 13, matches: 9 },
            { name: "Aalesund", no: 14, matches: 9 },
            { name: "Haugesund", no: 15, matches: 9 },
            { name: "Sandnes Ulf", no: 16, matches: 9 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Mjøndalen", no: 1, matches: 8 },
            { name: "Sandefjord", no: 2, matches: 8 },
            { name: "Nest-Sotra", no: 3, matches: 8 },
            { name: "Tromsø", no: 4, matches: 8 },
            { name: "Bærum", no: 5, matches: 8 },
            { name: "Hødd", no: 6, matches: 8 },
            { name: "Kristiansund BK", no: 7, matches: 8 },
            { name: "Tromsdalen", no: 8, matches: 8 },
            { name: "Alta", no: 9, matches: 8 },
            { name: "Strømmen", no: 10, matches: 8 },
            { name: "Ranheim", no: 11, matches: 8 },
            { name: "Bryne", no: 12, matches: 8 },
            { name: "Fredrikstad", no: 13, matches: 8 },
            { name: "Hønefoss", no: 14, matches: 8 },
            { name: "Ullensaker/Kisa", no: 15, matches: 8 },
            { name: "HamKam", no: 16, matches: 8 }
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


    _dataForRound2014010 = exports.round2014010 = {
        year: 2014,
        round: 10,
        date: "2014-05-20",
        tippeliga: [
            { name: "Molde", no: 1, matches: 10 },
            { name: "Strømsgodset", no: 2, matches: 10 },
            { name: "Stabæk", no: 3, matches: 10 },
            { name: "Viking", no: 4, matches: 10 },
            { name: "Odd", no: 5, matches: 10 },
            { name: "Vålerenga", no: 6, matches: 10 },
            { name: "Rosenborg", no: 7, matches: 10 },
            { name: "Lillestrøm", no: 8, matches: 10 },
            { name: "Bodø/Glimt", no: 9, matches: 10 },
            { name: "Sarpsborg 08", no: 10, matches: 10 },
            { name: "Sogndal", no: 11, matches: 10 },
            { name: "Start", no: 12, matches: 10 },
            { name: "Brann", no: 13, matches: 10 },
            { name: "Aalesund", no: 14, matches: 10 },
            { name: "Sandnes Ulf", no: 15, matches: 10 },
            { name: "Haugesund", no: 16, matches: 10 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 9 },
            { name: "Tromsø", no: 2, matches: 9 },
            { name: "Mjøndalen", no: 3, matches: 9 },
            { name: "Bærum", no: 4, matches: 9 },
            { name: "Nest-Sotra", no: 5, matches: 9 },
            { name: "Ranheim", no: 6, matches: 9 },
            { name: "Kristiansund BK", no: 7, matches: 9 },
            { name: "Hødd", no: 8, matches: 9 },
            { name: "Strømmen", no: 9, matches: 9 },
            { name: "Tromsdalen", no: 10, matches: 9 },
            { name: "Alta", no: 11, matches: 9 },
            { name: "Fredrikstad", no: 12, matches: 9 },
            { name: "Bryne", no: 13, matches: 9 },
            { name: "Hønefoss", no: 14, matches: 9 },
            { name: "Ullensaker/Kisa", no: 15, matches: 9 },
            { name: "HamKam", no: 16, matches: 9 }
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


    _dataForRound2014011 = exports.round2014011 = {
        year: 2014,
        round: 11,
        date: "2014-05-25",
        tippeliga: [
            /*
             1.	Molde	11	8	2	1	23	8	+15	26
             2.	Strømsgodset	11	6	3	2	21	13	+8	21
             3.	Odd	11	6	2	3	14	12	+2	20
             4.	Vålerenga	11	5	4	2	21	14	+7	19
             5.	Lillestrøm	11	5	3	3	19	11	+8	18
             6.	Stabæk	11	6	0	5	18	20	-2	18
             7.	Rosenborg	11	4	5	2	19	15	+4	17
             8.	Viking	11	4	5	2	15	11	+4	17
             9.	Bodø/Glimt	11	5	2	4	19	19	0	17
             10.	Sogndal	11	4	2	5	15	19	-4	14
             11.	Sarpsborg 08	11	3	4	4	15	18	-3	13
             12.	Start	11	2	3	6	13	19	-6	9
             13.	Aalesund	11	1	5	5	9	14	-5	8
             14.	Brann	11	2	2	7	13	22	-9	8
             15.	Haugesund	11	1	4	6	10	18	-8	7
             16.	Sandnes Ulf	11	1	4	6	9	20	-11	7
             */
            { name: "Molde", no: 1, matches: 10 },
            { name: "Strømsgodset", no: 2, matches: 10 },
            { name: "Stabæk", no: 3, matches: 10 },
            { name: "Viking", no: 4, matches: 10 },
            { name: "Odd", no: 5, matches: 10 },
            { name: "Vålerenga", no: 6, matches: 10 },
            { name: "Rosenborg", no: 7, matches: 10 },
            { name: "Lillestrøm", no: 8, matches: 10 },
            { name: "Bodø/Glimt", no: 9, matches: 10 },
            { name: "Sarpsborg 08", no: 10, matches: 10 },
            { name: "Sogndal", no: 11, matches: 10 },
            { name: "Start", no: 12, matches: 10 },
            { name: "Brann", no: 13, matches: 10 },
            { name: "Aalesund", no: 14, matches: 10 },
            { name: "Sandnes Ulf", no: 15, matches: 10 },
            { name: "Haugesund", no: 16, matches: 10 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            /*
             1.	Sandefjord	11	8	2	1	21	9	+12	26
             2.	Tromsø	11	7	3	1	21	8	+13	24
             3.	Mjøndalen	11	6	4	1	21	11	+10	22
             4.	Ranheim	11	6	2	3	16	9	+7	20
             5.	Nest-Sotra	11	6	1	4	20	16	+4	19
             6.	Alta	11	5	2	4	14	12	+2	17
             7.	Kristiansund BK	11	5	2	4	18	18	0	17
             8.	Fredrikstad	11	5	2	4	10	10	0	17
             9.	Hødd	11	4	4	3	15	13	+2	16
             10.	Bærum	11	5	1	5	17	22	-5	16
             11.	Strømmen	11	3	3	5	16	21	-5	12
             12.	Tromsdalen	11	3	3	5	11	17	-6	12
             13.	Bryne	11	3	2	6	14	18	-4	11
             14.	Hønefoss	11	2	2	7	12	20	-8	8
             15.	Ullensaker/Kisa	11	1	2	8	8	19	-11	5
             16.	HamKam	11	1	1	9	6	17	-11	4
             */
            { name: "Sandefjord", no: 1, matches: 9 },
            { name: "Tromsø", no: 2, matches: 9 },
            { name: "Mjøndalen", no: 3, matches: 9 },
            { name: "Bærum", no: 4, matches: 9 },
            { name: "Nest-Sotra", no: 5, matches: 9 },
            { name: "Ranheim", no: 6, matches: 9 },
            { name: "Kristiansund BK", no: 7, matches: 9 },
            { name: "Hødd", no: 8, matches: 9 },
            { name: "Strømmen", no: 9, matches: 9 },
            { name: "Tromsdalen", no: 10, matches: 9 },
            { name: "Alta", no: 11, matches: 9 },
            { name: "Fredrikstad", no: 12, matches: 9 },
            { name: "Bryne", no: 13, matches: 9 },
            { name: "Hønefoss", no: 14, matches: 9 },
            { name: "Ullensaker/Kisa", no: 15, matches: 9 },
            { name: "HamKam", no: 16, matches: 9 }
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
        return [
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
        ];
    },


    _getAdeccoligaTable2013 = exports.getAdeccoligaTable2013 = function () {
        "use strict";
        return [
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
        ];
    };
