/* global require: false, exports: false */

// Module dependencies, external
var __ = require("underscore"),
    cheerio = require("cheerio"),
    RQ = require("./vendor/rq").RQ,

// Module dependencies, local generic
    rq = require("./rq-fun"),

// Module dependencies, local
    TeamPlacement = require("./../../shared/scripts/app.models").TeamPlacement,


//////////////////////////////////
// www.altomfotball.no
//////////////////////////////////

    currentTippeligaTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=1&subCmd=total&live=true&useFullUrl=false",

    parseTippeligaTable = function (body) {
        "use strict";
        var currentTable = [],
            $ = cheerio.load(body, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false }),
            rows = $("tbody").find("tr");

        __.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[ 0 ]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[ 2 ]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...

            // The data format
            currentTable.push(new TeamPlacement(team, parseInt(no, 10), matches));
        });
        return currentTable;
    },

    currentAdeccoligaTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=table&tournamentId=2&subCmd=total&live=true&useFullUrl=false",

    parseAdeccoligaTable = function (body) {
        "use strict";
        var currentTable = [],
            $ = cheerio.load(body, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false }),
            rows = $("tbody").find("tr");

        __.each(rows, function (element) {
            var $cells = $(element).find("td"),
                no = $($cells[ 0 ]).html(),
                team = $cells.find("a").first().html(),
                matches = $($cells[ 2 ]).html();

            // Launder ...
            no = no.substring(0, no.length - 1);
            team = team.replace("&nbsp;", " ");

            // Normalize ...

            // The data format
            currentTable.push(new TeamPlacement(team, parseInt(no, 10), matches));
        });
        return currentTable;
    },

    currentTippeligaToppscorerTableUrl =
        "http://www.altomfotball.no/elementsCommonAjax.do?cmd=statistics&subCmd=goals&tournamentId=1&seasonId=&teamId=&useFullUrl=false",

    parseTippeligaTopScorerTable = function (body) {
        "use strict";
        var toppscorers = [],
            $ = cheerio.load(body, { decodeEntities: false, normalizeWhitespace: false, xmlMode: false }),
            rows = $("tbody").find("tr"),
            maxGoals = 0;

        __.each(rows, function (element, index) {
            var $cells = $(element).find("td"),
                player = $cells.find("a").first().html(),
                goals = $($cells[ 3 ]).html();

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


//////////////////////////////////////////////
// Public functions
//////////////////////////////////////////////

// These requestories all returns "data generator" requestors => No forwarding of existing data ...
    _getCurrentTippeligaTableRequestory = exports.getCurrentTippeligaTable =
        RQ.sequence([
            rq.get('utf8', currentTippeligaTableUrl),
            rq.then(parseTippeligaTable)
        ]),

    _getCurrentAdeccoligaTableRequestory = exports.getCurrentAdeccoligaTable =
        RQ.sequence([
            rq.get('utf8', currentAdeccoligaTableUrl),
            rq.then(parseAdeccoligaTable)
        ]),

    _getCurrentTippeligaTopScorerRequestory = exports.getCurrentTippeligaTopScorer =
        RQ.sequence([
            rq.get('utf8', currentTippeligaToppscorerTableUrl),
            rq.then(parseTippeligaTopScorerTable)
        ]),

    _getCurrentRemainingCupContenders = exports.getCurrentRemainingCupContenders =
        rq.return([ "Molde" ]),
// /Requestories


// TODO: Establish MongoDB/Mongolab export/import routines and lean on them - then delete all crap below!
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
            { name: "Vålerenga", no: 4, matches: 9 },
            { name: "Rosenborg", no: 5, matches: 9 },
            { name: "Stabæk", no: 6, matches: 9 },
            { name: "Lillestrøm", no: 7, matches: 9 },
            { name: "Odd", no: 8, matches: 9 },
            { name: "Bodø/Glimt", no: 9, matches: 9 },
            { name: "Sarpsborg 08", no: 10, matches: 9 },
            { name: "Start", no: 11, matches: 9 },
            { name: "Sogndal", no: 12, matches: 9 },
            { name: "Brann", no: 13, matches: 9 },
            { name: "Aalesund", no: 14, matches: 9 },
            { name: "Sandnes Ulf", no: 15, matches: 9 },
            { name: "Haugesund", no: 16, matches: 9 }
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
            { name: "Molde", no: 1, matches: 11 },
            { name: "Strømsgodset", no: 2, matches: 11 },
            { name: "Odd", no: 3, matches: 11 },
            { name: "Vålerenga", no: 4, matches: 11 },
            { name: "Lillestrøm", no: 5, matches: 11 },
            { name: "Stabæk", no: 6, matches: 11 },
            { name: "Rosenborg", no: 7, matches: 11 },
            { name: "Viking", no: 8, matches: 11 },
            { name: "Bodø/Glimt", no: 9, matches: 11 },
            { name: "Sogndal", no: 10, matches: 11 },
            { name: "Sarpsborg 08", no: 11, matches: 11 },
            { name: "Start", no: 12, matches: 11 },
            { name: "Aalesund", no: 13, matches: 11 },
            { name: "Brann", no: 14, matches: 11 },
            { name: "Haugesund", no: 15, matches: 11 },
            { name: "Sandnes Ulf", no: 16, matches: 11 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 12 },
            { name: "Tromsø", no: 2, matches: 12 },
            { name: "Ranheim", no: 3, matches: 12 },
            { name: "Mjøndalen", no: 4, matches: 12 },
            { name: "Fredrikstad", no: 5, matches: 12 },
            { name: "Kristiansund BK", no: 6, matches: 12 },
            { name: "Nest-Sotra", no: 7, matches: 12 },
            { name: "Alta", no: 8, matches: 12 },
            { name: "Hødd", no: 9, matches: 12 },
            { name: "Bærum", no: 10, matches: 12 },
            { name: "Strømmen", no: 11, matches: 12 },
            { name: "Tromsdalen", no: 12, matches: 12 },
            { name: "Bryne", no: 13, matches: 12 },
            { name: "Hønefoss", no: 14, matches: 12 },
            { name: "Ullensaker/Kisa", no: 15, matches: 12 },
            { name: "HamKam", no: 16, matches: 12 }
        ],
        remainingCupContenders: [
            "Bodø/Glimt",
            "Brann",
            "Molde",
            "Stabæk",
            "Vålerenga"
        ]
    },


    _dataForRound2014012 = exports.round2014012 = {
        year: 2014,
        round: 12,
        date: "2014-06-09",
        tippeliga: [
            { name: "Molde", no: 1, matches: 12 },
            { name: "Strømsgodset", no: 2, matches: 12 },
            { name: "Vålerenga", no: 3, matches: 12 },
            { name: "Odd", no: 4, matches: 12 },
            { name: "Rosenborg", no: 5, matches: 12 },
            { name: "Lillestrøm", no: 6, matches: 12 },
            { name: "Viking", no: 7, matches: 12 },
            { name: "Stabæk", no: 8, matches: 12 },
            { name: "Bodø/Glimt", no: 9, matches: 12 },
            { name: "Sogndal", no: 10, matches: 12 },
            { name: "Sarpsborg 08", no: 11, matches: 12 },
            { name: "Start", no: 12, matches: 12 },
            { name: "Sandnes Ulf", no: 13, matches: 12 },
            { name: "Aalesund", no: 14, matches: 12 },
            { name: "Brann", no: 15, matches: 12 },
            { name: "Haugesund", no: 16, matches: 12 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 13 },
            { name: "Tromsø", no: 2, matches: 13 },
            { name: "Ranheim", no: 3, matches: 13 },
            { name: "Kristiansund BK", no: 4, matches: 13 },
            { name: "Mjøndalen", no: 5, matches: 13 },
            { name: "Nest-Sotra", no: 6, matches: 13 },
            { name: "Fredrikstad", no: 7, matches: 13 },
            { name: "Alta", no: 8, matches: 13 },
            { name: "Bærum", no: 9, matches: 13 },
            { name: "Hødd", no: 10, matches: 13 },
            { name: "Strømmen", no: 11, matches: 13 },
            { name: "Tromsdalen", no: 12, matches: 13 },
            { name: "Bryne", no: 13, matches: 13 },
            { name: "Hønefoss", no: 14, matches: 13 },
            { name: "Ullensaker/Kisa", no: 15, matches: 13 },
            { name: "HamKam", no: 16, matches: 13 }
        ],
        remainingCupContenders: [
            "Bodø/Glimt",
            "Brann",
            "Molde",
            "Stabæk",
            "Vålerenga"
        ]
    },


    _dataForRound2014013 = exports.round2014013 = {
        year: 2014,
        round: 13,
        date: "2014-06-12",
        tippeliga: [
            { name: "Molde", no: 1, matches: 13 },
            { name: "Strømsgodset", no: 2, matches: 13 },
            { name: "Odd", no: 3, matches: 13 },
            { name: "Rosenborg", no: 4, matches: 13 },
            { name: "Vålerenga", no: 5, matches: 13 },
            { name: "Lillestrøm", no: 6, matches: 13 },
            { name: "Viking", no: 7, matches: 13 },
            { name: "Bodø/Glimt", no: 8, matches: 13 },
            { name: "Sogndal", no: 9, matches: 13 },
            { name: "Stabæk", no: 10, matches: 13 },
            { name: "Sarpsborg 08", no: 11, matches: 13 },
            { name: "Start", no: 12, matches: 13 },
            { name: "Aalesund", no: 13, matches: 13 },
            { name: "Haugesund", no: 14, matches: 13 },
            { name: "Sandnes Ulf", no: 15, matches: 13 },
            { name: "Brann", no: 16, matches: 13 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 15 },
            { name: "Tromsø", no: 2, matches: 15 },
            { name: "Ranheim", no: 3, matches: 15 },
            { name: "Mjøndalen", no: 4, matches: 15 },
            { name: "Kristiansund BK", no: 5, matches: 15 },
            { name: "Fredrikstad", no: 6, matches: 15 },
            { name: "Nest-Sotra", no: 7, matches: 15 },
            { name: "Bærum", no: 8, matches: 15 },
            { name: "Hødd", no: 9, matches: 15 },
            { name: "Alta", no: 10, matches: 15 },
            { name: "Strømmen", no: 11, matches: 15 },
            { name: "Bryne", no: 12, matches: 15 },
            { name: "Tromsdalen", no: 13, matches: 15 },
            { name: "Hønefoss", no: 14, matches: 15 },
            { name: "Ullensaker/Kisa", no: 15, matches: 15 },
            { name: "HamKam", no: 16, matches: 15 }
        ],
        remainingCupContenders: [
            "Bodø/Glimt",
            "Brann",
            "Molde",
            "Stabæk"
        ]
    },


    _dataForRound2014014 = exports.round2014014 = {
        year: 2014,
        round: 14,
        date: "2014-07-07",
        tippeliga: [
            { name: "Molde", no: 1, matches: 14 },
            { name: "Strømsgodset", no: 2, matches: 14 },
            { name: "Rosenborg", no: 3, matches: 14 },
            { name: "Odd", no: 4, matches: 14 },
            { name: "Vålerenga", no: 5, matches: 14 },
            { name: "Lillestrøm", no: 6, matches: 14 },
            { name: "Viking", no: 7, matches: 14 },
            { name: "Bodø/Glimt", no: 8, matches: 14 },
            { name: "Sogndal", no: 9, matches: 14 },
            { name: "Stabæk", no: 10, matches: 14 },
            { name: "Sarpsborg 08", no: 11, matches: 14 },
            { name: "Start", no: 12, matches: 14 },
            { name: "Aalesund", no: 13, matches: 14 },
            { name: "Brann", no: 14, matches: 14 },
            { name: "Haugesund", no: 15, matches: 14 },
            { name: "Sandnes Ulf", no: 16, matches: 14 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 15 },
            { name: "Tromsø", no: 2, matches: 15 },
            { name: "Ranheim", no: 3, matches: 15 },
            { name: "Mjøndalen", no: 4, matches: 15 },
            { name: "Kristiansund BK", no: 5, matches: 15 },
            { name: "Fredrikstad", no: 6, matches: 15 },
            { name: "Nest-Sotra", no: 7, matches: 15 },
            { name: "Bærum", no: 8, matches: 15 },
            { name: "Hødd", no: 9, matches: 15 },
            { name: "Alta", no: 10, matches: 15 },
            { name: "Strømmen", no: 11, matches: 15 },
            { name: "Bryne", no: 12, matches: 15 },
            { name: "Tromsdalen", no: 13, matches: 15 },
            { name: "Hønefoss", no: 14, matches: 15 },
            { name: "Ullensaker/Kisa", no: 15, matches: 15 },
            { name: "HamKam", no: 16, matches: 15 }
        ],
        remainingCupContenders: [
            "Bodø/Glimt",
            "Brann",
            "Molde",
            "Stabæk"
        ]
    },


    _dataForRound2014015 = exports.round2014015 = {
        year: 2014,
        round: 15,
        date: "2014-07-13",
        tippeliga: [
            { name: "Molde", no: 1, matches: 15 },
            { name: "Strømsgodset", no: 2, matches: 15 },
            { name: "Odd", no: 3, matches: 15 },
            { name: "Rosenborg", no: 4, matches: 15 },
            { name: "Vålerenga", no: 5, matches: 15 },
            { name: "Lillestrøm", no: 6, matches: 15 },
            { name: "Viking", no: 7, matches: 15 },
            { name: "Sogndal", no: 8, matches: 15 },
            { name: "Start", no: 9, matches: 15 },
            { name: "Bodø/Glimt", no: 10, matches: 15 },
            { name: "Sarpsborg 08", no: 11, matches: 15 },
            { name: "Stabæk", no: 12, matches: 15 },
            { name: "Aalesund", no: 13, matches: 15 },
            { name: "Haugesund", no: 14, matches: 15 },
            { name: "Brann", no: 15, matches: 15 },
            { name: "Sandnes Ulf", no: 16, matches: 15 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 15 },
            { name: "Tromsø", no: 2, matches: 15 },
            { name: "Ranheim", no: 3, matches: 15 },
            { name: "Mjøndalen", no: 4, matches: 15 },
            { name: "Kristiansund BK", no: 5, matches: 15 },
            { name: "Fredrikstad", no: 6, matches: 15 },
            { name: "Nest-Sotra", no: 7, matches: 15 },
            { name: "Bærum", no: 8, matches: 15 },
            { name: "Hødd", no: 9, matches: 15 },
            { name: "Alta", no: 10, matches: 15 },
            { name: "Strømmen", no: 11, matches: 15 },
            { name: "Bryne", no: 12, matches: 15 },
            { name: "Tromsdalen", no: 13, matches: 15 },
            { name: "Hønefoss", no: 14, matches: 15 },
            { name: "Ullensaker/Kisa", no: 15, matches: 15 },
            { name: "HamKam", no: 16, matches: 15 }
        ],
        remainingCupContenders: [
            "Bodø/Glimt",
            "Brann",
            "Molde",
            "Stabæk"
        ]
    },


    _dataForRound2014016 = exports.round2014016 = {
        year: 2014,
        round: 16,
        date: "2014-07-22",
        tippeliga: [
            { name: "Molde", no: 1, matches: 16 },
            { name: "Rosenborg", no: 2, matches: 16 },
            { name: "Strømsgodset", no: 3, matches: 16 },
            { name: "Odd", no: 4, matches: 16 },
            { name: "Vålerenga", no: 5, matches: 16 },
            { name: "Lillestrøm", no: 6, matches: 16 },
            { name: "Viking", no: 7, matches: 16 },
            { name: "Start", no: 8, matches: 16 },
            { name: "Sarpsborg 08", no: 9, matches: 16 },
            { name: "Sogndal", no: 10, matches: 16 },
            { name: "Stabæk", no: 11, matches: 16 },
            { name: "Bodø/Glimt", no: 12, matches: 16 },
            { name: "Haugesund", no: 13, matches: 16 },
            { name: "Aalesund", no: 14, matches: 16 },
            { name: "Brann", no: 15, matches: 16 },
            { name: "Sandnes Ulf", no: 16, matches: 16 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 16 },
            { name: "Tromsø", no: 2, matches: 15 },
            { name: "Ranheim", no: 3, matches: 16 },
            { name: "Kristiansund BK", no: 4, matches: 16 },
            { name: "Fredrikstad", no: 5, matches: 16 },
            { name: "Mjøndalen", no: 6, matches: 15 },
            { name: "Hødd", no: 7, matches: 16 },
            { name: "Nest-Sotra", no: 8, matches: 16 },
            { name: "Strømmen", no: 9, matches: 16 },
            { name: "Bærum", no: 10, matches: 16 },
            { name: "Alta", no: 11, matches: 16 },
            { name: "Bryne", no: 12, matches: 16 },
            { name: "Hønefoss", no: 13, matches: 16 },
            { name: "Tromsdalen", no: 14, matches: 16 },
            { name: "Ullensaker/Kisa", no: 15, matches: 16 },
            { name: "HamKam", no: 16, matches: 16 }
        ],
        remainingCupContenders: [
            "Brann",
            "Haugesund",
            "Lillestrøm",
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk",
            "Viking"
        ]
    },


    _dataForRound2014017 = exports.round2014017 = {
        year: 2014,
        round: 17,
        date: "2014-07-29",
        tippeliga: [
            { name: "Molde", no: 1, matches: 17 },
            { name: "Strømsgodset", no: 2, matches: 17 },
            { name: "Odd", no: 3, matches: 17 },
            { name: "Vålerenga", no: 4, matches: 17 },
            { name: "Rosenborg", no: 5, matches: 17 },
            { name: "Viking", no: 6, matches: 17 },
            { name: "Lillestrøm", no: 7, matches: 17 },
            { name: "Sarpsborg 08", no: 8, matches: 17 },
            { name: "Start", no: 9, matches: 17 },
            { name: "Sogndal", no: 10, matches: 17 },
            { name: "Stabæk", no: 11, matches: 17 },
            { name: "Bodø/Glimt", no: 12, matches: 17 },
            { name: "Haugesund", no: 13, matches: 17 },
            { name: "Aalesund", no: 14, matches: 17 },
            { name: "Brann", no: 15, matches: 17 },
            { name: "Sandnes Ulf", no: 16, matches: 17 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 17 },
            { name: "Tromsø", no: 2, matches: 16 },
            { name: "Ranheim", no: 3, matches: 17 },
            { name: "Fredrikstad", no: 4, matches: 17 },
            { name: "Mjøndalen", no: 5, matches: 16 },
            { name: "Kristiansund BK", no: 6, matches: 17 },
            { name: "Bærum", no: 7, matches: 17 },
            { name: "Nest-Sotra", no: 8, matches: 17 },
            { name: "Hødd", no: 9, matches: 17 },
            { name: "Strømmen", no: 10, matches: 17 },
            { name: "Alta", no: 11, matches: 17 },
            { name: "Hønefoss", no: 12, matches: 17 },
            { name: "Tromsdalen", no: 13, matches: 17 },
            { name: "Bryne", no: 14, matches: 17 },
            { name: "Ullensaker/Kisa", no: 15, matches: 17 },
            { name: "HamKam", no: 16, matches: 17 }
        ],
        remainingCupContenders: [
            "Brann",
            "Haugesund",
            "Lillestrøm",
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk",
            "Viking"
        ]
    },


    _dataForRound2014018 = exports.round2014018 = {
        year: 2014,
        round: 18,
        date: "2014-08-03",
        tippeliga: [
            { name: "Molde", no: 1, matches: 18 },
            { name: "Odd", no: 2, matches: 18 },
            { name: "Strømsgodset", no: 3, matches: 18 },
            { name: "Vålerenga", no: 4, matches: 18 },
            { name: "Rosenborg", no: 5, matches: 18 },
            { name: "Lillestrøm", no: 6, matches: 18 },
            { name: "Viking", no: 7, matches: 18 },
            { name: "Sarpsborg 08", no: 8, matches: 18 },
            { name: "Start", no: 9, matches: 18 },
            { name: "Stabæk", no: 10, matches: 18 },
            { name: "Haugesund", no: 11, matches: 18 },
            { name: "Sogndal", no: 12, matches: 18 },
            { name: "Aalesund", no: 13, matches: 18 },
            { name: "Bodø/Glimt", no: 14, matches: 18 },
            { name: "Brann", no: 15, matches: 18 },
            { name: "Sandnes Ulf", no: 16, matches: 18 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Tromsø", no: 1, matches: 18 },
            { name: "Sandefjord", no: 2, matches: 17 },
            { name: "Ranheim", no: 3, matches: 18 },
            { name: "Mjøndalen", no: 4, matches: 18 },
            { name: "Kristiansund BK", no: 5, matches: 17 },
            { name: "Fredrikstad", no: 6, matches: 18 },
            { name: "Bærum", no: 7, matches: 18 },
            { name: "Nest-Sotra", no: 8, matches: 18 },
            { name: "Hødd", no: 9, matches: 18 },
            { name: "Strømmen", no: 10, matches: 18 },
            { name: "Bryne", no: 11, matches: 18 },
            { name: "Tromsdalen", no: 12, matches: 18 },
            { name: "Alta", no: 13, matches: 18 },
            { name: "Hønefoss", no: 14, matches: 18 },
            { name: "Ullensaker/Kisa", no: 15, matches: 18 },
            { name: "HamKam", no: 16, matches: 18 }
        ],
        remainingCupContenders: [
            "Brann",
            "Haugesund",
            "Lillestrøm",
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk",
            "Viking"
        ]
    },


    _dataForRound2014019 = exports.round2014019 = {
        year: 2014,
        round: 19,
        date: "2014-08-10",
        tippeliga: [
            { name: "Molde", no: 1, matches: 19 },
            { name: "Odd", no: 2, matches: 19 },
            { name: "Strømsgodset", no: 3, matches: 19 },
            { name: "Vålerenga", no: 4, matches: 19 },
            { name: "Rosenborg", no: 5, matches: 19 },
            { name: "Lillestrøm", no: 6, matches: 19 },
            { name: "Viking", no: 7, matches: 19 },
            { name: "Sarpsborg 08", no: 8, matches: 19 },
            { name: "Start", no: 9, matches: 19 },
            { name: "Stabæk", no: 10, matches: 19 },
            { name: "Haugesund", no: 11, matches: 19 },
            { name: "Sogndal", no: 12, matches: 19 },
            { name: "Aalesund", no: 13, matches: 19 },
            { name: "Bodø/Glimt", no: 14, matches: 19 },
            { name: "Brann", no: 15, matches: 19 },
            { name: "Sandnes Ulf", no: 16, matches: 19 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 20 },
            { name: "Tromsø", no: 2, matches: 19 },
            { name: "Mjøndalen", no: 3, matches: 19 },
            { name: "Ranheim", no: 4, matches: 20 },
            { name: "Fredrikstad", no: 5, matches: 20 },
            { name: "Bærum", no: 6, matches: 20 },
            { name: "Kristiansund BK", no: 7, matches: 20 },
            { name: "Nest-Sotra", no: 8, matches: 20 },
            { name: "Strømmen", no: 9, matches: 20 },
            { name: "Hødd", no: 10, matches: 20 },
            { name: "Bryne", no: 11, matches: 20 },
            { name: "Alta", no: 12, matches: 20 },
            { name: "Hønefoss", no: 13, matches: 20 },
            { name: "Tromsdalen", no: 14, matches: 20 },
            { name: "Ullensaker/Kisa", no: 15, matches: 20 },
            { name: "HamKam", no: 16, matches: 20 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk"
        ]
    },


    _dataForRound2014020 = exports.round2014020 = {
        year: 2014,
        round: 20,
        date: "2014-08-17",
        tippeliga: [
            { name: "Molde", no: 1, matches: 20 },
            { name: "Odd", no: 2, matches: 20 },
            { name: "Strømsgodset", no: 3, matches: 20 },
            { name: "Rosenborg", no: 4, matches: 20 },
            { name: "Vålerenga", no: 5, matches: 20 },
            { name: "Lillestrøm", no: 6, matches: 20 },
            { name: "Viking", no: 7, matches: 20 },
            { name: "Sarpsborg 08", no: 8, matches: 20 },
            { name: "Stabæk", no: 9, matches: 20 },
            { name: "Bodø/Glimt", no: 10, matches: 20 },
            { name: "Start", no: 11, matches: 20 },
            { name: "Haugesund", no: 12, matches: 20 },
            { name: "Aalesund", no: 13, matches: 20 },
            { name: "Sogndal", no: 14, matches: 20 },
            { name: "Brann", no: 15, matches: 20 },
            { name: "Sandnes Ulf", no: 16, matches: 20 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 20 },
            { name: "Tromsø", no: 2, matches: 19 },
            { name: "Mjøndalen", no: 3, matches: 19 },
            { name: "Ranheim", no: 4, matches: 20 },
            { name: "Fredrikstad", no: 5, matches: 20 },
            { name: "Bærum", no: 6, matches: 20 },
            { name: "Kristiansund BK", no: 7, matches: 20 },
            { name: "Nest-Sotra", no: 8, matches: 20 },
            { name: "Strømmen", no: 9, matches: 20 },
            { name: "Hødd", no: 10, matches: 20 },
            { name: "Bryne", no: 11, matches: 20 },
            { name: "Alta", no: 12, matches: 20 },
            { name: "Hønefoss", no: 13, matches: 20 },
            { name: "Tromsdalen", no: 14, matches: 20 },
            { name: "Ullensaker/Kisa", no: 15, matches: 20 },
            { name: "HamKam", no: 16, matches: 20 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk"
        ]
    },


    _dataForRound2014021 = exports.round2014021 = {
        year: 2014,
        round: 21,
        date: "2014-08-24",
        tippeliga: [
            { name: "Molde", no: 1, matches: 21 },
            { name: "Odd", no: 2, matches: 21 },
            { name: "Strømsgodset", no: 3, matches: 21 },
            { name: "Rosenborg", no: 4, matches: 21 },
            { name: "Lillestrøm", no: 5, matches: 21 },
            { name: "Vålerenga", no: 6, matches: 21 },
            { name: "Viking", no: 7, matches: 21 },
            { name: "Stabæk", no: 8, matches: 21 },
            { name: "Bodø/Glimt", no: 9, matches: 21 },
            { name: "Sarpsborg 08", no: 10, matches: 21 },
            { name: "Start", no: 11, matches: 21 },
            { name: "Haugesund", no: 12, matches: 21 },
            { name: "Aalesund", no: 13, matches: 21 },
            { name: "Sogndal", no: 14, matches: 21 },
            { name: "Brann", no: 15, matches: 21 },
            { name: "Sandnes Ulf", no: 16, matches: 21 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 22 },
            { name: "Tromsø", no: 2, matches: 21 },
            { name: "Ranheim", no: 3, matches: 22 },
            { name: "Bærum", no: 4, matches: 22 },
            { name: "Mjøndalen", no: 5, matches: 21 },
            { name: "Fredrikstad", no: 6, matches: 22 },
            { name: "Kristiansund BK", no: 7, matches: 22 },
            { name: "Hødd", no: 8, matches: 22 },
            { name: "Nest-Sotra", no: 9, matches: 22 },
            { name: "Bryne", no: 10, matches: 22 },
            { name: "Strømmen", no: 11, matches: 22 },
            { name: "Alta", no: 12, matches: 22 },
            { name: "Hønefoss", no: 13, matches: 22 },
            { name: "Tromsdalen", no: 14, matches: 22 },
            { name: "Ullensaker/Kisa", no: 15, matches: 22 },
            { name: "HamKam", no: 16, matches: 22 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk"
        ]
    },


    _dataForRound2014022 = exports.round2014022 = {
        year: 2014,
        round: 22,
        date: "2014-08-31",
        tippeliga: [
            { name: "Molde", no: 1, matches: 22 },
            { name: "Odd", no: 2, matches: 22 },
            { name: "Rosenborg", no: 3, matches: 22 },
            { name: "Lillestrøm", no: 4, matches: 22 },
            { name: "Strømsgodset", no: 5, matches: 22 },
            { name: "Vålerenga", no: 6, matches: 22 },
            { name: "Viking", no: 7, matches: 22 },
            { name: "Bodø/Glimt", no: 8, matches: 22 },
            { name: "Stabæk", no: 9, matches: 22 },
            { name: "Sarpsborg 08", no: 10, matches: 22 },
            { name: "Start", no: 11, matches: 22 },
            { name: "Aalesund", no: 12, matches: 22 },
            { name: "Haugesund", no: 13, matches: 22 },
            { name: "Sogndal", no: 14, matches: 22 },
            { name: "Brann", no: 15, matches: 22 },
            { name: "Sandnes Ulf", no: 16, matches: 22 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 1, matches: 23 },
            { name: "Tromsø", no: 2, matches: 23 },
            { name: "Mjøndalen", no: 3, matches: 23 },
            { name: "Fredrikstad", no: 4, matches: 23 },
            { name: "Ranheim", no: 5, matches: 23 },
            { name: "Bærum", no: 6, matches: 23 },
            { name: "Kristiansund BK", no: 7, matches: 23 },
            { name: "Nest-Sotra", no: 8, matches: 23 },
            { name: "Hødd", no: 9, matches: 23 },
            { name: "Strømmen", no: 10, matches: 23 },
            { name: "Bryne", no: 11, matches: 23 },
            { name: "Hønefoss", no: 12, matches: 23 },
            { name: "Alta", no: 13, matches: 23 },
            { name: "Tromsdalen", no: 14, matches: 23 },
            { name: "Ullensaker/Kisa", no: 15, matches: 23 },
            { name: "HamKam", no: 16, matches: 23 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk"
        ]
    },


    _dataForRound2014023 = exports.round2014023 = {
        year: 2014,
        round: 23,
        date: "2014-09-14",
        tippeliga: [
            { name: "Molde", no: 1, matches: 23 },
            { name: "Odd", no: 2, matches: 23 },
            { name: "Rosenborg", no: 3, matches: 23 },
            { name: "Lillestrøm", no: 4, matches: 23 },
            { name: "Strømsgodset", no: 5, matches: 23 },
            { name: "Vålerenga", no: 6, matches: 23 },
            { name: "Viking", no: 7, matches: 23 },
            { name: "Stabæk", no: 8, matches: 23 },
            { name: "Sarpsborg 08", no: 9, matches: 23 },
            { name: "Bodø/Glimt", no: 10, matches: 23 },
            { name: "Aalesund", no: 11, matches: 23 },
            { name: "Start", no: 12, matches: 23 },
            { name: "Brann", no: 13, matches: 23 },
            { name: "Haugesund", no: 14, matches: 23 },
            { name: "Sogndal", no: 15, matches: 23 },
            { name: "Sandnes Ulf", no: 16, matches: 23 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 24 },
            { name: "Tromsø", no: 2, matches: 24 },
            { name: "Mjøndalen", no: 3, matches: 24 },
            { name: "Ranheim", no: 4, matches: 24 },
            { name: "Fredrikstad", no: 5, matches: 24 },
            { name: "Bærum", no: 6, matches: 24 },
            { name: "Kristiansund BK", no: 7, matches: 24 },
            { name: "Strømmen", no: 8, matches: 24 },
            { name: "Nest-Sotra", no: 9, matches: 24 },
            { name: "Bryne", no: 10, matches: 24 },
            { name: "Hødd", no: 11, matches: 24 },
            { name: "Hønefoss", no: 12, matches: 24 },
            { name: "Alta", no: 13, matches: 24 },
            { name: "Tromsdalen", no: 14, matches: 24 },
            { name: "Ullensaker/Kisa", no: 15, matches: 24 },
            { name: "HamKam", no: 16, matches: 24 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk"
        ]
    },


    _dataForRound2014024 = exports.round2014024 = {
        year: 2014,
        round: 24,
        date: "2014-09-21",
        tippeliga: [
            { name: "Molde", no: 1, matches: 24 },
            { name: "Odd", no: 2, matches: 24 },
            { name: "Rosenborg", no: 3, matches: 24 },
            { name: "Lillestrøm", no: 4, matches: 24 },
            { name: "Strømsgodset", no: 5, matches: 24 },
            { name: "Vålerenga", no: 6, matches: 24 },
            { name: "Viking", no: 7, matches: 24 },
            { name: "Sarpsborg 08", no: 8, matches: 24 },
            { name: "Stabæk", no: 9, matches: 24 },
            { name: "Aalesund", no: 10, matches: 24 },
            { name: "Start", no: 11, matches: 24 },
            { name: "Bodø/Glimt", no: 12, matches: 24 },
            { name: "Haugesund", no: 13, matches: 24 },
            { name: "Brann", no: 14, matches: 24 },
            { name: "Sogndal", no: 15, matches: 24 },
            { name: "Sandnes Ulf", no: 16, matches: 24 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 25 },
            { name: "Tromsø", no: 2, matches: 25 },
            { name: "Ranheim", no: 3, matches: 25 },
            { name: "Bærum", no: 4, matches: 25 },
            { name: "Mjøndalen", no: 5, matches: 25 },
            { name: "Kristiansund BK", no: 6, matches: 25 },
            { name: "Fredrikstad", no: 7, matches: 25 },
            { name: "Strømmen", no: 8, matches: 25 },
            { name: "Bryne", no: 9, matches: 25 },
            { name: "Hødd", no: 10, matches: 25 },
            { name: "Nest-Sotra", no: 11, matches: 25 },
            { name: "Hønefoss", no: 12, matches: 25 },
            { name: "Alta", no: 13, matches: 25 },
            { name: "Tromsdalen", no: 14, matches: 25 },
            { name: "Ullensaker/Kisa", no: 15, matches: 25 },
            { name: "HamKam", no: 16, matches: 25 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd",
            "Sarpsborg 08",
            "Stabæk"
        ]
    },


    _dataForRound2014025 = exports.round2014025 = {
        year: 2014,
        round: 25,
        date: "2014-09-28",
        tippeliga: [
            { name: "Molde", no: 1, matches: 25 },
            { name: "Odd", no: 2, matches: 25 },
            { name: "Rosenborg", no: 3, matches: 25 },
            { name: "Strømsgodset", no: 4, matches: 25 },
            { name: "Lillestrøm", no: 5, matches: 25 },
            { name: "Vålerenga", no: 6, matches: 25 },
            { name: "Stabæk", no: 7, matches: 25 },
            { name: "Viking", no: 8, matches: 25 },
            { name: "Sarpsborg 08", no: 9, matches: 25 },
            { name: "Start", no: 10, matches: 25 },
            { name: "Aalesund", no: 11, matches: 25 },
            { name: "Bodø/Glimt", no: 12, matches: 25 },
            { name: "Haugesund", no: 13, matches: 25 },
            { name: "Sogndal", no: 14, matches: 25 },
            { name: "Brann", no: 15, matches: 25 },
            { name: "Sandnes Ulf", no: 16, matches: 25 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 26 },
            { name: "Tromsø", no: 2, matches: 26 },
            { name: "Ranheim", no: 3, matches: 26 },
            { name: "Fredrikstad", no: 4, matches: 26 },
            { name: "Bærum", no: 5, matches: 26 },
            { name: "Mjøndalen", no: 6, matches: 26 },
            { name: "Kristiansund BK", no: 7, matches: 26 },
            { name: "Bryne", no: 8, matches: 26 },
            { name: "Hødd", no: 9, matches: 26 },
            { name: "Strømmen", no: 10, matches: 26 },
            { name: "Nest-Sotra", no: 11, matches: 26 },
            { name: "Hønefoss", no: 12, matches: 26 },
            { name: "Alta", no: 13, matches: 26 },
            { name: "Tromsdalen", no: 14, matches: 26 },
            { name: "Ullensaker/Kisa", no: 15, matches: 26 },
            { name: "HamKam", no: 16, matches: 26 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd"
        ]
    },


    _dataForRound2014026 = exports.round2014026 = {
        year: 2014,
        round: 26,
        date: "2014-10-05",
        tippeliga: [
            { name: "Molde", no: 1, matches: 26 },
            { name: "Odd", no: 2, matches: 26 },
            { name: "Rosenborg", no: 3, matches: 26 },
            { name: "Strømsgodset", no: 4, matches: 26 },
            { name: "Lillestrøm", no: 5, matches: 26 },
            { name: "Vålerenga", no: 6, matches: 26 },
            { name: "Start", no: 7, matches: 26 },
            { name: "Stabæk", no: 8, matches: 26 },
            { name: "Sarpsborg 08", no: 9, matches: 26 },
            { name: "Viking", no: 10, matches: 26 },
            { name: "Aalesund", no: 11, matches: 26 },
            { name: "Bodø/Glimt", no: 12, matches: 26 },
            { name: "Haugesund", no: 13, matches: 26 },
            { name: "Sogndal", no: 14, matches: 26 },
            { name: "Brann", no: 15, matches: 26 },
            { name: "Sandnes Ulf", no: 16, matches: 26 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 27 },
            { name: "Tromsø", no: 2, matches: 27 },
            { name: "Kristiansund BK", no: 3, matches: 27 },
            { name: "Ranheim", no: 4, matches: 27 },
            { name: "Fredrikstad", no: 5, matches: 27 },
            { name: "Bærum", no: 6, matches: 27 },
            { name: "Mjøndalen", no: 7, matches: 27 },
            { name: "Bryne", no: 8, matches: 27 },
            { name: "Strømmen", no: 9, matches: 27 },
            { name: "Hødd", no: 10, matches: 27 },
            { name: "Nest-Sotra", no: 11, matches: 27 },
            { name: "Hønefoss", no: 12, matches: 27 },
            { name: "Alta", no: 13, matches: 27 },
            { name: "Tromsdalen", no: 14, matches: 27 },
            { name: "Ullensaker/Kisa", no: 15, matches: 27 },
            { name: "HamKam", no: 16, matches: 27 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd"
        ]
    },


    _dataForRound2014027 = exports.round2014027 = {
        year: 2014,
        round: 27,
        date: "2014-10-19",
        tippeliga: [
            { name: "Molde", no: 1, matches: 27 },
            { name: "Odd", no: 2, matches: 27 },
            { name: "Rosenborg", no: 3, matches: 27 },
            { name: "Strømsgodset", no: 4, matches: 27 },
            { name: "Lillestrøm", no: 5, matches: 27 },
            { name: "Vålerenga", no: 6, matches: 27 },
            { name: "Sarpsborg 08", no: 7, matches: 27 },
            { name: "Stabæk", no: 8, matches: 27 },
            { name: "Start", no: 9, matches: 27 },
            { name: "Viking", no: 10, matches: 27 },
            { name: "Aalesund", no: 11, matches: 27 },
            { name: "Haugesund", no: 12, matches: 27 },
            { name: "Bodø/Glimt", no: 13, matches: 27 },
            { name: "Sogndal", no: 14, matches: 27 },
            { name: "Brann", no: 15, matches: 27 },
            { name: "Sandnes Ulf", no: 16, matches: 27 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 28 },
            { name: "Tromsø", no: 2, matches: 27 },
            { name: "Kristiansund BK", no: 3, matches: 28 },
            { name: "Fredrikstad", no: 4, matches: 28 },
            { name: "Mjøndalen", no: 5, matches: 28 },
            { name: "Ranheim", no: 6, matches: 28 },
            { name: "Bærum", no: 7, matches: 28 },
            { name: "Hødd", no: 8, matches: 28 },
            { name: "Bryne", no: 9, matches: 28 },
            { name: "Strømmen", no: 10, matches: 28 },
            { name: "Hønefoss", no: 11, matches: 28 },
            { name: "Nest-Sotra", no: 12, matches: 28 },
            { name: "Alta", no: 13, matches: 28 },
            { name: "Tromsdalen", no: 14, matches: 28 },
            { name: "Ullensaker/Kisa", no: 15, matches: 28 },
            { name: "HamKam", no: 16, matches: 28 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd"
        ]
    },


    _dataForRound2014028 = exports.round2014028 = {
        year: 2014,
        round: 28,
        date: "2014-10-26",
        tippeliga: [
            { name: "Molde", no: 1, matches: 28 },
            { name: "Odd", no: 2, matches: 28 },
            { name: "Rosenborg", no: 3, matches: 28 },
            { name: "Strømsgodset", no: 4, matches: 28 },
            { name: "Lillestrøm", no: 5, matches: 28 },
            { name: "Vålerenga", no: 6, matches: 28 },
            { name: "Sarpsborg 08", no: 7, matches: 28 },
            { name: "Stabæk", no: 8, matches: 28 },
            { name: "Aalesund", no: 9, matches: 28 },
            { name: "Start", no: 10, matches: 28 },
            { name: "Viking", no: 11, matches: 28 },
            { name: "Haugesund", no: 12, matches: 28 },
            { name: "Bodø/Glimt", no: 13, matches: 28 },
            { name: "Sogndal", no: 14, matches: 28 },
            { name: "Brann", no: 15, matches: 28 },
            { name: "Sandnes Ulf", no: 16, matches: 28 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 29 },
            { name: "Tromsø", no: 2, matches: 29 },
            { name: "Mjøndalen", no: 3, matches: 29 },
            { name: "Kristiansund BK", no: 4, matches: 29 },
            { name: "Fredrikstad", no: 5, matches: 29 },
            { name: "Bærum", no: 6, matches: 29 },
            { name: "Ranheim", no: 7, matches: 29 },
            { name: "Hødd", no: 8, matches: 29 },
            { name: "Bryne", no: 9, matches: 29 },
            { name: "Strømmen", no: 10, matches: 29 },
            { name: "Hønefoss", no: 11, matches: 29 },
            { name: "Nest-Sotra", no: 12, matches: 29 },
            { name: "Alta", no: 13, matches: 29 },
            { name: "Tromsdalen", no: 14, matches: 29 },
            { name: "Ullensaker/Kisa", no: 15, matches: 29 },
            { name: "HamKam", no: 16, matches: 29 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd"
        ]
    },


    _dataForRound2014029 = exports.round2014029 = {
        year: 2014,
        round: 29,
        date: "2014-11-02",
        tippeliga: [
            { name: "Molde", no: 1, matches: 29 },
            { name: "Odd", no: 2, matches: 29 },
            { name: "Rosenborg", no: 3, matches: 29 },
            { name: "Strømsgodset", no: 4, matches: 29 },
            { name: "Lillestrøm", no: 5, matches: 29 },
            { name: "Vålerenga", no: 6, matches: 29 },
            { name: "Aalesund", no: 7, matches: 29 },
            { name: "Sarpsborg 08", no: 8, matches: 29 },
            { name: "Viking", no: 9, matches: 29 },
            { name: "Haugesund", no: 10, matches: 29 },
            { name: "Stabæk", no: 11, matches: 29 },
            { name: "Start", no: 12, matches: 29 },
            { name: "Bodø/Glimt", no: 13, matches: 29 },
            { name: "Brann", no: 14, matches: 29 },
            { name: "Sogndal", no: 15, matches: 29 },
            { name: "Sandnes Ulf", no: 16, matches: 29 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 30 },
            { name: "Tromsø", no: 2, matches: 30 },
            { name: "Mjøndalen", no: 3, matches: 30 },
            { name: "Kristiansund BK", no: 4, matches: 30 },
            { name: "Bærum", no: 5, matches: 30 },
            { name: "Fredrikstad", no: 6, matches: 30 },
            { name: "Ranheim", no: 7, matches: 30 },
            { name: "Hødd", no: 8, matches: 30 },
            { name: "Bryne", no: 9, matches: 30 },
            { name: "Strømmen", no: 10, matches: 30 },
            { name: "Hønefoss", no: 11, matches: 30 },
            { name: "Nest-Sotra", no: 12, matches: 30 },
            { name: "Alta", no: 13, matches: 30 },
            { name: "Tromsdalen", no: 14, matches: 30 },
            { name: "Ullensaker/Kisa", no: 15, matches: 30 },
            { name: "HamKam", no: 16, matches: 30 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd"
        ]
    },


    _dataForRound2014030 = exports.round2014030 = {
        year: 2014,
        round: 30,
        date: "2014-11-09",
        tippeliga: [
            { name: "Molde", no: 1, matches: 30 },
            { name: "Rosenborg", no: 2, matches: 30 },
            { name: "Odd", no: 3, matches: 30 },
            { name: "Strømsgodset", no: 4, matches: 30 },
            { name: "Lillestrøm", no: 5, matches: 30 },
            { name: "Vålerenga", no: 6, matches: 30 },
            { name: "Aalesund", no: 7, matches: 30 },
            { name: "Sarpsborg 08", no: 8, matches: 30 },
            { name: "Stabæk", no: 9, matches: 30 },
            { name: "Viking", no: 10, matches: 30 },
            { name: "Haugesund", no: 11, matches: 30 },
            { name: "Start", no: 12, matches: 30 },
            { name: "Bodø/Glimt", no: 13, matches: 30 },
            { name: "Brann", no: 14, matches: 30 },
            { name: "Sogndal", no: 15, matches: 30 },
            { name: "Sandnes Ulf", no: 16, matches: 30 }
        ],
        toppscorer: [
            "Vidar Örn Kjartansson"
        ],
        adeccoliga: [
            { name: "Sandefjord", no: 2, matches: 30 },
            { name: "Tromsø", no: 2, matches: 30 },
            { name: "Mjøndalen", no: 3, matches: 30 },
            { name: "Kristiansund BK", no: 4, matches: 30 },
            { name: "Bærum", no: 5, matches: 30 },
            { name: "Fredrikstad", no: 6, matches: 30 },
            { name: "Ranheim", no: 7, matches: 30 },
            { name: "Hødd", no: 8, matches: 30 },
            { name: "Bryne", no: 9, matches: 30 },
            { name: "Strømmen", no: 10, matches: 30 },
            { name: "Hønefoss", no: 11, matches: 30 },
            { name: "Nest-Sotra", no: 12, matches: 30 },
            { name: "Alta", no: 13, matches: 30 },
            { name: "Tromsdalen", no: 14, matches: 30 },
            { name: "Ullensaker/Kisa", no: 15, matches: 30 },
            { name: "HamKam", no: 16, matches: 30 }
        ],
        remainingCupContenders: [
            "Molde",
            "Odd"
        ]
    };
