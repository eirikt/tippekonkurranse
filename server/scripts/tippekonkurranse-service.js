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
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    appModels = require("./../../shared/scripts/app.models.js"),


////////////////////////////////////////
// Private  functions
////////////////////////////////////////

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
    _tippeligaTable = 0,            // ...
    _tippeligaToppscorer = 1,       // ...
    _adeccoligaTable = 2,           // ...
    _remainingCupContenders = 3,    // ...

    _year = 4,                      // ...
    _round = 5,                     // ...
    _date = 6,                      // ...
    _matchesCountGrouping = 7,      // ...
    _scores = 8,                    // Object with properties 'scores' and 'metadata'


    _getStoredTippeligaData = function (year, round, requestion, args) {
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


    _addNumberOfMatchesPlayedGrouping = function (requestion, args) {
        "use strict";

        // TODO: Why do we have to clone args here?
        args = __.clone(args);

        args[_matchesCountGrouping] = __.groupBy(args[_tippeligaTable], "matches");
        return requestion(args);
    },


    _addCurrentRound = function (requestion, args) {
        "use strict";
        var allMatchRoundsPresentInCurrentTippeligaTable = __.keys(args[_matchesCountGrouping]);
        args[_round] = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable);
        return requestion(args);
    },


    /**
     * Exported with underscore prefix as it is exported for specification/testing purposes only ...
     * @private
     */
    _addTippekonkurranseScores = exports._addTippekonkurranseScores = function (requestion, args) {
        "use strict";

        // Create associative array with team name as key, by extracting 'name'
        // => a team-name-indexed data structure, optimized for point calculations
        var indexedTippeligaTable = __.indexBy(args[_tippeligaTable], "name"),
            indexedAdeccoligaTable = __.indexBy(args[_adeccoligaTable], "name"),
            currentStanding = {};

        // TODO: Curry 'predictions2014' in function
        for (var participant in predictions2014) {
            if (predictions2014.hasOwnProperty(participant)) {
                var tabellScore = 0,
                    pallScore = 0,
                    nedrykkScore = 0,
                    opprykkScore = 0,
                    toppscorerScore = 0,
                    cupScore = 0,
                    rating = 0, sum = 0,

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


    _addPreviousMatchRoundRatingToEachParticipant = function (requestion, args) {
        "use strict";
        var year = args[_year],
            previousRound = args[_round] - 1,
            _getPreviousRoundTippeligaData = curry(_getStoredTippeligaData)(year)(previousRound),

            updatedScores = args[_scores].scores,

            parentRequestion = requestion,
            parentArgs = args;

        RQ.sequence([
            _getPreviousRoundTippeligaData,
            _addNumberOfMatchesPlayedGrouping,
            _addCurrentRound,
            _addTippekonkurranseScores,
            function (requestion, args) {
                for (var participant in updatedScores) {
                    if (updatedScores.hasOwnProperty(participant)) {
                        updatedScores[participant][appModels.scoreModel.previousRatingPropertyName] =
                            args[_scores].scores[participant][appModels.scoreModel.ratingPropertyName];
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


    _addMetadataToScores = function (requestion, args) {
        "use strict";
        args[_scores].metadata = {
            year: args[_year],
            round: args[_round]
        };
        return requestion(args);
    },


    _dispatchScoresToClientForPresentation = function (response, requestion, args) {
        "use strict";
        response.json(args[_scores]);
        return requestion(args);
    },


    _dispatchResultsToClientForPresentation = function (response, requestion, args) {
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


    _storeTippeligaRoundMatchData = function (requestion, args) {
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


    _sortByPropertyRequestion = function (propertyName, requestion, args) {
        "use strict";
        var naturalByPropertyComparator = curry(comparators.propertyArithmeticComparator)(propertyName);
        args.sort(naturalByPropertyComparator);
        return requestion(args);
    },


    _nullRequestion = function (requestion) {
        "use strict";
        return requestion(null, undefined);
    },


    _retrieveTippeligaDataAndThenDispatchToHandler = function (handleTippeligaData, request, response) {
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


    _handleRequest = function (handleTippeligaData, request, response) {
        "use strict";
        return _retrieveTippeligaDataAndThenDispatchToHandler(handleTippeligaData, request, response);
    },
// /Private functions


////////////////////////////////////////
// Public functions
////////////////////////////////////////

    _handlePredictionsRequest = exports.handlePredictionsRequest =
        function (request, response) {
            "use strict";

            var year = parseInt(request.params.year, 10),
                userId = request.params.userId,
                predictions = null;

            // TODO:
            //predictions = predictions[year][userId];
            if (year === 2014) {
                predictions = predictions2014[userId];
                response.json(200, predictions);
            } else {
                response.json(404);
            }
        },


    _handleResultsRequest = exports.handleResultsRequest =
        function (request, response) {
            "use strict";

            var resultsRequest = curry(_handleRequest)(
                RQ.sequence([
                    curry(_dispatchResultsToClientForPresentation)(response),
                    _storeTippeligaRoundMatchData
                ])
            );

            resultsRequest(request, response);
        },


    _handleScoresRequest = exports.handleScoresRequest =
        function (request, response) {
            "use strict";

            var scoresRequest = curry(_handleRequest)(
                RQ.sequence([
                    _addNumberOfMatchesPlayedGrouping,
                    _addCurrentRound,
                    _addTippekonkurranseScores,
                    _addPreviousMatchRoundRatingToEachParticipant,
                    _addMetadataToScores,
                    curry(_dispatchScoresToClientForPresentation)(response),
                    _storeTippeligaRoundMatchData
                ])
            );

            scoresRequest(request, response);
        },


    _handleRatingHistoryRequest = exports.handleRatingHistoryRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year || new Date().getFullYear(),
                currentRound = request.params.currentRound || 12,
                round,
                getHistoricTippekonkurranseScores = [],
                data = {},
                sortByRound = curry(_sortByPropertyRequestion)(_round);

            // 1. Create array of requestions: all historic tippeligakonkurranse scores
            for (round = 1; round < currentRound; round += 1) {
                getHistoricTippekonkurranseScores.push(
                    RQ.sequence([
                        curry(_getStoredTippeligaData)(year)(round),
                        _addNumberOfMatchesPlayedGrouping,
                        _addCurrentRound,
                        _addTippekonkurranseScores
                    ])
                );
            }

            // 2. Then process these ...
            RQ.sequence([
                RQ.parallel(getHistoricTippekonkurranseScores),
                sortByRound,
                function (requestion, args) {
                    /* Create processing-friendly data structure skeleton:
                     * var participants = {
                     *     <userId> = { userId: {String}, ratings: [] }
                     * }
                     */
                    var userIdArray = Object.keys(args[0][_scores].scores);
                    __.each(userIdArray, function (userId, index) {
                        data[userId] = {
                            userId: userId,
                            ratings: []
                        };
                        if (index >= userIdArray.length - 1) {
                            return requestion(args);
                        }
                    });
                },
                function (requestion, args) {
                    // Process/build data structure
                    __.each(args, function (completeTippekonkurranseRoundData) {
                        __.each(completeTippekonkurranseRoundData[_scores].scores, function (participantScores, userId) {
                            data[userId].ratings.push(participantScores.rating);
                        });
                    });
                    return requestion(data);
                },
                function (requestion, data) {
                    /* Create/Transform to JqPlot-friendly data structure:
                     * var participants = [
                     *     { userId: {String}, ratings: [] }
                     * ]
                     */
                    data = __.map(data, __.identity);
                    return requestion(data);
                },
                function (requestion, data) {
                    // Dispatch historic tippekonkurranse scores response
                    response.json(data);
                    return requestion();
                }
            ])(go);
            /*
             (1) Først:
             var allParticipants = {
             "eirik" = {
             userId: "eirik",
             ratings: [1, 10, 5, 9, 13, 11, 6, 3, 1, 1, 2, 4]
             },
             ...
             };

             (2) Deretter:
             var rankingTendencyForEirik = {
             userId: "eirik",
             ratings: [1, 10, 5, 9, 13, 11, 6, 3, 1, 1, 2, 4]
             },
             rankingTendencyForOddvar = {
             userId: "oddvar",
             ratings: [3, 4, 5, 3, 3, 4, 7, 8, 8, 8, 6, 6]
             },
             rankingTendencyForJanTore = {
             userId: "jan_tore",
             ratings: [33, 44, 55, 33, 33, 44, 76, 82, 83, 85, 64, 23]
             },
             rankingTendencyForHansBernhard = {
             userId: "hans_bernhard",
             ratings: [8, 23, 25, 34, 39, 41, 77, 88, 88, 89, 62, 64]
             },

             ratings = [
             rankingTendencyForHansBernhard,
             rankingTendencyForEirik,
             rankingTendencyForOddvar,
             rankingTendencyForJanTore
             ];

             // As of now ...
             console.log(JSON.stringify(ratings));
             response.json(ratings);
             */
        };

