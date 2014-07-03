/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
    curry = require("curry"),

// Module dependencies, local generic
    utils = require("./utils.js"),
    RQ = require("./vendor/rq.js").RQ,
    go = utils.rqGo,
    comparators = require("./../../shared/scripts/comparators.js"),

// Module dependencies, local application-specific
    dbSchema = require("./db-schema.js"),
//norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    appModels = require("./../../shared/scripts/app.models.js"),


// TODO: Extract generic requestions out of here to a standalone reusable lib


// Below, "scores" should be read as "penalty points", that's more accurate ...

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
        if ((predictedTeamPlacing === fromPlace) &&
            (predictedTeamPlacing === actualTeamPlacing || actualTeamPlacing === (fromPlace + 1))) {
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


// TODO: spec/test this one!
// TODO: Promote to proper standalone requestion!
    /**
     * Conditionally storing/updating of match round results in MongoDB.
     * This function should be curried, MongoDB callback arguments being the two last ones ...
     *
     * This function is exported with underscore prefix as it is exported for specification/testing purposes only ...
     * @private
     */
    _storeTippeligaRound = exports._storeTippeligaRound =
        function (currentTippeligaTable, currentTippeligaToppscorer, currentAdeccoligaTable, currentRemainingCupContenders, year, round, currentRoundCount, mongoDbErr, storedTippeligaRound) {
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
                    // TODO: Revisit logic, seems a bit strange!
                    // I tillegg, hvis Adeccoliga spiller runder mens Tippeliga ikke gjør det så blir ikke runden oppdatert ...

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
                    { tippeliga: currentTippeligaTable, toppscorer: currentTippeligaToppscorer, adeccoliga: currentAdeccoligaTable, remainingCupContenders: currentRemainingCupContenders },
                    { upsert: true, multi: false },
                    function () {
                        console.log(logMsg + ", " + currentRoundCount + " matches saved... OK");
                    }
                );
            }
        },


    /** App-conventional argument ordering for requestions -> composable server-side functions. */
    _tippeligaTable = exports.tippeligaTableIndex = 0,      // ...
    _tippeligaToppscorer = 1,                               // ...
    _adeccoligaTable = exports.adeccoligaTableIndex = 2,    // ...
    _remainingCupContenders = 3,                            // ...

    _year = 4,                                              // ...
    _round = exports.roundIndex = 5,                        // ...
    _date = 6,                                              // ...
    _matchesCountGrouping = 7,                              // ...
    _scores = exports.scoresIndex = 8,                      // Object with properties 'scores' and 'metadata'


    getStoredTippeligaDataRequestion = exports.getStoredTippeligaDataRequestion =
        function (year, round, requestion, args) {
            "use strict";
            dbSchema.TippeligaRound.findOne({ year: year, round: round }).exec(
                function (err, tippeligaRound) {
                    if (err) {
                        return requestion(undefined, err);
                    }
                    // TODO: Return custom requestion error?
                    if (!tippeligaRound) {
                        return requestion([]);
                    }
                    return requestion([
                        tippeligaRound.tippeliga,
                        tippeligaRound.toppscorer,
                        tippeligaRound.adeccoliga,
                        tippeligaRound.remainingCupContenders,
                        tippeligaRound.year,
                        tippeligaRound.round,
                        tippeligaRound.date,
                        null,
                        null
                    ]);
                }
            );
        },


    addNumberOfMatchesPlayedGrouping = exports.addNumberOfMatchesPlayedGrouping =
        function (requestion, args) {
            "use strict";

            // TODO: Why do we have to clone args here?
            args = __.clone(args);

            args[_matchesCountGrouping] = __.groupBy(args[_tippeligaTable], "matches");
            return requestion(args);
        },


    addCurrentRound = exports.addCurrentRound =
        function (requestion, args) {
            "use strict";
            var allMatchRoundsPresentInCurrentTippeligaTable = __.keys(args[_matchesCountGrouping]);
            args[_round] = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable);
            return requestion(args);
        },


    addTippekonkurranseScoresRequestion = exports.addTippekonkurranseScoresRequestion =
        function (userPredictions, requestion, args) {
            "use strict";

            // Nope, not a particular good idea ...
            //if (arguments.length > 2) {
            //    throw new Error("More than 2 arguments present - this requestion must be curried with predictions object before use");
            //}
            if (!userPredictions) {
                throw new Error("User predictions argument are missing - cannot calculate Tippekonkurranse scores");
            }
            if (!requestion) {
                throw new Error("Requestion argument is missing - check your RQ.js setup");
            }
            if (!args) {
                throw new Error("Requestion argument array is missing - check your RQ.js functions and setup");
            }

            // Create associative array with team name as key, by extracting 'name'
            // => a team-name-indexed data structure, optimized for point calculations
            var indexedTippeligaTable = __.indexBy(args[_tippeligaTable], "name"),
                indexedAdeccoligaTable = __.indexBy(args[_adeccoligaTable], "name"),
                currentStanding = {};

            for (var participant in userPredictions) {
                if (userPredictions.hasOwnProperty(participant)) {
                    var tabellScore = 0,
                        pallScore = 0,
                        nedrykkScore = 0,
                        opprykkScore = 0,
                        toppscorerScore = 0,
                        cupScore = 0,
                        rating = 0, sum = 0,

                        participantObj = userPredictions[participant];

                    if (participantObj) {
                        try {
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
                                if (index === 0 && __.contains(args[_tippeligaToppscorer], toppscorer)) {
                                    toppscorerScore = -1;
                                }
                            });

                            // Opprykk;
                            __.each(participantObj.opprykk, function (teamName, index) {
                                var predictedTeamPlacing = index + 1,
                                    actualTeamPlacing = indexedAdeccoligaTable[teamName].no;

                                opprykkScore += _getOpprykkScore(predictedTeamPlacing, actualTeamPlacing, opprykkScore);
                            });

                            // Cup
                            __.each(participantObj.cup, function (team, index) {
                                if (index === 0 && __.contains(args[_remainingCupContenders], team)) {
                                    cupScore = -1;
                                }
                            });

                            // Sum
                            rating = sum = tabellScore + pallScore + nedrykkScore + toppscorerScore + opprykkScore + cupScore;
                        } catch (e) {
                            if (e.name === "TypeError") {
                                if (e.arguments.length > 0 && e.arguments[0] === "no") {
                                    throw new Error("Illegal data format ('no' property is missing) - cannot calculate Tippekonkurranse scores");
                                }
                            }
                        }
                    }
                    currentStanding[participant] =
                        appModels.scoreModel.createObjectWith(tabellScore, pallScore, nedrykkScore, toppscorerScore, opprykkScore, cupScore, rating);
                }
            }
            args[_scores] = {
                scores: currentStanding,
                metadata: null
            };
            return requestion(args);
        },


    addPreviousMatchRoundRatingToEachParticipantRequestion = exports.addPreviousMatchRoundRatingToEachParticipantRequestion =
        function (userPredictions, requestion, args) {
            "use strict";
            var year = args[_year],
                previousRound = args[_round] - 1,
                getPreviousRoundTippeligaData = curry(getStoredTippeligaDataRequestion)(year)(previousRound),
                addTippekonkurranseScores2014 = curry(addTippekonkurranseScoresRequestion)(userPredictions),

                updatedScores = args[_scores].scores,

                parentRequestion = requestion,
                parentArgs = args;

            RQ.sequence([
                getPreviousRoundTippeligaData,
                addNumberOfMatchesPlayedGrouping,
                addCurrentRound,
                addTippekonkurranseScores2014,
                function (requestion, args) {
                    for (var participant in updatedScores) {
                        if (updatedScores.hasOwnProperty(participant)) {
                            updatedScores[participant][appModels.scoreModel.previousRatingPropertyName] = args[_scores].scores[participant][appModels.scoreModel.ratingPropertyName];
                        }
                    }
                    return requestion(args);
                },
                function (requestion, args) {
                    parentArgs[_scores].scores = updatedScores;
                    return parentRequestion(parentArgs);
                }
            ])(go);
        },


    addMetadataToScores = exports.addMetadataToScores =
        function (requestion, args) {
            "use strict";
            args[_scores].metadata = {
                year: args[_year],
                round: args[_round]
            };
            return requestion(args);
        },


    dispatchScoresToClientForPresentationRequestion = exports.dispatchScoresToClientForPresentationRequestion =
        function (response, requestion, args) {
            "use strict";
            response.json(args[_scores]);
            return requestion(args);
        },


    dispatchResultsToClientForPresentationRequestion = exports.dispatchResultsToClientForPresentationRequestion =
        function (response, requestion, args) {
            "use strict";
            response.json({
                currentTippeligaTable: args[_tippeligaTable],
                currentTippeligaToppscorer: args[_tippeligaToppscorer],
                currentAdeccoligaTable: args[_adeccoligaTable],
                currentRemainingCupContenders: args[_remainingCupContenders],
                currentYear: args[_year],
                currentRound: args[_round],
                currentDate: args[_date]
            });
            return requestion(args);
        },


    storeTippeligaRoundMatchData = exports.storeTippeligaRoundMatchData =
        function (requestion, args) {
            "use strict";
            for (var round in args[_matchesCountGrouping]) {
                if (args[_matchesCountGrouping].hasOwnProperty(round)) {
                    var roundNo = parseInt(round, 10),
                        currentMatchCountInRound = args[_matchesCountGrouping][round].length,
                        conditionallyStoreTippeligaRound = curry(_storeTippeligaRound)(args[_tippeligaTable])(args[_tippeligaToppscorer])(args[_adeccoligaTable])(args[_remainingCupContenders])(args[_year])(args[_round])(currentMatchCountInRound);

                    dbSchema.TippeligaRound
                        .findOne({ year: args[_year], round: roundNo })
                        .exec(conditionallyStoreTippeligaRound);
                }
            }
            return requestion(args);
        },


    sortByPropertyRequestion = exports.sortByPropertyRequestion =
        function (propertyNameOrFunc, requestion, args) {
            "use strict";
            // TODO: Create common argument-checking functions
            // TODO: Keep this argument-checking seremony at all!?
            if (!propertyNameOrFunc && propertyNameOrFunc !== 0) {
                throw new Error("Property name or getter function argument are missing - cannot sort");
            }
            if (typeof propertyNameOrFunc === 'function') {
                propertyNameOrFunc = propertyNameOrFunc.call(this);
            }
            if (typeof propertyNameOrFunc === "string") {
                try {
                    propertyNameOrFunc = parseInt(propertyNameOrFunc, 10);
                } catch (e) {
                    throw new Error("Property Cannot sort by string, only numbers or dates");
                }
            }
            if (!requestion) {
                throw new Error("Requestion argument is missing - check your RQ.js setup");
            }
            if (!args) {
                throw new Error("Requestion argument array is missing - check your RQ.js functions and setup");
            }
            return requestion(args.sort(comparators.propertyArithmeticAscending(propertyNameOrFunc)));
        },


    nullRequestion = exports.nullRequestion =
        function (requestion) {
            "use strict";
            return requestion(null, undefined);
        };


/*
 retrieveTippeligaDataAndThenDispatchToHandler = function (handleTippeligaData, request, response) {
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
 norwegianSoccerLeagueService.getCurrentRemainingCupContenders,
 // TODO: Are these necessary?
 _nullRequestion,
 _nullRequestion,
 _nullRequestion,
 _nullRequestion,
 _nullRequestion
 ]),
 handleTippeligaData
 ])(go);
 }
 },


 handleRequest = function (handleTippeligaData, request, response) {
 "use strict";
 return _retrieveTippeligaDataAndThenDispatchToHandler(handleTippeligaData, request, response);
 };
 */
