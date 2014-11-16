/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
//    curry2 = require("curry"),

// Module dependencies, local generic
    comparators = require("./../../shared/scripts/comparators"),
    curry = require("./../../shared/scripts/fun").curry,
    utils = require("./utils"),
    RQ = require("./vendor/rq").RQ,
    rq = require("./rq-fun"),

// Module dependencies, local application-specific
    norwegianSoccerLeagueService = require("./norwegian-soccer-service"),
    dbSchema = require("./db-schema"),
    TippekonkurranseData = require("./../../shared/scripts/app.models").TippekonkurranseData,
    appModels = require("./../../shared/scripts/app.models"),


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


    /**
     * // TODO: Describe and document! How generic is this? Move to utils?
     *
     * @param valueOrArrayArgs
     * @param targetArray
     * @param argIndex
     * @param argIndexCompensator
     * @returns {*}
     */
    _mergeArgsIntoArray = function (valueOrArrayArgs, targetArray, argIndex, argIndexCompensator) {
        "use strict";
        var i = 0,
            isArray = Array.isArray,
            calculatedScores;

        if (!argIndexCompensator) {
            argIndexCompensator = 0;
        }

        calculatedScores = valueOrArrayArgs[ argIndex - argIndexCompensator ];

        if (calculatedScores) {
            if (isArray(calculatedScores)) {
                for (; i < calculatedScores.length; i += 1) {
                    targetArray[ argIndex + i ] = calculatedScores[ i ];
                }
                argIndexCompensator = argIndexCompensator + calculatedScores.length - 1;
            } else {
                targetArray[ argIndex ] = calculatedScores;
            }
        }
        return argIndexCompensator;
    },


    _doublePlacingScores = function (description, placing, participantObj, tableIndexedByName) {
        "use strict";
        if (__.isEmpty(participantObj)) {
            console.warn("'" + description + "' property is missing");
            return 1000;
        }
        var opprykkTeamName1 = participantObj[ placing ];
        var opprykkTeamName2 = participantObj[ placing + 1 ];

        var actualTeamPlacing1 = tableIndexedByName[ opprykkTeamName1 ].no;
        var actualTeamPlacing2 = tableIndexedByName[ opprykkTeamName2 ].no;

        if ((actualTeamPlacing1 === placing + 1 || actualTeamPlacing1 === placing + 2) &&
            (actualTeamPlacing2 === placing + 1 || actualTeamPlacing2 === placing + 2)) {
            return -1;
        }
        return 0;
    },


    _calculateTippeligaScores = function (participantObj, indexedTippeligaTable, requestion, args) {
        "use strict";
        var i = 0,
            tableScore = 0,
            pallScore = 0,
            pallBonusScore = 0,
            nedrykkScore = 0;

        if (__.isEmpty(participantObj.tabell)) {
            console.warn("'Tabell' property is missing");
            return requestion([ 1000, 1000, 1000, 1000 ]);
        }

        for (; i < participantObj.tabell.length; i += 1) {
            try {
                var teamName = participantObj.tabell[ i ],
                    predictedTeamPlacing = i + 1,
                    actualTeamPlacing = indexedTippeligaTable[ teamName ].no;

                tableScore += _getTableScore(predictedTeamPlacing, actualTeamPlacing);

                pallScore += _getPallScore(predictedTeamPlacing, actualTeamPlacing);
                pallBonusScore += _getExtraPallScore(predictedTeamPlacing, pallScore);

            } catch (e) {
                var errorMessage = "Unable to calculate scores for team '" + participantObj.tabell[ i ] + "' for participant '" + participantObj.name + "' - probably illegal data format";
                console.warn(errorMessage);
                throw new Error(errorMessage);
                //return requestion([tableScore, pallScore, pallBonusScore, nedrykkScore], new Error(errorMessage));
                //return requestion(errorMessage, undefined);
                //return requestion(undefined, errorMessage);
            }
        }
        nedrykkScore = _doublePlacingScores("Nedrykk", 14, participantObj.tabell, indexedTippeligaTable);

        return requestion([ tableScore, pallScore, pallBonusScore, nedrykkScore ]);
    },


    _calculateOpprykkScores = function (participantObj, indexedAdeccoligaTable) {
        "use strict";
        return _doublePlacingScores("Opprykk", 0, participantObj.opprykk, indexedAdeccoligaTable);
    },


    _calculateToppscorerScores = function (participantObj, tippeligaToppscorer) {
        "use strict";
        var i = 0,
            toppscorerScore = 0;
        if (__.isEmpty(participantObj.toppscorer)) {
            console.warn("'Toppscorer' property is missing");
            return 1000;
        }
        for (; i < participantObj.toppscorer.length; i += 1) {
            if (i === 0 && __.contains(tippeligaToppscorer, participantObj.toppscorer[ i ])) {
                toppscorerScore = -1;
            }
        }
        return toppscorerScore;
    },


    _calculateCupScores = function (participantObj, remainingCupContenders) {
        "use strict";
        var i = 0,
            cupScore = 0;
        if (__.isEmpty(participantObj.cup)) {
            console.warn("'Cup' property is missing");
            return 1000;
        }
        for (; i < participantObj.cup.length; i += 1) {
            var teamName = participantObj.cup[ i ];
            if (i === 0 && __.contains(remainingCupContenders, teamName)) {
                cupScore = -1;
            }
        }
        return cupScore;
    },


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
    _storeTippeligaRound =
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

                if (!dbMatchesCount[ round ]) {
                    method = "CREATE";
                    logMsg += " is not yet stored";

                } else {
                    // TODO: Revisit logic, seems a bit strange!
                    // TODO: I tillegg, hvis Adeccoliga spiller runder mens Tippeliga ikke gjør det så blir ikke runden oppdatert ...

                    dbCount = dbMatchesCount[ round ].length;
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
                    {
                        tippeliga: currentTippeligaTable,
                        toppscorer: currentTippeligaToppscorer,
                        adeccoliga: currentAdeccoligaTable,
                        remainingCupContenders: currentRemainingCupContenders
                    },
                    { upsert: true, multi: false },
                    function () {
                        console.log(logMsg + ", " + currentRoundCount + " matches saved... OK");
                    }
                );
            }
        },


    _getStoredTippeligaDataRequestor = exports.getStoredTippeligaDataRequestor =
        function (year, round, requestion, args) {
            "use strict";
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
                                // TODO: Do something a bit more clever! Return custom requestion error? Redirect to latest completed round?
                                return requestion(undefined, "No data for round"); // => Blank screen ...
                            }
                            var tippekonkurranseData = new TippekonkurranseData();

                            tippekonkurranseData.isLive = false;

                            tippekonkurranseData.tippeligaTable = tippeligaRound.tippeliga;
                            tippekonkurranseData.tippeligaTopScorer = tippeligaRound.toppscorer;
                            tippekonkurranseData.adeccoligaTable = tippeligaRound.adeccoliga;
                            tippekonkurranseData.remainingCupContenders = tippeligaRound.remainingCupContenders;

                            tippekonkurranseData.round = tippeligaRound.round;
                            tippekonkurranseData.date = tippeligaRound.date;
                            tippekonkurranseData.currentRound = allTippeligaRounds.length;
                            tippekonkurranseData.currentDate = new Date();

                            tippekonkurranseData.matchesCountGrouping = null;
                            tippekonkurranseData.scores = null;

                            return requestion(tippekonkurranseData.toArray());
                        }
                    );
                }
            );
        },


    _addTeamAndNumberOfMatchesPlayedGrouping = exports.addTeamAndNumberOfMatchesPlayedGrouping =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            tippekonkurranseData.matchesCountGrouping = __.groupBy(tippekonkurranseData.tippeligaTable, "matches");
            return tippekonkurranseData.toArray();
        },


    _addRound = exports.addRound =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            if (!tippekonkurranseData.round) {
                var allMatchRoundsPresentInCurrentTippeligaTable = __.keys(tippekonkurranseData.matchesCountGrouping);
                tippekonkurranseData.round = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable);
            }
            return tippekonkurranseData.toArray();
        },


    _addCurrent = exports.addCurrent =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            if (!tippekonkurranseData.currentRound) {
                // Historic data already set in 'getStoredTippeligaDataRequestory' function
                if (tippekonkurranseData.isLive) {
                    tippekonkurranseData.currentRound = tippekonkurranseData.round;
                }
            }
            return tippekonkurranseData.toArray();
        },


    _addTippekonkurranseScoresRequestor = exports.addTippekonkurranseScoresRequestor =
        function (userPredictions, requestion, args) {
            "use strict";

            if (!userPredictions || (__.isEmpty(userPredictions))) {
                throw new Error("User predictions are missing - cannot calculate Tippekonkurranse scores");
            }
            if (!requestion) {
                throw new Error("Requestion argument is missing - check your RQ.js setup");
            }
            if (!args) {
                throw new Error("Requestion argument array is missing - check your RQ.js setup");
            }

            // Data holders
            var currentStanding = {},
                scoresRequestors = [],

            // The app-conventional argument ordering for tippekonkurranse scores requestors
                tabellScoreIndex = 0,
                pallScoreIndex = 1,
                pallBonusScoreIndex = 2,
                nedrykkScoreIndex = 3,
                toppscorerScoreIndex = 4,
                opprykkScoreIndex = 5,
                cupScoreIndex = 6,
                ratingIndex = 7,

                _sum = function (ratingIndex, requestion, scoresArray) {
                    var // Create 'scores' array - default value for all scores are 0
                        scores = __.range(ratingIndex).map(function () {
                            return 0;
                        }),
                        populateScores = curry(_mergeArgsIntoArray, scoresArray, scores);

                    return RQ.sequence([
                        rq.requestor(curry(populateScores, tabellScoreIndex)),
                        rq.requestor(curry(populateScores, toppscorerScoreIndex)),
                        rq.requestor(curry(populateScores, opprykkScoreIndex)),
                        rq.requestor(curry(populateScores, cupScoreIndex)),
                        rq.requestor(function () {
                            scores[ ratingIndex ] =
                                scores[ tabellScoreIndex ] +
                                scores[ pallScoreIndex ] +
                                scores[ pallBonusScoreIndex ] +
                                scores[ nedrykkScoreIndex ] +
                                scores[ toppscorerScoreIndex ] +
                                scores[ opprykkScoreIndex ] +
                                scores[ cupScoreIndex ];

                            return requestion(scores);
                        })
                    ])(rq.execute);
                },

                _defaultCurrentStandingUpdate = function (currentStanding, participant) {
                    currentStanding[ participant ] =
                        appModels.scoreModel.createObjectWith(
                            1000, 1000, 1000, 1000, 1000, 1000, 1000
                        );
                },

                _currentStandingUpdate = function (currentStanding, participant, scores) {
                    currentStanding[ participant ] =
                        appModels.scoreModel.createObjectWith(
                            scores[ tabellScoreIndex ],
                            scores[ pallScoreIndex ] + scores[ pallBonusScoreIndex ],
                            scores[ nedrykkScoreIndex ],
                            scores[ toppscorerScoreIndex ],
                            scores[ opprykkScoreIndex ],
                            scores[ cupScoreIndex ],
                            scores[ ratingIndex ]
                        );
                },

                _updateStandings = function (currentStanding, args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    tippekonkurranseData.scores = {
                        scores: currentStanding,
                        metadata: null
                    };
                    return tippekonkurranseData.toArray();
                };

            __.each(__.keys(userPredictions), function (participant) {
                var indexedTippeligaTable,
                    indexedAdeccoligaTable,
                    tippekonkurranseData = new TippekonkurranseData(args);

                if (__.isEmpty(userPredictions[ participant ])) {
                    scoresRequestors.push(
                        rq.requestor(curry(_defaultCurrentStandingUpdate, currentStanding, participant))
                    );

                } else {
                    // Create associative array with team name as key, by extracting 'name'
                    // => a team name-indexed data structure, optimized for point calculations
                    indexedTippeligaTable = __.indexBy(tippekonkurranseData.tippeligaTable, "name");
                    indexedAdeccoligaTable = __.indexBy(tippekonkurranseData.adeccoligaTable, "name");

                    // Key as property, nice to have
                    userPredictions[ participant ].name = participant;

                    scoresRequestors.push(
                        RQ.sequence([
                            RQ.parallel([
                                curry(_calculateTippeligaScores, userPredictions[ participant ], indexedTippeligaTable),
                                rq.requestor(curry(_calculateToppscorerScores, userPredictions[ participant ], tippekonkurranseData.tippeligaToppscorer)),
                                rq.requestor(curry(_calculateOpprykkScores, userPredictions[ participant ], indexedAdeccoligaTable)),
                                rq.requestor(curry(_calculateCupScores, userPredictions[ participant ], tippekonkurranseData.remainingCupContenders))
                            ]),
                            curry(_sum, ratingIndex),
                            rq.requestor(curry(_currentStandingUpdate, currentStanding, participant))
                        ])
                    );
                }
            });

            return RQ.sequence([
                RQ.parallel(scoresRequestors),
                curry(rq.interceptor, curry(_updateStandings, currentStanding), args),
                curry(rq.terminator, requestion)
            ])(rq.execute);
        },


    _addPreviousMatchRoundRatingToEachParticipantRequestor = exports.addPreviousMatchRoundRatingToEachParticipantRequestor =
        function (userPredictions, requestion, args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args),

                year = tippekonkurranseData.date.getFullYear(),
                previousRound = tippekonkurranseData.round - 1,
                getPreviousRoundTippeligaData = curry(_getStoredTippeligaDataRequestor, year, previousRound),
                addTippekonkurranseScores = curry(_addTippekonkurranseScoresRequestor, userPredictions),

                updatedScores = tippekonkurranseData.scores.scores,

                parentRequestion = requestion;

            if (previousRound <= 0) {
                return requestion(args);

            } else {
                return RQ.sequence([
                    getPreviousRoundTippeligaData,
                    rq.requestor(_addTeamAndNumberOfMatchesPlayedGrouping),
                    rq.requestor(_addRound),
                    addTippekonkurranseScores,
                    function (requestion, args) {
                        __.each(__.keys(updatedScores), function (participant) {
                            updatedScores[ participant ][ appModels.scoreModel.previousRatingPropertyName ] = args[ tippekonkurranseData.indexOfScores ].scores[ participant ][ appModels.scoreModel.ratingPropertyName ];
                        });
                        return requestion();
                    },
                    function (requestion, args) {
                        tippekonkurranseData.scores.scores = updatedScores;
                        return parentRequestion(tippekonkurranseData.toArray());
                    }
                ])(rq.execute);
            }
        },


    _addMetadataToScores = exports.addMetadataToScores =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            tippekonkurranseData.scores.metadata = {
                live: tippekonkurranseData.liveData,
                year: tippekonkurranseData.date.getFullYear(),
                round: tippekonkurranseData.round,
                date: tippekonkurranseData.date,
                currentYear: tippekonkurranseData.currentYear,
                currentRound: tippekonkurranseData.currentRound
            };
            return tippekonkurranseData.toArray();
        },


    _dispatchScoresToClientForPresentation = exports.dispatchScoresToClientForPresentation =
        function (response, args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            response.json(tippekonkurranseData.scores);
            return tippekonkurranseData.toArray();
        },


    _dispatchResultsToClientForPresentation = exports.dispatchResultsToClientForPresentation =
        function (response, args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            response.json({
                currentTippeligaTable: tippekonkurranseData.tippeligaTable,
                currentTippeligaToppscorer: tippekonkurranseData.tippeligaTopScorer,
                currentAdeccoligaTable: tippekonkurranseData.adeccoligaTable,
                currentRemainingCupContenders: tippekonkurranseData.remainingCupContenders,
                currentYear: tippekonkurranseData.date.getFullYear(),
                currentRound: tippekonkurranseData.round,
                currentDate: tippekonkurranseData.date
            });
            return tippekonkurranseData.toArray();
        },


    _storeTippeligaRoundMatchData = exports.storeTippeligaRoundMatchData =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            for (var round in tippekonkurranseData.matchesCountGrouping) {
                if (tippekonkurranseData.matchesCountGrouping.hasOwnProperty(round)) {
                    var roundNo = parseInt(round, 10),
                        currentMatchCountInRound = tippekonkurranseData.matchesCountGrouping[ round ].length,
                        conditionallyStoreTippeligaRound = curry(_storeTippeligaRound,
                            tippekonkurranseData.tippeligaTable,
                            tippekonkurranseData.tippeligaTopScorer,
                            tippekonkurranseData.adeccoligaTable,
                            tippekonkurranseData.remainingCupContenders,
                            tippekonkurranseData.getYear(),
                            tippekonkurranseData.round,
                            currentMatchCountInRound);

                    dbSchema.TippeligaRound
                        .findOne({ year: tippekonkurranseData.date.getFullYear(), round: roundNo })
                        .exec(conditionallyStoreTippeligaRound);
                }
            }
            return args;
        },


    _retrieveTippeligaDataRequestory = exports.retrieveTippeligaData =
        function (request) {
            "use strict";
            var year = request.params.year || new Date().getFullYear(),
                round = request.params.round,
                now,
                tippekonkurranseData;

            // Override with stored Tippeliga data => for statistics/history/development ...
            if (!round && env === "development") {
                if (root.overrideTippeligaDataWithRound) {
                    round = root.overrideTippeligaDataWithRound;
                    console.warn(utils.logPreamble() + "Overriding current Tippeliga results with stored data from year=" + year + " and round=" + round);
                }
            }

            if (year && round) {
                return curry(_getStoredTippeligaDataRequestor, year, round);

            } else {
                now = new Date();
                tippekonkurranseData = new TippekonkurranseData();

                tippekonkurranseData.isLive = rq.true;

                tippekonkurranseData.tippeligaTable = norwegianSoccerLeagueService.getCurrentTippeligaTable;
                tippekonkurranseData.tippeligaTopScorer = norwegianSoccerLeagueService.getCurrentTippeligaTopScorer;
                tippekonkurranseData.adeccoligaTable = norwegianSoccerLeagueService.getCurrentAdeccoligaTable;
                tippekonkurranseData.remainingCupContenders = norwegianSoccerLeagueService.getCurrentRemainingCupContenders;

                tippekonkurranseData.round = rq.null;
                tippekonkurranseData.date = rq.return(now);
                tippekonkurranseData.currentRound = rq.null;
                tippekonkurranseData.currentDate = rq.return(now);

                tippekonkurranseData.matchesCountGrouping = rq.null;
                tippekonkurranseData.scores = rq.null;

                return RQ.parallel(tippekonkurranseData.toArray());
            }
        };
