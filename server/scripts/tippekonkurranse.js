/* global root:false, require:false, exports:false */
/* jshint -W083 */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
    curry = require("curry"),

// Module dependencies, local generic
    utils = require("./utils.js"),
    RQ = require("./vendor/rq.js").RQ,
    rq = require("./utils.js"),
    go = utils.rqGo,
    comparators = require("./../../shared/scripts/comparators.js"),

// Module dependencies, local application-specific
    dbSchema = require("./db-schema.js"),
    appModels = require("./../../shared/scripts/app.models.js"),


// Below, "scores" should be read as "penalty points", that's more accurate ...

    _getTableScore = function (predictedTeamPlacing, actualTeamPlacing) {
        "use strict";
        return Math.abs(predictedTeamPlacing - actualTeamPlacing);
    },


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


    _getExtraPallScore = function (predictedTeamPlacing, currentPallScore) {
        "use strict";
        return predictedTeamPlacing === 4 && currentPallScore === -3 ? -1 : 0;
    },


// TODO: reduce cyclic complexity (from 7 to 5)
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


// TODO: Promote to proper standalone requestor function!
    /**
     * <p>
     * Conditionally storing/updating of match round results in MongoDB.
     * This function should be curried, MongoDB callback arguments being the two last ones ...
     * </p>
     * <p>
     * This function is exported with underscore prefix as it is exported for specification/testing purposes only ...
     * </p>
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


// App-conventional argument ordering for requestions -> composable server-side functions
    _argumentCount = exports.argumentCount = 12,            // Number of arguments in server-side processing pipeline

    _liveData = exports.liveData = 0,                       // Live or historic Tippeliga data

    _tippeligaTable = exports.tippeligaTableIndex = 1,      // TODO: Document ...
    _tippeligaToppscorer = 2,                               // TODO: Document ...
    _adeccoligaTable = exports.adeccoligaTableIndex = 3,    // TODO: Document ...
    _remainingCupContenders = 4,                            // TODO: Document ...

    _year = 5,                                              // TODO: Document ...
    _round = exports.roundIndex = 6,                        // TODO: Document ...
    _date = 7,                                              // TODO: Document ...
    _currentYear = 8,                                       // This year (not the requested year)
    _currentRound = 9,                                      // The latest round (not the requested round)

    _matchesCountGrouping = 10,                             // TODO: Document ...
    _scores = exports.scoresIndex = 11,                     // Object with properties 'scores' and 'metadata'


    getStoredTippeligaDataRequestory = exports.getStoredTippeligaDataRequestory =
        function (year, round, requestion, args) {
            "use strict";
            var liveData = false;
            dbSchema.TippeligaRound.find({ year: year }).exec(
                function (err, allTippeligaRounds) {
                    if (err) {
                        return requestion(undefined, err);
                    }
                    dbSchema.TippeligaRound.findOne({ year: year, round: round }).exec(
                        function (err, tippeligaRound) {
                            if (err) {
                                return requestion(undefined, err);
                            }
                            if (!tippeligaRound) {
                                //return requestion([]);
                                // TODO: Do something a bit more clever! Return custom requestion error? Redirect to latest completed round?
                                return requestion(undefined, "No data for round"); // => Blank screen ...
                            }
                            return requestion([
                                liveData,
                                tippeligaRound.tippeliga,
                                tippeligaRound.toppscorer,
                                tippeligaRound.adeccoliga,
                                tippeligaRound.remainingCupContenders,
                                tippeligaRound.year,
                                tippeligaRound.round,
                                tippeligaRound.date,
                                new Date().getFullYear(),
                                allTippeligaRounds.length,
                                null,
                                null
                            ]);
                        }
                    );
                }
            );
        },


    addTeamAndNumberOfMatchesPlayedGrouping = exports.addTeamAndNumberOfMatchesPlayedGrouping =
        function (args) {
            "use strict";

            // TODO: Why do we have to clone args here?
            args = __.clone(args);

            args[_matchesCountGrouping] = __.groupBy(args[_tippeligaTable], "matches");
            return args;
        },


    addRound = exports.addRound =
        function (args) {
            "use strict";
            if (!args[_round]) {
                var allMatchRoundsPresentInCurrentTippeligaTable = __.keys(args[_matchesCountGrouping]);
                args[_round] = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable);
            }
            return args;
        },


    addCurrent = exports.addCurrent =
        function (args) {
            "use strict";
            if (!args[_currentRound]) {
                // Historic data already set in 'getStoredTippeligaDataRequestory' function
                if (args[_liveData]) {
                    args[_currentRound] = args[_round];
                }
            }
            return args;
        },


    addTippekonkurranseScoresRequestor = exports.addTippekonkurranseScoresRequestor =
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
                        __.each(participantObj.tabell, function (teamName, index) {
                            try {
                                var predictedTeamPlacing = index + 1,
                                    actualTeamPlacing = indexedTippeligaTable[teamName].no;

                                // Tabell
                                tabellScore += _getTableScore(predictedTeamPlacing, actualTeamPlacing);

                                // Pall
                                pallScore += _getPallScore(predictedTeamPlacing, actualTeamPlacing);
                                pallScore += _getExtraPallScore(predictedTeamPlacing, pallScore);

                                // Nedrykk
                                nedrykkScore += _getNedrykkScore(predictedTeamPlacing, actualTeamPlacing, nedrykkScore);

                            } catch (e) {
                                throw new Error("Unable to calculate scores for team '" + teamName + "' for participant '" + participant + "' - probably illegal data format");
                            }
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


    addPreviousMatchRoundRatingToEachParticipantRequestor = exports.addPreviousMatchRoundRatingToEachParticipantRequestor =
        function (userPredictions, requestion, args) {
            "use strict";
            var year = args[_year],
                previousRound = args[_round] - 1,
                getPreviousRoundTippeligaData = curry(getStoredTippeligaDataRequestory)(year)(previousRound),
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor)(userPredictions),

                updatedScores = args[_scores].scores,

                parentRequestion = requestion,
                parentArgs = args;

            if (previousRound <= 0) {
                return requestion(args);

            } else {
                RQ.sequence([
                    getPreviousRoundTippeligaData,
                    rq.requestor(addTeamAndNumberOfMatchesPlayedGrouping),
                    rq.requestor(addRound),
                    addTippekonkurranseScores,
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
            }
        },


    addMetadataToScores = exports.addMetadataToScores =
        function (args) {
            "use strict";
            args[_scores].metadata = {
                live: args[_liveData],
                year: args[_year],
                round: args[_round],
                date: args[_date],
                currentYear: args[_currentYear],
                currentRound: args[_currentRound]
            };
            return args;
        },


    dispatchScoresToClientForPresentation = exports.dispatchScoresToClientForPresentation =
        function (response, args) {
            "use strict";
            response.json(args[_scores]);
            return args;
        },


    dispatchResultsToClientForPresentation = exports.dispatchResultsToClientForPresentation =
        function (response, args) {
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
            return args;
        },


    storeTippeligaRoundMatchData = exports.storeTippeligaRoundMatchData =
        function (args) {
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
            return args;
        },


    sortByProperty = exports.sortByProperty =
        function (propertyNameOrFunc, args) {
            "use strict";
            // TODO: Create common argument-checking functions
            // TODO: Do I want to keep this argument-checking ceremony at all?
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
            // Nope, RQ.js stuff factored away
            //if (!requestion) {
            //    throw new Error("Requestion argument is missing - check your RQ.js setup");
            //}
            if (!args) {
                throw new Error("Requestion argument array is missing - check your RQ.js functions and setup");
            }
            return args.sort(comparators.propertyArithmeticAscending(propertyNameOrFunc));
        };
