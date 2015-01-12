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
    TippekonkurranseData = require("./../../shared/scripts/app.models").TippekonkurranseData,
    tippekonkurranse = require("./tippekonkurranse"),


////////////////////////////////////////
// Public functions
////////////////////////////////////////

    _handlePredictionsRequest = exports.handlePredictionsRequest =
        function (request, response) {
            "use strict";

            var year = parseInt(request.params.year, 10),
                userId = request.params.userId,
                predictions = tippekonkurranse.predictions[ year ][ userId ];

            if (predictions) {
                response.status(200).json(predictions);

            } else {
                console.error("Predictions are missing for year " + year);
                response.status(404).send("Predictions are missing for year " + year);
            }
        },


    _handleResultsRequest = exports.handleResultsRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year;

            RQ.sequence([
                tippekonkurranse.retrieveTippeligaData(request),
                rq.requestor(curry(tippekonkurranse.dispatchResultsToClientForPresentation, response)),
                rq.requestor(tippekonkurranse.storeTippeligaRoundMatchData)
            ])(rq.execute);
        },


    _handleScoresRequest = exports.handleScoresRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year,
                rulesOfTheYear = tippekonkurranse.rules[ year ],
                predictionsOfTheYear = tippekonkurranse.predictions[ year ];

            if (rulesOfTheYear && predictionsOfTheYear) {
                RQ.sequence([
                    tippekonkurranse.retrieveTippeligaData(request),
                    rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                    rq.requestor(tippekonkurranse.addRound),
                    curry(tippekonkurranse.addTippekonkurranseScoresRequestor, predictionsOfTheYear, rulesOfTheYear),
                    curry(tippekonkurranse.addPreviousMatchRoundRatingToEachParticipantRequestor, predictionsOfTheYear, rulesOfTheYear),
                    rq.requestor(tippekonkurranse.addMetadataToScores),
                    rq.requestor(curry(tippekonkurranse.dispatchScoresToClientForPresentation, response)),
                    rq.requestor(tippekonkurranse.storeTippeligaRoundMatchData)
                ])(rq.execute);

            } else {
                console.error("Rules and/or predictions are missing for year " + year);
                response.status(404).send("Rules and/or predictions are missing for year " + year);
            }
        },


    _handleRatingHistoryRequest = exports.handleRatingHistoryRequest =
        function (request, response) {
            "use strict";
            var year = request.params.year,
                round = request.params.round,
                key = year + round,
                rulesOfTheYear = tippekonkurranse.rules[ year ],
                predictionsOfTheYear = tippekonkurranse.predictions[ year ],

                cache = root.app.cache.ratingHistory,
                memoizedValue = utils.memoizationReader(cache, key),
                _dispatchAsJson = function (response, statusCode, data) {
                    response.status(statusCode).json(data);
                },
                dispatchTheResults = curry(_dispatchAsJson, response, 200),

                tippekonkurranseData,
                data = {},

                getTippekonkurranseScoresHistory = [],
                roundIndex = 1,

                sortByElementIndex,
                sortByRound,
                cacheTheResults;

            // 1. Any cached value already?
            if (memoizedValue) {
                return dispatchTheResults(memoizedValue);
            }

            // 2. Prepare for data mining
            year = parseInt(year, 10);
            round = parseInt(round, 10);
            tippekonkurranseData = new TippekonkurranseData();
            sortByElementIndex = function (elementIndex, args) {
                return args.sort(comparators.ascendingByArrayElement(elementIndex));
            };
            sortByRound = curry(sortByElementIndex, tippekonkurranseData.indexOfRound);
            cacheTheResults = curry(utils.memoizationWriter, true, cache, curry(root.app.isRoundCompleted, year, round), key);

            // 3. Create array of requestors: all historic Tippeligakonkurranse scores - and then execute and wait for all to finish
            for (; roundIndex <= round; roundIndex += 1) {
                getTippekonkurranseScoresHistory.push(
                    RQ.sequence([
                        curry(tippekonkurranse.getStoredTippeligaDataRequestor, year, roundIndex),
                        rq.requestor(tippekonkurranse.addTeamAndNumberOfMatchesPlayedGrouping),
                        rq.requestor(tippekonkurranse.addRound),
                        curry(tippekonkurranse.addTippekonkurranseScoresRequestor, predictionsOfTheYear, rulesOfTheYear)
                    ])
                );
            }

            // 4. Then execute them ...
            RQ.sequence([
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

                /* Create/Transform from processing-friendly data structure:
                 * var participants = [{ <userId> = { userId: {string}, ratings: [] }}]
                 * to JqPlot-friendly data structure:
                 * var participants = [{ userId: {string}, ratings: [] }]
                 *
                 * 'partialFn' is just for switching the argument ordering in Underscore's 'map' function, which is all wrong.
                 */
                // TODO: Consider including 'year' in response
                rq.then(___.partialFn(__.map, __.identity)),

                rq.then(cacheTheResults),
                rq.then(dispatchTheResults)

            ])(rq.execute);
        };
