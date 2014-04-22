/* global require:false, exports:false */
/* jshint -W083 */
/* jshint -W089 */

// Module dependencies, external
var __ = require("underscore"),
    curry = require("curry"),
    promise = require("promised-io/promise"),
    all = promise.all,
    seq = promise.seq,

// Module dependencies, local
    RQ = require("./vendor/rq.js").RQ,
    dbSchema = require("./db-schema.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    utils = require("./utils.js"),
    asyncExecution = utils.rqAsyncExecution,
    go = utils.rqGo,
    sharedModels = require("./../../shared/scripts/app.models.js"),


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
        function (currentTippeligaTable, currentTippeligaTopscorer, currentAdeccoligaTable, currentRemainingCupContenders, year, round, currentRoundCount, mongoDbErr, storedTippeligaRound) {
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
                    if (currentRoundCount < dbCount) {
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
    _getTippekonkurranseScores = function (resultArray, requestion) {
        "use strict";
        var currentTippeligaTable = resultArray[0],
            currentTippeligaToppscorer = resultArray[1],
            currentAdeccoligaTable = resultArray[2],
            currentRemainingCupContenders = resultArray[3],

            currentMatchesCount = __.groupBy(currentTippeligaTable, "matches"),
            allMatchRoundsPresentInCurrentTippeligaTable = __.keys(currentMatchesCount),
            currentRound = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable),

            scores = _updateScores(
                predictions2014,
                currentTippeligaTable, currentTippeligaToppscorer, currentAdeccoligaTable, currentRemainingCupContenders);

        return requestion({
            currentMatchesCount: currentMatchesCount,
            currentRound: currentRound,
            scores: scores,
            currentTippeligaTable: currentTippeligaTable,
            currentTippeligaToppscorer: currentTippeligaToppscorer,
            currentAdeccoligaTable: currentAdeccoligaTable,
            currentRemainingCupContenders: currentRemainingCupContenders
        }, undefined);
    },


// TODO: spec/test this one!
    _addPreviousMatchRoundSumToEachParticipant = function (requestion, arg) {
        "use strict";
        var year = new Date().getFullYear(),
            currentStanding = {};

        dbSchema.TippeligaRound.findOne({
                year: year,
                round: (arg.currentRound - 1) }
        ).exec(
            function (err, previousTippeligaRound) {
                var previousRoundScores = _updateScores(
                    predictions2014,
                    previousTippeligaRound.tippeliga, previousTippeligaRound.toppscorer, previousTippeligaRound.adeccoliga, previousTippeligaRound.remainingCupContenders);
                for (var participant in arg.scores) {
                    if (arg.scores.hasOwnProperty(participant)) {
                        arg.scores[participant].previousSum = previousRoundScores[participant].sum;
                    }
                }
                currentStanding.scores = arg.scores;

                // Adding Tippeliga round meta data to scores
                currentStanding.metadata = { year: year, round: arg.currentRound };

                return requestion({
                    currentMatchesCount: arg.currentMatchesCount,
                    currentStanding: currentStanding,
                    currentTippeligaTable: arg.currentTippeligaTable,
                    currentTippeligaToppscorer: arg.currentTippeligaToppscorer,
                    currentAdeccoligaTable: arg.currentAdeccoligaTable,
                    currentRemainingCupContenders: arg.currentRemainingCupContenders
                });
            });
    },


// TODO: spec/test this one!
    _dispatchToClientForPresentation = function (response, requestion, arg) {
        "use strict";
        response.send(JSON.stringify(arg.currentStanding));
        return requestion({
            currentMatchesCount: arg.currentMatchesCount,
            currentTippeligaTable: arg.currentTippeligaTable,
            currentTippeligaToppscorer: arg.currentTippeligaToppscorer,
            currentAdeccoligaTable: arg.currentAdeccoligaTable,
            currentRemainingCupContenders: arg.currentRemainingCupContenders
        });
    },


// TODO: spec/test this one!
    _storeTippeligaRoundMatchData = function (requestion, arg) {
        "use strict";
        var currentMatchesCount = arg.currentMatchesCount,
            currentTippeligaTable = arg.currentTippeligaTable,
            currentTippeligaToppscorer = arg.currentTippeligaToppscorer,
            currentAdeccoligaTable = arg.currentAdeccoligaTable,
            currentRemainingCupContenders = arg.currentRemainingCupContenders,

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
        }
        return requestion();
    },


    /**
     * Retrieval of Tippeliga data.
     * Parallel execution of functions.
     * @private
     */
    _getTippeligaData = function () {
        "use strict";

        // TODO:
        /* Get data from db - dev setting - rq.js
         var getTippeligaRoundFromDb = function (requestion, year, round) {
         dbSchema.TippeligaRound.findOne({ year: year, round: round }).exec(
         function (err, tippeligaRound) {
         if (err) {
         return requestion, undefined, err);
         }
         return requestion([
         tippeligaRound.tippeliga,
         tippeligaRound.toppscorer,
         tippeligaRound.adeccoliga,
         tippeligaRound.remainingCupContenders
         ]);
         });
         },
         getTippeligaRoundFromDbCurried = curry(//getTippeligaDataAsync = new utils.PromisedIoAsyncExecutor(getTippeligaRoundFromDb);

         console.warn(utils.logPreamble() + "NB! Local/Development Tippeliga data source in use"));
         return getTippeligaDataAsync.exec(2014, 3);
         */

        /* Get data from db - dev setting - Promised-IO
         var getTippeligaRoundFromDb = function (success, failure, year, round) {
         dbSchema.TippeligaRound.findOne({ year: year, round: round }).exec(
         function (err, tippeligaRound) {
         if (err) {
         return failure(err);
         }
         return success([
         tippeligaRound.tippeliga,
         tippeligaRound.toppscorer,
         tippeligaRound.adeccoliga,
         tippeligaRound.remainingCupContenders
         ]);
         });
         },
         getTippeligaDataAsync = new utils.PromisedIoAsyncExecutor(getTippeligaRoundFromDb);

         console.warn(utils.logPreamble() + "NB! Local/Development Tippeliga data source in use");
         return getTippeligaDataAsync.exec(2014, 3);
         */

        /* Production version - screen scraping routines in parallel */
        return all(
            norwegianSoccerLeagueService.getCurrentTippeligaTable(),
            norwegianSoccerLeagueService.getCurrentTippeligaToppscorer(),
            norwegianSoccerLeagueService.getCurrentAdeccoligaTable(),
            norwegianSoccerLeagueService.getCurrentRemainingCupContenders()
        );
        // TODO: Replace with RQ.js
        //RQ.parallel([
        //    asyncExecution(norwegianSoccerLeagueService.getCurrentTippeligaTable),
        //    asyncExecution(norwegianSoccerLeagueService.getCurrentTippeligaToppscorer),
        //    asyncExecution(norwegianSoccerLeagueService.getCurrentAdeccoligaTable),
        //    asyncExecution(norwegianSoccerLeagueService.getCurrentRemainingCupContenders)
        //])(go);
    },


    /**
     * Handling of retrieved Tippeliga data.
     * Strict sequential execution of functions.
     * @private
     */
    _handleTippeligaData = function (request, response, tippeligaData) {
        "use strict";
        var
        // Function initializations
            getTippekonkurranseScoresCurried = curry(_getTippekonkurranseScores)(tippeligaData),
            dispatchToClientForPresentationCurried = curry(_dispatchToClientForPresentation)(response);

        RQ.sequence([
            asyncExecution(getTippekonkurranseScoresCurried),
            asyncExecution(_addPreviousMatchRoundSumToEachParticipant),
            asyncExecution(dispatchToClientForPresentationCurried),
            asyncExecution(_storeTippeligaRoundMatchData)
        ])(go);
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
            // TODO: Replace with RQ.js
            //var getTippeligaData = asyncExecution(_getTippeligaData),
            //    handleTippeligaData = asyncExecution(curry(_handleTippeligaData)(request)(response));
            //RQ.sequence([getTippeligaData, handleTippeligaData])(go);
        };
