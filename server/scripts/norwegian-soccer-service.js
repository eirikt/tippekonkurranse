/* global require: false, exports: false */

// Module dependencies, external
var __ = require("underscore"),
    cheerio = require("cheerio"),
    RQ = require("./vendor/rq").RQ,

// Module dependencies, local generic
    rq = require("./rq-fun"),

// Module dependencies, local application-specific
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
            rq.get(currentTippeligaTableUrl),
            rq.then(parseTippeligaTable)
        ]),

    _getCurrentAdeccoligaTableRequestory = exports.getCurrentAdeccoligaTable =
        RQ.sequence([
            rq.get(currentAdeccoligaTableUrl),
            rq.then(parseAdeccoligaTable)
        ]),

    _getCurrentTippeligaTopScorerRequestory = exports.getCurrentTippeligaTopScorer =
        RQ.sequence([
            rq.get(currentTippeligaToppscorerTableUrl),
            rq.then(parseTippeligaTopScorerTable)
        ]),

    _getCurrentRemainingCupContenders = exports.getCurrentRemainingCupContenders =
        rq.return([ "Molde" ]);
// /Requestories
