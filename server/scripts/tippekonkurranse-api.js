/* global root:false, require:false, exports:false */

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
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    tippekonkurranse = require("./tippekonkurranse.js"),
    tippekonkurranse2014 = require("./tippekonkurranse-2014.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,


    _retrieveTippeligaDataAndThenDispatchToHandler = function (handleTippeligaData, request, response) {
        "use strict";
        var useLiveData = true,
            year = request.params.year,
            round = request.params.round;

        // Override with stored Tippeliga data => for statistics/history/development ...
        if (!round && env === "development") {
            if (root.overrideTippeligaDataWithRound) {
                round = root.overrideTippeligaDataWithRound;
                console.warn(utils.logPreamble() + "Overriding current Tippeliga results with stored data from year=" + year + " and round=" + round);
            }
        }

        if (year && round) {
            RQ.sequence([
                curry(tippekonkurranse.getStoredTippeligaDataRequestory)(year)(round),
                handleTippeligaData
            ])(go);

        } else {
            var now = new Date();
            RQ.sequence([
                RQ.parallel([
                    // The 'Tippekonkurranse' app-conventional argument ordering for requestions:
                    rq.identity(useLiveData),
                    norwegianSoccerLeagueService.getCurrentTippeligaTable,
                    norwegianSoccerLeagueService.getCurrentTippeligaToppscorer,
                    norwegianSoccerLeagueService.getCurrentAdeccoligaTable,
                    norwegianSoccerLeagueService.getCurrentRemainingCupContenders,
                    rq.identity(now.getFullYear()),
                    rq.nullArg,
                    rq.identity(now),
                    rq.identity(now.getFullYear()),
                    rq.nullArg,
                    rq.nullArg,
                    rq.nullArg
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

            var year = parseInt(request.params.year, 10),
                userId = request.params.userId;

            // TODO:
            //predictions = predictions[year][userId];
            if (year === 2014) {
                response.status(200).json(predictions2014[userId]);

            } else {
                response.json(404);
            }
        },


    _handleResultsRequest = exports.handleResultsRequest =
        function (request, response) {
            "use strict";

            var resultsRequest = curry(_retrieveTippeligaDataAndThenDispatchToHandler)(
                RQ.sequence([
                    rq.requestor(curry(tippekonkurranse.dispatchResultsToClientForPresentation)(response)),
                    tippekonkurranse.storeTippeligaRoundMatchData
                ])
            );

            resultsRequest(request, response);
        },


    _handleScoresRequest = exports.handleScoresRequest =
        function (request, response) {
            "use strict";

            var scoresRequest = curry(_retrieveTippeligaDataAndThenDispatchToHandler)(
                RQ.sequence([
                    rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                    rq.requestor(tippekonkurranse.addRound),
                    rq.requestor(tippekonkurranse.addCurrent),
                    tippekonkurranse2014.addTippekonkurranseScores2014,
                    tippekonkurranse2014.addPreviousMatchRoundRatingToEachParticipant2014,
                    rq.requestor(tippekonkurranse.addMetadataToScores),
                    rq.requestor(curry(tippekonkurranse.dispatchScoresToClientForPresentation)(response)),
                    rq.requestor(tippekonkurranse.storeTippeligaRoundMatchData)
                ])
            );

            scoresRequest(request, response);
        },


    _handleRatingHistoryRequest = exports.handleRatingHistoryRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year || new Date().getFullYear(),
                round = request.params.round,

                roundIndex,
                data = {},

                getHistoricTippekonkurranseScores = [];

            // 1. Create array of requestors: all historic Tippeligakonkurranse scores
            for (roundIndex = 1; roundIndex <= round; roundIndex += 1) {
                getHistoricTippekonkurranseScores.push(
                    RQ.sequence([
                        curry(tippekonkurranse.getStoredTippeligaDataRequestory)(year)(roundIndex),
                        rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                        rq.requestor(tippekonkurranse.addRound),
                        tippekonkurranse2014.addTippekonkurranseScores2014
                    ])
                );
            }

            // 2. Then process these ...
            RQ.sequence([
                RQ.parallel(getHistoricTippekonkurranseScores),

                // Sort by round
                rq.requestor(curry(tippekonkurranse.sortByProperty)(tippekonkurranse.roundIndex)),

                function (requestion, args) {
                    /* Create processing-friendly data structure skeleton:
                     * var participants = {
                     *     <userId> = { userId: {string}, ratings: [] }
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
                    // TODO: Include 'year' in response
                    /* Create/Transform to JqPlot-friendly data structure:
                     * var participants = [
                     *     { userId: {string}, ratings: [] }
                     * ]
                     */
                    data = __.map(data, __.identity);
                    return requestion(data);
                },

                // TODO: An obvious generic requestory ...
                function (requestion, data) {
                    // Dispatch historic Tippekonkurranse scores response
                    response.json(data);
                    return requestion();
                }
            ])(go);
        };
