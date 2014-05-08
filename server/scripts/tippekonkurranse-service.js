/* global root:false, require:false, exports:false */
/* jshint -W083 */
/* jshint -W089 */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
    curry = require("curry"),

// Module dependencies, local
    RQ = require("./vendor/rq.js").RQ,
    dbSchema = require("./db-schema.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    utils = require("./utils.js"),
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


// TODO: reduce cyclic complexity (from 7 to 5)
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
     * This function is exported with underscore prefix as it is exported for specification/testing purposes only ...
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
                        // TODO: No need for saving if round is a historic one (this round < latest stored round)
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
    _getTippekonkurranseScores = function (requestion, arg) {
        "use strict";
        var currentTippeligaTable = arg[0],
            currentTippeligaToppscorer = arg[1],
            currentAdeccoligaTable = arg[2],
            currentRemainingCupContenders = arg[3],

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
        });
    },


// TODO: spec/test this one!
    _addPreviousMatchRoundSumToEachParticipant = function (requestion, arg) {
        "use strict";
        var year = new Date().getFullYear(),
            currentStanding = {};

        /*
         if (arg.currentRound <= 1) {
         return requestion({
         currentMatchesCount: arg.currentMatchesCount,
         currentStanding: currentStanding,
         currentTippeligaTable: arg.currentTippeligaTable,
         currentTippeligaToppscorer: arg.currentTippeligaToppscorer,
         currentAdeccoligaTable: arg.currentAdeccoligaTable,
         currentRemainingCupContenders: arg.currentRemainingCupContenders
         });
         }
         */

        dbSchema.TippeligaRound.findOne({
                year: year,
                round: (arg.currentRound - 1) }
        ).exec(
            function (err, previousTippeligaRound) {
                if (previousTippeligaRound) {
                    var previousRoundScores = _updateScores(
                        predictions2014,
                        previousTippeligaRound.tippeliga, previousTippeligaRound.toppscorer, previousTippeligaRound.adeccoliga, previousTippeligaRound.remainingCupContenders);
                    for (var participant in arg.scores) {
                        if (arg.scores.hasOwnProperty(participant)) {
                            arg.scores[participant].previousSum = previousRoundScores[participant].sum;
                        }
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
    _dispatchScoresToClientForPresentation = function (response, requestion, arg) {
        "use strict";
        response.send(JSON.stringify(arg.currentStanding));
        return requestion({
            // TODO: Move property names to common function in 'shared'
            currentMatchesCount: arg.currentMatchesCount,
            currentTippeligaTable: arg.currentTippeligaTable,
            currentTippeligaToppscorer: arg.currentTippeligaToppscorer,
            currentAdeccoligaTable: arg.currentAdeccoligaTable,
            currentRemainingCupContenders: arg.currentRemainingCupContenders
        });
    },


    _dispatchResultsToClientForPresentation = function (response, requestion, arg) {
        "use strict";
        var res = {
            currentTippeligaTable: arg[0],
            currentTippeligaToppscorer: arg[1],
            currentAdeccoligaTable: arg[2],
            currentRemainingCupContenders: arg[3],
            currentYear: arg[4],
            currentRound: arg[5],
            currentDate: arg[6]
        };
        response.send(JSON.stringify(res));
        return requestion();
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
                conditionallyStoreTippeligaRound = curry(_storeTippeligaRound)(currentTippeligaTable)(currentTippeligaToppscorer)(currentAdeccoligaTable)(currentRemainingCupContenders)(year)(round)(currentMatchCountInRound);

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
    _getStoredTippeligaData = function (year, round, requestion) {
        "use strict";
        dbSchema.TippeligaRound.findOne({ year: year, round: round }).exec(
            function (err, tippeligaRound) {

                if (err) {
                    return requestion(undefined, err);
                }
                return requestion([
                    tippeligaRound.tippeliga,
                    tippeligaRound.toppscorer,
                    tippeligaRound.adeccoliga,
                    tippeligaRound.remainingCupContenders,

                    tippeligaRound.year,
                    tippeligaRound.round,
                    tippeligaRound.date
                ]);
            }
        );
    },


    /**
     * ...
     * @param handleTippeligaData
     * @param request
     * @param response
     * @private
     */
    _handleRequest = function (handleTippeligaData, request, response) {
        "use strict";
        var year = request.params.year,
            round = request.params.round;

        // Override with stored tippeliga data => for statistics/history/development ...
        if ((!year || !round) && env === "development") {
            if (root.overrideTippeligaDataWithYear && root.overrideTippeligaDataWithRound) {
                year = global.overrideTippeligaDataWithYear;
                round = global.overrideTippeligaDataWithRound;
                console.warn(utils.logPreamble() + "Overriding current Tippeliga results with stored data from year=" + year + " and round=" + round);
            }
        }

        if (year && round) {
            RQ.sequence([
                curry(_getStoredTippeligaData)(year)(round),
                handleTippeligaData
            ])(go);

        } else {
            RQ.sequence([
                RQ.parallel([
                    norwegianSoccerLeagueService.getCurrentTippeligaTable,
                    norwegianSoccerLeagueService.getCurrentTippeligaToppscorer,
                    norwegianSoccerLeagueService.getCurrentAdeccoligaTable,
                    norwegianSoccerLeagueService.getCurrentRemainingCupContenders
                ]),
                handleTippeligaData
            ])(go);
        }
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

    _handleResultsRequest = exports.handleResultsRequest =
        function (request, response) {
            "use strict";
            var curriedHandleRequest =
                curry(_handleRequest)(
                    RQ.sequence([
                        curry(_dispatchResultsToClientForPresentation)(response)
                    ])
                );
            curriedHandleRequest(request, response);
        },

    _handleScoresRequest = exports.handleScoresRequest =
        function (request, response) {
            "use strict";
            var curriedHandleRequest =
                curry(_handleRequest)(
                    RQ.sequence([
                        _getTippekonkurranseScores,
                        _addPreviousMatchRoundSumToEachParticipant,
                        curry(_dispatchScoresToClientForPresentation)(response),
                        _storeTippeligaRoundMatchData
                    ])
                );
            curriedHandleRequest(request, response);
        };
