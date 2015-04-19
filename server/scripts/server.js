/* global root:false */

// Environment
var env = process.env.NODE_ENV || "development",
    dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/tippekonkurranse',

    applicationRootAbsolutePath = __dirname,
    productionWebRootRelativePath = "../../build",
    developmentWebRootRelativePath = "../../client",

// Module dependencies, external
    mongoose = require("mongoose"),
    __ = require("underscore"),
    ___ = require("scoreunder"),
    path = require("path"),
    express = require("express"),

// Module dependencies, local generic
    utils = require("./../../shared/scripts/utils"),
    comparators = require("./../../shared/scripts/comparators"),
    curry = require("./../../shared/scripts/fun").curry,

// Module dependencies, local application-specific
    dbSchema = require("./db-schema"),
    app = require("./../../shared/scripts/app.models"),
    TippekonkurranseData = app.TippekonkurranseData,
    tippekonkurranseApi = require("./tippekonkurranse-api"),
    tippekonkurranse = require("./tippekonkurranse"),

// The app server
    server = express(),
    port = Number(process.env.PORT || 5000);

// Connect to database via Mongoose
mongoose.connect(dbUrl);

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
server.get([app.resource.results.baseUri, app.resource.uri.element.current].join("/"), tippekonkurranseApi.handleResultsRequest);
server.get([app.resource.scores.baseUri, app.resource.uri.element.current].join("/"), tippekonkurranseApi.handleScoresRequest);


// Start HTTP server
server.listen(port, function () {
    "use strict";
    if (env === "development") {
        console.log(utils.logPreamble() + app.name + ", Node.js Express server listening on port %d in %s mode, root path:", port, env, path.join(applicationRootAbsolutePath, developmentWebRootRelativePath));
    } else {
        console.log(utils.logPreamble() + app.name + ", Node.js Express server listening on port %d in %s mode, root path:", port, env, path.join(applicationRootAbsolutePath, productionWebRootRelativePath));
    }
});


// Global state
root.app = {
    numberOfRounds: 30,                         // NB! To be set manually for now ...

    initialYear: 2014,                          // NB! To be set manually for now ...
    initialRound: 1,                            // NB! To be set manually for now ...
    //activeYear: null,                         // N/A (this kind of state => only on clients - designated there as 'year')
    //activeRound: null,                        // N/A (this kind of state => only on clients - designated there as 'round')
    currentYear: new Date().getFullYear(),
    currentRound: null,                         // Dynamically updated in 'tippekonkurranse.addRound' method

    isCurrentYearCompleted: false,              // NB! To be set manually for now ...

    // TODO: Rename to 'isActiveRound'
    isRoundActive: function (round, year) {
        "use strict";
        return parseInt(round, 10) === root.app.currentRound && parseInt(year, 10) === root.app.currentYear;
    },
    // TODO: Rename to 'isCompletedRound'
    isRoundCompleted: function (round, year) {
        "use strict";
        if (!round) {
            return false;
        }
        if (!year) {
            return round < root.app.currentRound ||
                (round <= root.app.currentRound && root.app.isCurrentYearCompleted);
        }
        return year < root.app.currentYear ||
            (year <= root.app.currentYear && round < root.app.currentRound) ||
            (year <= root.app.currentYear && round <= root.app.currentRound && root.app.isCurrentYearCompleted);
    }
};


// Cache
root.app.cache = {
    ratingHistory: {}
};


// Development tweaks ...
if (env === "development") {
    // Override live data retrieval with stored Tippeliga data => for statistics/history/development ...
    root.app.overrideTippeligaDataWithYear = root.app.currentYear;
    //root.app.overrideTippeligaDataWithRound = 2;
}


if (root.app.overrideTippeligaDataWithYear && (root.app.overrideTippeligaDataWithRound || root.app.overrideTippeligaDataWithRound === 0)) {
    root.app.currentRound = root.app.overrideTippeligaDataWithRound;
    console.log(utils.logPreamble() + app.name + ", Initialized with: current season " + root.app.currentYear + ", current round " + root.app.currentRound + " [DEVELOPMENT mode, using stored data]");

} else {
    dbSchema.TippeligaRound.findOne({ year: root.app.currentYear }).sort("-round").exec(function (err, latestTippeligaRound) {
        "use strict";
        if (err) {
            console.err(err);
            return;
        }
        if (!latestTippeligaRound) {
            console.warn(utils.logPreamble() + "No round found for season " + root.app.currentYear + " ... setting it to 0");
            root.app.currentRound = 0;
            return;
        }
        root.app.currentRound = latestTippeligaRound.round;
        console.log(utils.logPreamble() + app.name + " " + "Initialized with: current season " + root.app.currentYear + ", current round " + root.app.currentRound);

        dbSchema.TippeligaRound.count({ year: 2014 }, function (err, count) {
            console.log(utils.logPreamble() + app.name + " " + "2014 count: " + count);
        });

        dbSchema.TippeligaRound.count({ year: 2015 }, function (err, count) {
            console.log(utils.logPreamble() + app.name + " " + "2015 count: " + count);
        });
    });
}


// Warm up cache: Rating history for initial year/previous year/2014
// TODO: Cache all years, this year and all previous ones
/* No, this is not a good idea with single-dyno setup on Heroku - the node falls asleep and than this caching procedure starts all over again, making the response time unacceptable for all those "wake-up-the-dyno" requests
 dbSchema.TippeligaRound.count({ year: root.app.initialYear }, function (err, count) {
 "use strict";
 if (err) {
 console.error(utils.logPreamble() + "Tippeliga " + root.app.initialYear + " rounds count ERROR: " + err);
 return;
 }
 if (count < 1) {
 console.error(utils.logPreamble() + "Tippeliga " + root.app.initialYear + " has no rounds persisted ...");
 return;
 }
 console.log(utils.logPreamble() + "Warming up cache: Rating history for " + root.app.initialYear + ", round #1 - #" + count + " ...");
 var cache = root.app.cache.ratingHistory,
 key,
 tippekonkurranseData = new TippekonkurranseData(),
 data = {},
 sortByElementIndex = function (elementIndex, args) {
 return args.sort(comparators.ascendingByArrayElement(elementIndex));
 },
 sortByRound = curry(sortByElementIndex, tippekonkurranseData.indexOfRound),
 cacheTheResults,

 getMatchRoundRatingHistory,
 getTippekonkurranseScoresHistory,
 matchRoundIndex,
 roundIndex,
 lastRound,
 lastRoundCounter = count;

 console.log(utils.logPreamble() + "Caching: Rating history, starting ...");
 getMatchRoundRatingHistory = [];
 for (matchRoundIndex = 1; matchRoundIndex <= root.app.numberOfRounds; matchRoundIndex += 1) {
 lastRound = (count - matchRoundIndex + 1);
 key = root.app.initialYear.toString() + lastRound;
 cacheTheResults = curry(utils.memoizationWriter, false, cache, utils.always, key);
 getTippekonkurranseScoresHistory = [];

 console.log(utils.logPreamble() + "Caching: Adding job: Rating history for " + root.app.initialYear + ", round 1-" + lastRound + " ...");
 for (roundIndex = 1; roundIndex <= lastRound; roundIndex += 1) {
 getTippekonkurranseScoresHistory.push(
 RQ.sequence([
 curry(tippekonkurranse.getStoredTippeligaDataRequestor, root.app.initialYear, roundIndex),
 rq.requestor(tippekonkurranse.addGroupingOfTeamAndNumberOfMatchesPlayed),
 rq.requestor(tippekonkurranse.addRound),
 curry(tippekonkurranse.addTippekonkurranseScoresRequestor, tippekonkurranse.predictions[root.app.initialYear], tippekonkurranse.rules[root.app.initialYear])
 ])
 );
 }
 getMatchRoundRatingHistory.push(
 RQ.sequence([
 RQ.parallel(getTippekonkurranseScoresHistory),
 rq.then(sortByRound),
 function (requestion, args) {
 var userIdArray = Object.keys(args[0][tippekonkurranseData.indexOfScores].scores);
 __.each(userIdArray, function (userId, index) {
 data[userId] = { userId: userId, ratings: [] };
 if (index >= userIdArray.length - 1) {
 return requestion(args);
 }
 });
 },
 function (requestion, args) {
 __.each(args, function (completeTippekonkurranseRoundData) {
 __.each(completeTippekonkurranseRoundData[tippekonkurranseData.indexOfScores].scores, function (participantScores, userId) {
 data[userId].ratings.push(participantScores.rating);
 });
 });
 return requestion(data);
 },
 rq.then(___.partialFn(__.map, __.identity)),
 rq.then(cacheTheResults),
 rq.then(function () {
 console.log(utils.logPreamble() + "Caching: Rating history for " + root.app.initialYear + ", round 1-" + lastRoundCounter + " completed");
 lastRoundCounter -= 1;
 })
 ])
 );
 }

 RQ.sequence(getMatchRoundRatingHistory)(rq.execute);
 });
 */
