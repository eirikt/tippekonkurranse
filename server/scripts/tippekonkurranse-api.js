/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
    ___ = require("scoreunder"),

// Module dependencies, local generic
    comparators = require("./../../shared/scripts/comparators"),
    map = require("./../../shared/scripts/fun").map,
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
                response.status(200).json(predictions2014[ userId ]);

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
                tippekonkurranse2014.addTippekonkurranseScores2014,
                tippekonkurranse2014.addPreviousMatchRoundRatingToEachParticipant2014,
                rq.requestor(tippekonkurranse.addMetadataToScores),
                rq.requestor(curry(tippekonkurranse.dispatchScoresToClientForPresentation, response)),
                rq.requestor(tippekonkurranse.storeTippeligaRoundMatchData)
            ])(rq.execute);
        },


    _handleRatingHistoryRequest = exports.handleRatingHistoryRequest =
        function (request, response) {
            "use strict";
            var year = parseInt(request.params.year, 10),
                round = parseInt(request.params.round, 10),
                key = year.toString() + round,

                cache = root.app.cache.ratingHistory,
                memoizedValue = utils.memoizationReader(cache, key),
                _dispatchAsJson = function (response, statusCode, data) {
                    response.status(statusCode).json(data);
                },
                dispatch = curry(_dispatchAsJson, response, 200),

                tippekonkurranseData,
                roundIndex,
                data = {},
                getTippekonkurranseScoresHistory = [],

                sortByElementIndex,
                sortByRound,
                memoizeWrite;

            //console.log(utils.logPreamble + "handleRatingHistoryRequest:: year=" + year + ", round=" + round);

            // 1. Any cached value?
            if (memoizedValue) {
                return dispatch(memoizedValue);
            }

            // 2. Prepare for data mining
            tippekonkurranseData = new TippekonkurranseData();
            sortByElementIndex = function (elementIndex, args) {
                return args.sort(comparators.arrayElementArithmeticAscending(elementIndex));
            };
            sortByRound = curry(sortByElementIndex, tippekonkurranseData.indexOfRound);
            memoizeWrite = curry(utils.memoizationWriter, cache, curry(utils.isCompletedRound, round), key);

            // 3. Create array of requestors: all historic Tippeligakonkurranse scores
            //console.log("Creating requestors for historic scores ...");
            for (roundIndex = 1; roundIndex <= round; roundIndex += 1) {
                //console.log("Creating requestor " + roundIndex + " ...");
                getTippekonkurranseScoresHistory.push(
                    RQ.sequence([
                        curry(tippekonkurranse.getStoredTippeligaDataRequestor, year, roundIndex),
                        rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                        rq.requestor(tippekonkurranse.addRound),
                        tippekonkurranse2014.addTippekonkurranseScores2014
                    ])
                );
            }

            // 4. Then execute them ...
            return RQ.sequence([
                RQ.parallel(getTippekonkurranseScoresHistory),

                // 5. And manipulate them ...
                rq.then(sortByRound),

                // TODO: Ugly! Rewrite with 'map' and 'partialFn' and ...
                function (requestion, args) {
                    /* Create processing-friendly data structure skeleton:
                     * { <userId> = { userId: <userId>, ratings: [] }}
                     */
                    var userIdArray = Object.keys(args[ 0 ][ tippekonkurranseData.indexOfScores ].scores);
                    __.each(userIdArray, function (userId, index) {
                        data[ userId ] = { userId: userId, ratings: [] };
                        if (index >= userIdArray.length - 1) {
                            return requestion(args);
                        }
                    });
                },

                // TODO: Ugly! Rewrite with 'map' and 'partialFn' and ...
                function (requestion, args) {
                    // Process/build data structure
                    __.each(args, function (completeTippekonkurranseRoundData) {
                        __.each(completeTippekonkurranseRoundData[ tippekonkurranseData.indexOfScores ].scores, function (participantScores, userId) {
                            data[ userId ].ratings.push(participantScores.rating);
                        });
                    });
                    return requestion(data);
                },

                /* Create/Transform from:
                 * var participants = [{ <userId> = { userId: {string}, ratings: [] }}]
                 * to JqPlot-friendly data structure:
                 * var participants = [{ userId: {string}, ratings: [] }]
                 *
                 * 'partialFn' is just for switching the argument ordering in Underscore's 'map' function, which is all wrong.
                 */
                // TODO: Consider including 'year' in response
                rq.then(___.partialFn(__.map, __.identity)),

                // 6. And remember them ...
                rq.then(memoizeWrite),

                // 7. And finally dispatch them ...
                rq.then(dispatch)

            ])(rq.execute);
        };
