/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
    curry2 = require("curry"),

// Module dependencies, local generic
    comparators = require("./../../shared/scripts/comparators"),
    curry = require("./../../shared/scripts/fun").curry,
    utils = require("./../../shared/scripts/utils"),
    RQ = require("./vendor/rq").RQ,
    rq = require("./rq-fun"),

// Module dependencies, local application-specific
    TeamPlacement = require("./../../shared/scripts/app.models").TeamPlacement,
    TippekonkurranseData = require("./../../shared/scripts/app.models").TippekonkurranseData,
    tippekonkurranse = require("./tippekonkurranse"),
    predictions2014 = require("./tippekonkurranse-2014-user-predictions").predictions2014,
    tippekonkurranse2014 = require("./tippekonkurranse-2014"),


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
            RQ.sequence([
                tippekonkurranse.retrieveTippeligaData(request),
                rq.requestor(curry(tippekonkurranse.dispatchResultsToClientForPresentation, response)),
                rq.requestor(tippekonkurranse.storeTippeligaRoundMatchData)
            ])(rq.execute);
        },


    _handleScoresRequest = exports.handleScoresRequest =
        function (request, response) {
            "use strict";
            RQ.sequence([
                tippekonkurranse.retrieveTippeligaData(request),
                rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                rq.requestor(tippekonkurranse.addRound),
                rq.requestor(tippekonkurranse.addCurrentRound),
                tippekonkurranse2014.addTippekonkurranseScores2014,
                tippekonkurranse2014.addPreviousMatchRoundRatingToEachParticipant2014,
                rq.requestor(tippekonkurranse.addMetadataToScores),
                rq.requestor(curry2(tippekonkurranse.dispatchScoresToClientForPresentation)(response)),
                rq.requestor(tippekonkurranse.storeTippeligaRoundMatchData)
            ])(rq.execute);
        },


    _handleRatingHistoryRequest = exports.handleRatingHistoryRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year || new Date().getFullYear(),
                round = request.params.round,

                roundIndex,
                data = {},

                getHistoricTippekonkurranseScores = [],

                sortByElementIndex = function (elementIndex, args) {
                    return args.sort(comparators.arrayElementArithmeticAscending(elementIndex));
                },
            //sortByRound = rq.requestor(curry(sortByElementIndex, tippekonkurranse.roundIndex)),
                sortByRound = rq.requestor(curry(sortByElementIndex, new TippekonkurranseData().indexOfRound)),

                _dispatchAsJson = function (response, statusCode, data) {
                    response.status(statusCode).json(data);
                },
                dispatchAsJson = rq.requestor(curry(_dispatchAsJson, response, 200));

            // 1. Create array of requestors: all historic Tippeligakonkurranse scores
            for (roundIndex = 1; roundIndex <= round; roundIndex += 1) {
                getHistoricTippekonkurranseScores.push(
                    RQ.sequence([
                        curry(tippekonkurranse.getStoredTippeligaDataRequestor, year, roundIndex),
                        rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                        rq.requestor(tippekonkurranse.addRound),
                        tippekonkurranse2014.addTippekonkurranseScores2014
                    ])
                );
            }

            // 2. Then execute them ...
            RQ.sequence([
                RQ.parallel(getHistoricTippekonkurranseScores),

                // 3. And manipulate them ...
                sortByRound,

                function (requestion, args) {
                    /* Create processing-friendly data structure skeleton:
                     * var participants = { <userId> = { userId: {string}, ratings: [] }}
                     */
                    var userIdArray = Object.keys(args[0][new TippekonkurranseData().indexOfScores].scores);
                    __.each(userIdArray, function (userId, index) {
                        data[userId] = {userId: userId, ratings: []};
                        if (index >= userIdArray.length - 1) {
                            return requestion(args);
                        }
                    });
                },

                function (requestion, args) {
                    // Process/build data structure
                    __.each(args, function (completeTippekonkurranseRoundData) {
                        __.each(completeTippekonkurranseRoundData[new TippekonkurranseData().indexOfScores].scores, function (participantScores, userId) {
                            data[userId].ratings.push(participantScores.rating);
                        });
                    });
                    return requestion(data);
                },

                function (requestion, data) {
                    // TODO: Include 'year' in response
                    /* Create/Transform from:
                     * var participants = [{ <userId> = { userId: {string}, ratings: [] }}]
                     * to JqPlot-friendly data structure:
                     * var participants = [{ userId: {string}, ratings: [] }]
                     */
                    return requestion(__.map(data, __.identity));
                },

                // 4. And dispatch the data ...
                dispatchAsJson

            ])(rq.execute);
        };
