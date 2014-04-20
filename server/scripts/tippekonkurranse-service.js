/* global require:false, exports:false, RQ:false */
/* jshint -W083 */
/* jshint -W089 */

// Module dependencies, external
var __ = require("underscore"),
    curry = require("curry"),
    promise = require("promised-io/promise"),
    all = promise.all,
    seq = promise.seq,

// Module dependencies, local
    dbSchema = require("./db-schema.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    utils = require("./utils.js"),
    sharedModels = require("./../../shared/scripts/app.models.js"),

// TODO: ...
//RQ = require("./vendor/rq.js"),


////////////////////////////////////////
// Private  functions
////////////////////////////////////////

// Below, "score" should be read as "penalty point", that's more accurate ...

// TODO: spec/test/document this one?
    _getTableScore = function (predictedTeamPlacing, actualTeamPlacing) {
        "use strict";
        return Math.abs(predictedTeamPlacing - actualTeamPlacing);
    },

// TODO: spec/test/document this one?
    _getPallScore = function (predictedTeamPlacing, actualTeamPlacing) {
        "use strict";
        var pallPenaltyPoints = 0;
        if (predictedTeamPlacing === 1 && predictedTeamPlacing === actualTeamPlacing) {
            pallPenaltyPoints += -1;
        }
        if (predictedTeamPlacing === 2 && predictedTeamPlacing === actualTeamPlacing) {
            pallPenaltyPoints += -1;
        }
        if (predictedTeamPlacing === 3 && predictedTeamPlacing === actualTeamPlacing) {
            pallPenaltyPoints += -1;
        }
        return pallPenaltyPoints;
    },

// TODO: spec/test/document this one?
    _getExtraPallScore = function (predictedTeamPlacing, currentPallScore) {
        "use strict";
        return predictedTeamPlacing === 4 && currentPallScore === -3 ? -1 : 0;
    },

// TODO: spec/test/document this one?
    _getGroupScore = function (fromPlace, predictedTeamPlacing, actualTeamPlacing, currentGroupScore) {
        "use strict";
        if (predictedTeamPlacing === fromPlace && (predictedTeamPlacing === actualTeamPlacing || actualTeamPlacing === (fromPlace + 1))) {
            return -1;
        }
        if (predictedTeamPlacing === (fromPlace + 1)) {
            if (currentGroupScore === 0) {
                return 0;
            }
            if (predictedTeamPlacing === actualTeamPlacing || actualTeamPlacing === fromPlace) {
                return 0;
            } else {
                // Revoke given bonus (minus) point
                return 1;
            }
        }
        return 0;
    },

    _getNedrykkScore = curry(_getGroupScore)(15),

    _getOpprykkScore = curry(_getGroupScore)(1),

    /**
     * Exported with underscore prefix as it is exported for specification/testing purposes only ...
     * @private
     */
    _updateScores = exports._updateScores =
        function (predictions2014, currentTippeligaTable, currentTippeligaTopscorer, currentAdeccoligaTable, currentRemainingCupContenders) {
            "use strict";

            // Create associative array with team name as key, by extracting 'name'
            // => a team-name-indexed data structure, optimized for point calculations
            var indexedTippeligaTable = __.indexBy(currentTippeligaTable, "name"),
                indexedAdeccoligaTable = __.indexBy(currentAdeccoligaTable, "name"),
                currentStanding = {};

            for (var participant in predictions2014) {
                var tabellScore = 0,
                    pallScore = 0,
                    nedrykkScore = 0,
                    opprykkScore = 0,
                    toppscorerScore = 0,
                    cupScore = 0,
                    sum = 0,

                    participantObj = predictions2014[participant];

                if (participantObj) {
                    __.each(participantObj.tabell, function (teamName, index) {
                        var predictedTeamPlacing = index + 1,
                            actualTeamPlacing = indexedTippeligaTable[teamName].no;

                        // Tabell
                        tabellScore += _getTableScore(predictedTeamPlacing, actualTeamPlacing);

                        // Pall
                        pallScore += _getPallScore(predictedTeamPlacing, actualTeamPlacing);
                        pallScore += _getExtraPallScore(predictedTeamPlacing, pallScore);

                        // Nedrykk
                        nedrykkScore += _getNedrykkScore(predictedTeamPlacing, actualTeamPlacing, nedrykkScore);
                    });

                    // Toppscorer
                    __.each(participantObj.toppscorer, function (toppscorer, index) {
                        if (index === 0 && __.contains(currentTippeligaTopscorer, toppscorer)) {
                            toppscorerScore = -1;
                        }
                    });

                    // Opprykk
                    __.each(participantObj.opprykk, function (teamName, index) {
                        var predictedTeamPlacing = index + 1,
                            actualTeamPlacing = indexedAdeccoligaTable[teamName].no;

                        opprykkScore += _getOpprykkScore(predictedTeamPlacing, actualTeamPlacing, opprykkScore);
                    });

                    // Cup
                    __.each(participantObj.cup, function (team, index) {
                        if (index === 0 && __.contains(currentRemainingCupContenders, team)) {
                            cupScore = -1;
                        }
                    });

                    // Sum
                    sum = tabellScore + pallScore + nedrykkScore + toppscorerScore + opprykkScore + cupScore;
                }
                currentStanding[participant] =
                    sharedModels.scoreModel.properties(sum, tabellScore, pallScore, nedrykkScore, toppscorerScore, opprykkScore, cupScore);
            }
            return currentStanding;
        },

// TODO: spec/test this one!
    /**
     * Conditionally storing/updating of match round results in MongoDB.
     * This function should be curried, MongoDB callback arguments being the two last ones ...
     * Exported with underscore prefix as it is exported for specification/testing purposes only ...
     * @private
     */
    _storeTippeligaRound = exports._storeTippeligaRound =
        function (currentTippeligaTable, currentAdeccoligaTable, currentTippeligaTopscorer, currentRemainingCupContenders, year, round, currentRoundCount, mongoDbErr, storedTippeligaRound) {
            "use strict";
            var method = null,
                tippeligaResults,
                dbMatchesCount,
                dbCount,
                logMsg = utils.logPreamble() + "Tippeliga " + year + " round #" + round;

            if (!storedTippeligaRound) {
                method = "CREATE";
                logMsg += " is not yet stored";

            } else {
                tippeligaResults = storedTippeligaRound.tippeliga;
                dbMatchesCount = __.groupBy(tippeligaResults, "matches");

                if (!dbMatchesCount[round]) {
                    method = "CREATE";
                    logMsg += " is not yet stored";

                } else {
                    dbCount = dbMatchesCount[round].length;
                    if (dbCount >= 16) {
                        logMsg += " already stored with " + dbCount + " teams - completed";
                        console.log(logMsg + " => no need for updating db with new results");

                    } else if (currentRoundCount < dbCount) {
                        logMsg += " already stored with " + dbCount + " teams - current data has " + currentRoundCount + " teams";
                        console.log(logMsg + " => no need for updating db with new results");

                    } else {
                        method = "UPDATE";
                        logMsg += " already stored with " + dbCount + " teams - current data has " + currentRoundCount + " teams";
                    }
                }
            }
            if (method) {
                dbSchema.TippeligaRound.update(
                    { year: year, round: parseInt(round, 10) },
                    { tippeliga: currentTippeligaTable, toppscorer: currentTippeligaTopscorer, adeccoliga: currentAdeccoligaTable, remainingCupContenders: currentRemainingCupContenders },
                    { upsert: true, multi: false },
                    function () {
                        console.log(logMsg + ", " + currentRoundCount + " matches saved... OK");
                    }
                );
            }
        },

// TODO: spec/test this one!
    /**
     *
     * @returns {*}
     * @private
     */
    _getTippekonkurranseScores = function () {
        "use strict";
        var dfd = new promise.Deferred(),

            args = __.toArray(arguments)[0],
            resultArray = args.resultArray,
            currentTippeligaTable = resultArray[0],
            currentTippeligaToppscorer = resultArray[1],
            currentAdeccoligaTable = resultArray[2],
            currentRemainingCupContenders = resultArray[3],

            currentMatchesCount = __.groupBy(currentTippeligaTable, "matches"),
            allMatchRoundsPresentInCurrentTippeligaTable = __.keys(currentMatchesCount),
            currentRound = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable),

            scores = _updateScores(
                predictions2014,
                currentTippeligaTable, currentTippeligaToppscorer, currentAdeccoligaTable, currentRemainingCupContenders);

        dfd.resolve({
            currentMatchesCount: currentMatchesCount,
            currentRound: currentRound,
            scores: scores,
            currentTippeligaTable: currentTippeligaTable,
            currentTippeligaToppscorer: currentTippeligaToppscorer,
            currentAdeccoligaTable: currentAdeccoligaTable,
            currentRemainingCupContenders: currentRemainingCupContenders
        });
        return dfd.promise;
    },

// TODO: spec/test this one!
    _addPreviousMatchRoundSumToEachParticipant = function () {
        "use strict";
        var dfd = new promise.Deferred(),

            args = __.toArray(arguments)[0],
            currentMatchesCount = args.currentMatchesCount,
            currentRound = args.currentRound,
            scores = args.scores,
            currentAdeccoligaTable = args.currentAdeccoligaTable,
            currentTippeligaTable = args.currentTippeligaTable,
            currentTippeligaToppscorer = args.currentTippeligaToppscorer,
            currentRemainingCupContenders = args.currentRemainingCupContenders,

            year = new Date().getFullYear(),
            currentStanding = {};

        dbSchema.TippeligaRound.findOne({
                year: year,
                round: (currentRound - 1) }
        ).exec(
            function (err, previousTippeligaRound) {
                var previousRoundScores = _updateScores(
                    predictions2014,
                    previousTippeligaRound.tippeliga, previousTippeligaRound.toppscorer, previousTippeligaRound.adeccoliga, previousTippeligaRound.remainingCupContenders);
                for (var participant in scores) {
                    if (scores.hasOwnProperty(participant)) {
                        scores[participant].previousSum = previousRoundScores[participant].sum;
                    }
                }
                currentStanding.scores = scores;

                // Adding Tippeliga round meta data to scores
                currentStanding.metadata = { year: year, round: currentRound };

                dfd.resolve({
                    currentMatchesCount: currentMatchesCount,
                    currentStanding: currentStanding,
                    currentTippeligaTable: currentTippeligaTable,
                    currentTippeligaToppscorer: currentTippeligaToppscorer,
                    currentAdeccoligaTable: currentAdeccoligaTable,
                    currentRemainingCupContenders: currentRemainingCupContenders
                });
            });
        return dfd.promise;
    },

// TODO: spec/test this one!
    _dispatchToClientForPresentation = function () {
        "use strict";
        var dfd = new promise.Deferred(),

            response = __.toArray(arguments)[0],
            args = __.toArray(arguments)[1],
            currentMatchesCount = args.currentMatchesCount,
            currentStanding = args.currentStanding,
            currentTippeligaTable = args.currentTippeligaTable,
            currentTippeligaToppscorer = args.currentTippeligaToppscorer,
            currentAdeccoligaTable = args.currentAdeccoligaTable,
            currentRemainingCupContenders = args.currentRemainingCupContenders;

        response.send(JSON.stringify(currentStanding));

        dfd.resolve({
            currentMatchesCount: currentMatchesCount,
            currentTippeligaTable: currentTippeligaTable,
            currentTippeligaToppscorer: currentTippeligaToppscorer,
            currentAdeccoligaTable: currentAdeccoligaTable,
            currentRemainingCupContenders: currentRemainingCupContenders
        });
        return dfd.promise;
    },

// TODO: spec/test this one!
    _storeTippeligaRoundMatchData = function () {
        "use strict";
        var dfd = new promise.Deferred(),

            args = __.toArray(arguments)[0],
            currentMatchesCount = args.currentMatchesCount,
            currentTippeligaTable = args.currentTippeligaTable,
            currentTippeligaToppscorer = args.currentTippeligaToppscorer,
            currentAdeccoligaTable = args.currentAdeccoligaTable,
            currentRemainingCupContenders = args.currentRemainingCupContenders,

            year = new Date().getFullYear();

        for (var round in currentMatchesCount) {
            var roundNo = parseInt(round, 10),
                currentMatchCountInRound = currentMatchesCount[round].length,

            // TODO: Both works, what's the difference between them?
                conditionallyStoreTippeligaRound = curry(_storeTippeligaRound)(currentTippeligaTable)(currentTippeligaToppscorer)(currentAdeccoligaTable)(currentRemainingCupContenders)(year)(round)(currentMatchCountInRound);
            //conditionallyStoreTippeligaRound = __.partial(_storeTippeligaRound, currentTippeligaTable, currentTippeligaToppscorer, currentAdeccoligaTable, currentRemainingCupContenders, year, round, currentMatchCountInRound);

            dbSchema.TippeligaRound
                .findOne({ year: year, round: roundNo })
                .exec(conditionallyStoreTippeligaRound);

            dfd.resolve();
        }
        return dfd.promise;
    },

    /**
     * Retrieval of Tippeliga data.
     * Parallel execution of functions.
     * @private
     */
    _getTippeligaData = function () {
        "use strict";
        /* Get data from db - dev setting ...
         console.warn(utils.logPreamble() + "NB! Local/Development Tippeliga data source in use");
         var dfd = new promise.Deferred();
         dbSchema.TippeligaRound.findOne({ year: 2014, round: 3 }).exec(
         function (err, previousTippeligaRound) {
         dfd.resolve([
         previousTippeligaRound.tippeliga,
         previousTippeligaRound.toppscorer,
         previousTippeligaRound.adeccoliga,
         previousTippeligaRound.remainingCupContenders
         ]);
         });
         return dfd.promise;
         */
        return all(
            norwegianSoccerLeagueService.getCurrentTippeligaTable(),
            norwegianSoccerLeagueService.getCurrentTippeligaToppscorer(),
            norwegianSoccerLeagueService.getCurrentAdeccoligaTable(),
            norwegianSoccerLeagueService.getCurrentRemainingCupContenders()
        );
    },

    /**
     * Handling of retrieved Tippeliga data.
     * Strict sequential execution of functions.
     * @private
     */
    _handleTippeligaData = function () {
        "use strict";
        var
        // Function arguments handling
            args = __.toArray(arguments),
            request = args[0],
            response = args[1],
            resultArray = args[2],

        // Function preparations
            getTippekonkurranseScores = __.partial(_getTippekonkurranseScores, { resultArray: resultArray }),
            addPreviousMatchRoundSumToEachParticipant = _addPreviousMatchRoundSumToEachParticipant,

            dispatchDataToClientForPresentation = __.partial(_dispatchToClientForPresentation, response),
        // TODO: try with
        //dispatchDataToClientForPresentation = curry(_dispatchToClientForPresentation)(response),
        // What's the difference between them?

            dispatchDataToDbForStoring = _storeTippeligaRoundMatchData;

        // Sequential execution
        seq([
            getTippekonkurranseScores,
            addPreviousMatchRoundSumToEachParticipant,
            dispatchDataToClientForPresentation,
            dispatchDataToDbForStoring
        ]);
    },


////////////////////////////////////////
// Public functions
////////////////////////////////////////

    _handlePredictionsRequest = exports.handlePredictionsRequest =
        function (request, response) {
            "use strict";
            var userId = request.params.userId,
                predictions = predictions2014[userId];
            response.send(200, JSON.stringify(predictions));
        },

    _handleCurrentScoreRequest = exports.handleCurrentScoreRequest =
        function (request, response) {
            "use strict";
            var getTippeligaData = _getTippeligaData,
                handleTippeligaData = __.partial(_handleTippeligaData, request, response);

            getTippeligaData().then(handleTippeligaData);
        },

    _handleRqTest = exports.handleRqTest =
        function (request, response) {
            "use strict";
            response.send(200, "Not yet implemented");

            /* Take 1
             var wrap = function (func) {
             return function requestor(requestion, value) {
             console.log(func);
             console.log("Executing func(" + value + ")");
             return requestion(func(value));
             };
             };

             var eiriktorske = {
             firstname: "Eirik",
             lastname: "Torske"
             };
             var fullname = function (nameObj) {
             return nameObj.firstname + " " + nameObj.lastname;
             };
             var printFullname = function (nameObj) {
             return console.log(fullname(nameObj));
             };
             var fullnameBound = __.partial(printFullname, eiriktorske);
             var nameRequestor = wrap(fullnameBound);

             var now = function () {
             return Date.now;
             };
             //var nowRequestor = curry(identityRequestor1)(identityRequestor1, Date.now());
             var nowRequestor = wrap(now);

             var identityRequestor1 = function (requestion, value) {
             console.log("identityRequestor1: value=" + value);
             requestion(value);
             };
             var identityRequestor2 = function (requestion, value) {
             console.log("identityRequestor2: value=" + value);
             requestion(value);
             };

             var go = function (success, failure) {
             var i = 0;
             };

             RQ.RQ.sequence([
             identityRequestor1
             , identityRequestor2
             , nowRequestor
             , nameRequestor
             ])(go);
             */


            /* Take 2
             "use strict";
             var async = function (func) {
             return function requestor(requestion, value) {
             //console.log(func);
             //console.log("Executing func(" + value + ")");
             var success = func(value),
             failure = undefined;
             return requestion(success, failure);
             };
             };
             var identity = function (value) {
             console.log("identity(" + value + ")");
             return value;
             };
             //var eirikBound = __.partial(identity, "eirik");
             //var torskeBound = __.partial(identity, "torske");
             var eirikRequestor = async(__.partial(identity, "eirik"));
             var torskeRequestor = async(__.partial(identity, "torske"));

             var go = function (success, failure) {
             console.log("go(" + success + ", " + failure + ")");
             };

             RQ.RQ.sequence([eirikRequestor, torskeRequestor])(go);

             response.send(200);
             */
        };
