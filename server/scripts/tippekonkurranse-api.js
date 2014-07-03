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
//dbSchema = require("./db-schema.js"),
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
//appModels = require("./../../shared/scripts/app.models.js"),
    tippekonkurranse = require("./tippekonkurranse.js"),
    tippekonkurranse2014 = require("./tippekonkurranse-2014.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,


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
                curry(tippekonkurranse.getStoredTippeligaDataRequestion)(year)(round),
                handleTippeligaData
            ])(go);

        } else {
            RQ.sequence([
                RQ.parallel([
                    norwegianSoccerLeagueService.getCurrentTippeligaTable,
                    norwegianSoccerLeagueService.getCurrentTippeligaToppscorer,
                    norwegianSoccerLeagueService.getCurrentAdeccoligaTable,
                    norwegianSoccerLeagueService.getCurrentRemainingCupContenders//,
                    // TODO: Are these necessary?
                    // TODO: Move 'nullRequestion' function to common lib, e.g. 'basic-requestions.js'/'more-requestions.js'/...
                    //tippekonkurranse.nullRequestion,
                    //tippekonkurranse.nullRequestion,
                    //tippekonkurranse.nullRequestion,
                    //tippekonkurranse.nullRequestion,
                    //tippekonkurranse.nullRequestion
                ]),
                handleTippeligaData
            ])(go);
        }
    },


    _handleRequest = function (handleTippeligaData, request, response) {
        "use strict";
        return _retrieveTippeligaDataAndThenDispatchToHandler(handleTippeligaData, request, response);
    },

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
                    curry(tippekonkurranse.dispatchResultsToClientForPresentationRequestion)(response),
                    tippekonkurranse.storeTippeligaRoundMatchData
                ])
            );

            resultsRequest(request, response);
        },


    _handleScoresRequest = exports.handleScoresRequest =
        function (request, response) {
            "use strict";

            var scoresRequest = curry(_handleRequest)(
                RQ.sequence([
                    tippekonkurranse.addNumberOfMatchesPlayedGrouping,
                    tippekonkurranse.addCurrentRound,
                    tippekonkurranse2014.addTippekonkurranseScores2014,
                    tippekonkurranse2014.addPreviousMatchRoundRatingToEachParticipant2014,
                    tippekonkurranse.addMetadataToScores,
                    curry(tippekonkurranse.dispatchScoresToClientForPresentationRequestion)(response),
                    tippekonkurranse.storeTippeligaRoundMatchData
                ])
            );

            scoresRequest(request, response);
        },


    _handleRatingHistoryRequest = exports.handleRatingHistoryRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year || new Date().getFullYear(),
                currentRound = request.params.round,

                round,
                getHistoricTippekonkurranseScores = [],
                data = {},

                sortByRound = curry(tippekonkurranse.sortByPropertyRequestion)(tippekonkurranse.roundIndex);

            // 1. Create array of requestions: all historic tippeligakonkurranse scores
            for (round = 1; round < currentRound; round += 1) {
                getHistoricTippekonkurranseScores.push(
                    RQ.sequence([
                        curry(tippekonkurranse.getStoredTippeligaDataRequestion)(year)(round),
                        tippekonkurranse.addNumberOfMatchesPlayedGrouping,
                        tippekonkurranse.addCurrentRound,
                        tippekonkurranse2014.addTippekonkurranseScores2014
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
                    var userIdArray = Object.keys(args[0][tippekonkurranse.scoresIndex].scores);
                    __.each(userIdArray, function (userId, index) {
                        data[userId] = { userId: userId, ratings: [] };
                        if (index >= userIdArray.length - 1) {
                            return requestion(args);
                        }
                    });
                },
                function (requestion, args) {
                    // Process/build data structure
                    __.each(args, function (completeTippekonkurranseRoundData) {
                        __.each(completeTippekonkurranseRoundData[tippekonkurranse.scoresIndex].scores, function (participantScores, userId) {
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

