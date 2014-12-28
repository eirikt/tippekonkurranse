/* global root:false */
/* jshint -W024, -W083 */

// Environment
var env = process.env.NODE_ENV || "development",
    applicationRootAbsolutePath = __dirname,
    productionWebRootRelativePath = "../../build",
    developmentWebRootRelativePath = "../../client",

// Module dependencies, external
    __ = require("underscore"),
    ___ = require("scoreunder"),
    path = require("path"),
    express = require("express"),

// Module dependencies, local generic
    utils = require("./../../shared/scripts/utils"),
    comparators = require("./../../shared/scripts/comparators"),
    curry = require("./../../shared/scripts/fun").curry,
    RQ = require("./vendor/rq").RQ,
    rq = require("./rq-fun"),

// Module dependencies, local application-specific
    dbSchema = require("./db-schema"),
    initDb = require("./db-init"),
    app = require("./../../shared/scripts/app.models"),
    TeamPlacement = app.TeamPlacement,
    TippekonkurranseData = app.TippekonkurranseData,
    tippekonkurranseApi = require("./tippekonkurranse-api"),
    tippekonkurranse = require("./tippekonkurranse"),
    tippekonkurranse2014 = require("./tippekonkurranse-2014"),
    predictions2014 = require("./tippekonkurranse-2014-user-predictions").predictions2014,

// The app server
    server = express(),
    port = Number(process.env.PORT || 5000);


// Static resources (AppCache candidates) (files)
if (env === "development") {
    server.use(express.static(path.join(applicationRootAbsolutePath, developmentWebRootRelativePath)));
} else {
    server.use(express.static(path.join(applicationRootAbsolutePath, productionWebRootRelativePath)));
}


// Static resources (AppCache candidates) (RESTful service API) (Only JSON content type supported so far)
server.get(app.resource.predictions.uri, tippekonkurranseApi.handlePredictionsRequest);

// Semi-static resources (RESTful service API) (Only JSON content type supported so far)
// (AppCache candidates when knowledge regarding the finalization of the year/round is in place)
// (When the year/round is finalized/completed, the content become static from there and onwards)
server.get(app.resource.results.uri, tippekonkurranseApi.handleResultsRequest);
server.get(app.resource.scores.uri, tippekonkurranseApi.handleScoresRequest);
server.get(app.resource.ratingHistory.uri, tippekonkurranseApi.handleRatingHistoryRequest);

// Dynamic resources (RESTful service API) (Only JSON content type supported so far)
server.get([ app.resource.results.baseUri, app.resource.uri.element.current ].join("/"), tippekonkurranseApi.handleResultsRequest);
server.get([ app.resource.scores.baseUri, app.resource.uri.element.current ].join("/"), tippekonkurranseApi.handleScoresRequest);

// Start HTTP server
server.listen(port, function () {
    "use strict";
    console.log(utils.logPreamble() + app.name + ", Node.js Express server listening on port %d in %s mode", port, env);
});


// Global state
root.app = {
    numberOfRounds: 30,
    currentYear: 2014,                  // NB! To be set manually for now ...
    currentRound: null,
    isCurrentYearCompleted: true,       // NB! To be set manually for now ...
    //isCurrentRoundCompleted = false,

    isCompletedRound: function (round) {
        "use strict";
        console.log(utils.logPreamble() + "isCompletedRound(round=" + round + ", root.app.currentRound=" + root.app.currentRound + ", root.app.isCurrentYearCompleted=" + root.app.isCurrentYearCompleted + ")");
        return round < root.app.currentRound || round === root.app.currentRound && root.app.isCurrentYearCompleted;
    }
};


// Cache
root.app.cache = {
    ratingHistory: {}
};


// Find current round, and warm up

/**
 * TODO: This did not work out quite well, did it ...
 *
 * The function arity rules:
 * If length of function arguments (f.length) is
 *   0: just add the function
 *   1: wrap it as a requestor
 *   2: ...
 *   3: curry it with round/'numberOfSequences', and then wrap it as a requestor
 *   4: curry it with year and round/'numberOfSequences', and then wrap it as a requestor
 *   5: n/a
 *
 * @see http://stackoverflow.com/questions/4138012/checks-how-many-arguments-a-function-takes-in-javascript
 * @see https://github.com/fitzgen/wu.js/issues/16
 */
root.app.buildSequencesOf = function (requestorArray, numberOfSequences) {
    "use strict";
    var requestorSequences = [],
        roundIndex = 1,
        curriedRequestorArray;

    for (; roundIndex <= numberOfSequences; roundIndex += 1) {
        curriedRequestorArray = [];
        requestorArray.forEach(function (fn) {
            switch (fn.length) {
                case 0:
                    curriedRequestorArray.push(fn);
                    break;
                case 1:
                    curriedRequestorArray.push(rq.requestor(fn));
                    break;
                case 2:
                    throw new Error("2 arguments is not yet applicable to 'buildSequencesOf' function ...");
                case 3:
                    curriedRequestorArray.push(curry(fn, roundIndex));
                    break;
                case 4:
                    curriedRequestorArray.push(curry(fn, root.app.currentYear, roundIndex));
                    break;
                default:
                    throw new Error("More than 4 arguments is not supported by 'buildSequencesOf' function");
            }
        });
        requestorSequences.push(RQ.sequence(curriedRequestorArray));
    }
    return requestorSequences;
};

// TODO: Cache all years, this year and all previous ones
dbSchema.TippeligaRound.count({ year: root.app.currentYear }, function (err, count) {
    "use strict";
    if (err) {
        console.error(utils.logPreamble() + "Tippeliga " + root.app.currentYear + " rounds count ERROR: " + err);
        return;
    }
    root.app.currentRound = count;
    if (count < 1) {
        console.error(utils.logPreamble() + "Tippeliga " + root.app.currentYear + " has no rounds persisted ...");
        return;
    }
    console.log(utils.logPreamble() + "Tippeliga " + root.app.currentYear + " round " + count + " (read from db)");
    //console.log(utils.logPreamble() + "Warming up cache with round [1-" + count + "] ...");
    var cache = root.app.cache.ratingHistory,
        key = root.app.currentYear.toString() + count,
        tippekonkurranseData = new TippekonkurranseData(),
        data = {},
        sortByElementIndex = function (elementIndex, args) {

            return args.sort(comparators.ascendingByArrayElement(elementIndex));
        },
        sortByRound = curry(sortByElementIndex, tippekonkurranseData.indexOfRound),
        memoizeWrite = curry(utils.memoizationWriter, cache, utils.always, key);

    // TODO: Consider caching all rounds 1-30, 1-29, 1-28 e.t.c. (not only 1-30) - by slicing the 'getTippekonkurranseScoresHistory' requestor

    RQ.sequence([
        RQ.parallel(root.app.buildSequencesOf([
            tippekonkurranse.getStoredTippeligaDataRequestor,
            tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping,
            tippekonkurranse.addRound,
            tippekonkurranse2014.addTippekonkurranseScores2014
        ], count)),
        rq.then(sortByRound),
        function (requestion, args) {
            var userIdArray = Object.keys(args[ 0 ][ tippekonkurranseData.indexOfScores ].scores);
            __.each(userIdArray, function (userId, index) {
                data[ userId ] = { userId: userId, ratings: [] };
                if (index >= userIdArray.length - 1) {
                    return requestion(args);
                }
            });
        },
        function (requestion, args) {
            __.each(args, function (completeTippekonkurranseRoundData) {
                __.each(completeTippekonkurranseRoundData[ tippekonkurranseData.indexOfScores ].scores, function (participantScores, userId) {
                    data[ userId ].ratings.push(participantScores.rating);
                });
            });
            return requestion(data);
        },
        rq.then(___.partialFn(__.map, __.identity)),
        rq.then(memoizeWrite),
        rq.then(function () {
            console.log(utils.logPreamble() + "Caching rating history completed ...");
        })
    ])(rq.execute);
});


// Development tweaks ...
if (env === "development") {
    // Override live data retrieval with stored Tippeliga data => for statistics/history/development ...
    root.overrideTippeligaDataWithYear = 2014;
    root.overrideTippeligaDataWithRound = 30;
}
