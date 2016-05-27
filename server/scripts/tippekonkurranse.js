/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    __ = require("underscore"),
    RQ = require("async-rq"),
    rq = require("rq-essentials"),

// Module dependencies, local generic
    comparators = require("./../../shared/scripts/comparators"),
    curry = require("./../../shared/scripts/fun").curry,
    utils = require("./../../shared/scripts/utils"),

// Module dependencies, local application-specific services
    dbSchema = require("./db-schema"),
    norwegianSoccerLeagueService = require("./norwegian-soccer-service"),
    predictions2014 = require("./tippekonkurranse-2014-user-predictions").predictions,
    predictions2015 = require("./tippekonkurranse-2015-user-predictions").predictions,
    predictions2016 = require("./tippekonkurranse-2016-user-predictions").predictions,
    rules2014 = require("./tippekonkurranse-2014-rules").rules,
    rules2015 = require("./tippekonkurranse-2015-rules").rules,
    rules2016 = require("./tippekonkurranse-2016-rules").rules,

// Module dependencies, local application-specific
    appModels = require("./../../shared/scripts/app.models"),

    TippekonkurranseData = appModels.TippekonkurranseData,

    _predictions = exports.predictions = {
        2014: predictions2014,
        2015: predictions2015,
        2016: predictions2016
    },

    _rules = exports.rules = {
        2014: rules2014,
        2015: rules2015,
        2016: rules2016
    },


    _calculateTippeligaScores =
        function (strategy, participantObj, tippeligaTable) {
            "use strict";
            var tableScore, pallScore, pallBonusScore, nedrykkScore, indexedTippeligaTable;

            if (__.isEmpty(participantObj.tabell)) {
                console.warn(utils.logPreamble() + "'Tabell' property is missing, returning 1000 points for all predictions ...");
                return [1000, 1000, 1000, 1000];
            }

            // Create associative array with team name as key, by extracting 'name'
            // => a team-name-indexed data structure
            indexedTippeligaTable = __.indexBy(tippeligaTable, "name");

            tableScore = __.reduce(participantObj.tabell, function (memo, teamName, index) {
                try {
                    var predictedTeamPlacing = index + 1,
                        actualTeamPlacing = indexedTippeligaTable[teamName].no;

                    return memo + utils.getDisplacementPoints(strategy.tabellScoresStrategy.polarity, strategy.tabellScoresStrategy.weight,
                            predictedTeamPlacing,
                            actualTeamPlacing);
                } catch (e) {
                    var errorMessage = utils.logPreamble() + "Unable to calculate scores for team '" + participantObj.tabell[index] + "' for participant '" + participantObj.name + "' - probably illegal data format";
                    console.warn(errorMessage);
                    throw new Error(errorMessage);
                }
            }, 0);

            pallScore =
                utils.getMatchPoints(strategy.pall1ScoreStrategy.polarity, strategy.pall1ScoreStrategy.weight,
                    participantObj.tabell[0], tippeligaTable[0].name) +
                utils.getMatchPoints(strategy.pall2ScoreStrategy.polarity, strategy.pall2ScoreStrategy.weight,
                    participantObj.tabell[1], tippeligaTable[1].name) +
                utils.getMatchPoints(strategy.pall3ScoreStrategy.polarity, strategy.pall3ScoreStrategy.weight,
                    participantObj.tabell[2], tippeligaTable[2].name);

            pallBonusScore = utils.getMatchPoints(strategy.pallBonusScoreStrategy.polarity, strategy.pallBonusScoreStrategy.weight,
                [participantObj.tabell[0], participantObj.tabell[1], participantObj.tabell[2]],
                [tippeligaTable[0].name, tippeligaTable[1].name, tippeligaTable[2].name]
            );

            nedrykkScore = utils.getPresentPoints(strategy.nedrykkScoreStrategy.polarity, strategy.nedrykkScoreStrategy.weight,
                [participantObj.tabell[14], participantObj.tabell[15]],
                [tippeligaTable[14].name, tippeligaTable[15].name]
            );

            return [tableScore, pallScore, pallBonusScore, nedrykkScore];
        },


    _calculateOpprykkScores =
        function (strategy, participantObj, obosligaTable) {
            "use strict";
            if (__.isEmpty(participantObj.opprykk)) {
                console.warn(utils.logPreamble() + "'Opprykk' property is missing");
                return 1000;
            }
            /* jshint -W035 */
            if (!obosligaTable) {
                //console.warn(JSON.stringify(strategy));
                //console.warn(JSON.stringify(participantObj));
                //console.warn(JSON.stringify(obosligaTable));
            } else {
                //console.log(JSON.stringify(strategy));
                //console.log(JSON.stringify(participantObj));
                //console.log(JSON.stringify(obosligaTable));
                return utils.getPresentPoints(strategy.opprykkScoreStrategy.polarity, strategy.opprykkScoreStrategy.weight,
                    [participantObj.opprykk[0], participantObj.opprykk[1]],
                    [obosligaTable[0].name, obosligaTable[1].name]
                );
            }
        },


    _calculateToppscorerScores =
        function (strategy, participantObj, tippeligaToppscorer) {
            "use strict";
            if (__.isEmpty(participantObj.toppscorer)) {
                console.warn(utils.logPreamble() + "'Toppscorer' property is missing");
                return 1000;
            }
            return utils.getPresentPoints(strategy.toppscorerScoreStrategy.polarity, strategy.toppscorerScoreStrategy.weight,
                participantObj.toppscorer[0],
                tippeligaToppscorer
            );
        },


    _calculateCupScores =
        function (strategy, participantObj, remainingCupContenders) {
            "use strict";
            if (__.isEmpty(participantObj.cup)) {
                console.warn(utils.logPreamble() + "'Cup' property is missing");
                return 1000;
            }
            return utils.getPresentPoints(strategy.cupScoreStrategy.polarity, strategy.cupScoreStrategy.weight,
                participantObj.cup[0],
                remainingCupContenders
            );
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
        function (currentTippeligaTable, currentTippeligaToppscorer, currentObosligaTable, currentRemainingCupContenders, year, round, currentRoundCount, mongoDbErr, storedTippeligaRound) {
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
                    // TODO: Liten svakhet: Hvis OBOS-liga har runde mens Tippeliga ikke har det så blir ikke runden oppdatert ...

                    dbCount = dbMatchesCount[round].length;
                    if (root.app.isCompletedRound(round, year)) {
                        logMsg += " is completed => no need for updating db with new results";
                        console.log(logMsg);

                    } else if (currentRoundCount < dbCount) {
                        logMsg += " is already stored for " + dbCount + " teams - current data has " + currentRoundCount + " teams";
                        console.log(logMsg + " => no need for updating db with new results");

                    } else {
                        method = "UPDATE";
                        logMsg += " is already stored for " + dbCount + " teams - current data has " + currentRoundCount + " teams";
                    }
                }
            }
            if (method) {
                dbSchema.TippeligaRound.update(
                    { year: year, round: parseInt(round, 10) },
                    {
                        tippeliga: currentTippeligaTable,
                        toppscorer: currentTippeligaToppscorer,
                        obosliga: currentObosligaTable,
                        remainingCupContenders: currentRemainingCupContenders,
                        date: new Date() // Which as you see should be named 'documentLastModificationTimestamp'
                    },
                    { upsert: true, multi: false },
                    function () {
                        console.log(logMsg + ", " + currentRoundCount + " teams saved... OK");
                    }
                );
            }
        },


    _getStoredTippeligaDataRequestor = exports.getStoredTippeligaDataRequestor =
        function (year, round, callback, args) {
            "use strict";
            dbSchema.TippeligaRound.find({ year: year }).exec(
                function (err, allTippeligaRounds) {
                    if (err) {
                        return callback(undefined, err);
                    }
                    dbSchema.TippeligaRound.findOne({ year: year, round: round }).exec(
                        function (err, tippeligaRound) {
                            if (err) {
                                return callback(undefined, err); // => Blank screen ...
                            }

                            var tippekonkurranseData = new TippekonkurranseData();

                            tippekonkurranseData.isHistoricDataAvailable = root.app.isDbConnected;
                            tippekonkurranseData.isLiveDataAvailable = root.app.isLiveDataAvailable;
                            tippekonkurranseData.isLive = false;
                            tippekonkurranseData.matchesCountGrouping = null;
                            tippekonkurranseData.scores = null;

                            if (tippeligaRound) {
                                tippekonkurranseData.tippeligaTable = tippeligaRound.tippeliga;
                                tippekonkurranseData.tippeligaTopScorer = tippeligaRound.toppscorer;
                                tippekonkurranseData.obosligaTable = tippeligaRound.obosliga;
                                tippekonkurranseData.remainingCupContenders = tippeligaRound.remainingCupContenders;

                                tippekonkurranseData.round = tippeligaRound.round;
                                tippekonkurranseData.date = tippeligaRound.date;

                                tippekonkurranseData.currentRound = allTippeligaRounds.length;
                                //tippekonkurranseData.currentDate = new Date();

                            } else {
                                //tippekonkurranseData.tippeligaTable = null;
                                //tippekonkurranseData.tippeligaTopScorer = null;
                                //tippekonkurranseData.obosligaTable = null;
                                //tippekonkurranseData.remainingCupContenders = null;

                                //tippekonkurranseData.round = 0;
                                tippekonkurranseData.date = new Date(); // Cannot be null

                                //tippekonkurranseData.currentRound = 0;
                                //tippekonkurranseData.currentDate = new Date();
                            }

                            // Workaround for strangely missing stored 'date' property for some rounds ...
                            if (!tippekonkurranseData.date) {
                                tippekonkurranseData.date = tippeligaRound._id.getTimestamp();
                            }

                            return callback(tippekonkurranseData.toArray());
                        }
                    );
                }
            );
        },


    _retrieveTippeligaDataRequestory = exports.retrieveTippeligaData =
        function (request) {
            "use strict";
            var year = request.params.year || root.app.currentYear,
                round = request.params.round,
                now,
                tippekonkurranseData;

            // Override with stored Tippeliga data => for statistics/history/development ...
            if (!round && env === "development") {
                if (root.app.overrideTippeligaDataWithRound) {
                    round = root.app.overrideTippeligaDataWithRound;
                    console.warn(utils.logPreamble() + "Overriding current Tippeliga results with stored data from year=" + year + " and round=" + round);
                }
            }

            if (root.app.isCompletedRound(round, year)) {
                return curry(_getStoredTippeligaDataRequestor, year, round);

            } else if (!root.app.isLiveDataAvailable) {
                //console.error(utils.logPreamble() + "Live soccer result data not available ...");
                //response.status(503).send("Live soccer result data not available");
                //return;
                now = new Date();

                tippekonkurranseData = new TippekonkurranseData();

                tippekonkurranseData.isHistoricDataAvailable = rq.return(root.app.isDbConnected);
                tippekonkurranseData.isLiveDataAvailable = rq.false;
                tippekonkurranseData.isLive = rq.false;

                tippekonkurranseData.tippeligaTable = rq.null;
                tippekonkurranseData.tippeligaTopScorer = rq.null;
                tippekonkurranseData.obosligaTable = rq.null;
                tippekonkurranseData.remainingCupContenders = rq.null;

                tippekonkurranseData.round = rq.null;
                tippekonkurranseData.date = rq.return(now);
                tippekonkurranseData.currentRound = rq.null;
                tippekonkurranseData.currentDate = rq.return(now);

                tippekonkurranseData.matchesCountGrouping = rq.null;
                tippekonkurranseData.scores = rq.return({});

                return RQ.parallel(tippekonkurranseData.toArray());

            } else {
                now = new Date();

                tippekonkurranseData = new TippekonkurranseData();

                tippekonkurranseData.isHistoricDataAvailable = rq.return(root.app.isDbConnected);
                tippekonkurranseData.isLiveDataAvailable = rq.return(root.app.isLiveDataAvailable);
                tippekonkurranseData.isLive = rq.true;

                tippekonkurranseData.tippeligaTable = norwegianSoccerLeagueService.getCurrentTippeligaTable;
                tippekonkurranseData.tippeligaTopScorer = norwegianSoccerLeagueService.getCurrentTippeligaTopScorer;
                tippekonkurranseData.obosligaTable = norwegianSoccerLeagueService.getCurrentObosligaTable;
                tippekonkurranseData.remainingCupContenders = norwegianSoccerLeagueService.getCurrentRemainingCupContenders;

                tippekonkurranseData.round = rq.null;
                tippekonkurranseData.date = rq.return(now);
                tippekonkurranseData.currentRound = rq.null;
                tippekonkurranseData.currentDate = rq.return(now);

                tippekonkurranseData.matchesCountGrouping = rq.null;
                tippekonkurranseData.scores = rq.null;

                return RQ.parallel(tippekonkurranseData.toArray());
            }
        },


    /**
     * NB! The presence of the property 'matchesCountGrouping' is a prerequisite for data to be stored.
     */
    _addGroupingOfTeamAndNumberOfMatchesPlayed = exports.addGroupingOfTeamAndNumberOfMatchesPlayed =
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
            if (!args) {
                throw new Error("Requestion argument array is missing - check your RQ.js setup");
            }
            if (tippekonkurranseData.isLive) {
                if (tippekonkurranseData.round) {
                    throw new Error("Round is already set, it shouldn't be - it is the sole responsibility of this function");

                } else {
                    var allMatchRoundsPresentInCurrentTippeligaTable = __.keys(tippekonkurranseData.matchesCountGrouping);
                    tippekonkurranseData.round = Math.max.apply(null, allMatchRoundsPresentInCurrentTippeligaTable);
                }

                if (tippekonkurranseData.currentRound) {
                    throw new Error("Current round is already set, it shouldn't be - it is the sole responsibility of this function");

                } else {
                    tippekonkurranseData.currentRound = tippekonkurranseData.round;
                    // Current round is a dynamic value, nice to have it around/available
                    if (root.app.currentRound < tippekonkurranseData.currentRound) {
                        root.app.currentRound = tippekonkurranseData.currentRound;
                    }
                }

                //} else {
                // Historic data already set in 'getStoredTippeligaDataRequestory' function
                // TODO: Needed?
                //if (!tippekonkurranseData.round) {
                //    throw new Error("Round is not set, it should be");
                //}
                //if (!tippekonkurranseData.currentRound) {
                //    throw new Error("Current round is not set, it should be");
                //}
                //} else if (!tippekonkurranseData.isLiveDataAvailable && !tippekonkurranseData.isHistoricDataAvailable) {
                //    tippekonkurranseData.round = root.app.currentRound;
                //    tippekonkurranseData.currentRound = tippekonkurranseData.round;

                //} else if (!tippekonkurranseData.isLiveDataAvailable && tippekonkurranseData.isHistoricDataAvailable) {
                //    tippekonkurranseData.currentRound = tippekonkurranseData.round;
            }
            return tippekonkurranseData.toArray();
        },


// TODO: This function is close to unreadable / unmanageable ... the truth is in there somewhere
// TODO: Get rid of the requestion argument somehow
    _addTippekonkurranseScoresRequestor = exports.addTippekonkurranseScoresRequestor =
        function (userPredictions, rules, callback, args) {
            "use strict";
            if (!userPredictions || __.isEmpty(userPredictions)) {
                throw new Error("User predictions are missing - cannot calculate Tippekonkurranse scores");
            }
            if (!rules || __.isEmpty(rules)) {
                throw new Error("Rules are missing - cannot calculate Tippekonkurranse scores");
            }
            //if (!root.app.isLiveDataAvailable) {
            //    console.error(utils.logPreamble() + "Live soccer result data not available ...");
            //response.status(503).send("Live soccer result data not available");
            //return;
            //throw new Error("Live soccer result data not available ...");
            //}
            if (!callback) {
                throw new Error("RQ callback argument is missing - check your RQ setup");
            }
            if (!args) {
                throw new Error("RQ callback argument array is missing - check your RQ setup");
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

                _sum = function (ratingIndex, callback, scoresArray) {
                    var // Create 'scores' array - default value for all scores are 0
                        scores = __.range(ratingIndex).map(function () {
                            return 0;
                        }),
                        populateScores = curry(utils.mergeArgsIntoArray, scoresArray, scores);

                    return RQ.sequence([
                        rq.requestorize(curry(populateScores, tabellScoreIndex)),
                        rq.requestorize(curry(populateScores, toppscorerScoreIndex)),
                        rq.requestorize(curry(populateScores, opprykkScoreIndex)),
                        rq.requestorize(curry(populateScores, cupScoreIndex)),
                        rq.requestorize(function () {
                            scores[ratingIndex] =
                                scores[tabellScoreIndex] +
                                scores[pallScoreIndex] +
                                scores[pallBonusScoreIndex] +
                                scores[nedrykkScoreIndex] +
                                scores[toppscorerScoreIndex] +
                                scores[opprykkScoreIndex] +
                                scores[cupScoreIndex];

                            return callback(scores);
                        })
                    ])(rq.execute);
                },

                _defaultCurrentStandingUpdate = function (currentStanding, participant) {
                    currentStanding[participant] =
                        appModels.scoreModel.createObjectWith(
                            1000, 1000, 1000, 1000, 1000, 1000, 1000
                        );
                },

                _currentStandingUpdate = function (currentStanding, participant, scores) {
                    currentStanding[participant] =
                        appModels.scoreModel.createObjectWith(
                            scores[tabellScoreIndex],
                            scores[pallScoreIndex] + scores[pallBonusScoreIndex],
                            scores[nedrykkScoreIndex],
                            scores[toppscorerScoreIndex],
                            scores[opprykkScoreIndex],
                            scores[cupScoreIndex],
                            scores[ratingIndex]
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
                var tippekonkurranseData = new TippekonkurranseData(args);

                if (__.isEmpty(userPredictions[participant])) {
                    scoresRequestors.push(
                        rq.requestorize(curry(_defaultCurrentStandingUpdate, currentStanding, participant))
                    );

                } else {
                    // Key as property, nice to have
                    userPredictions[participant].name = participant;

                    scoresRequestors.push(
                        RQ.sequence([
                            RQ.parallel([
                                rq.requestorize(curry(_calculateTippeligaScores, rules, userPredictions[participant], tippekonkurranseData.tippeligaTable)),
                                rq.requestorize(curry(_calculateToppscorerScores, rules, userPredictions[participant], tippekonkurranseData.tippeligaTopScorer)),
                                rq.requestorize(curry(_calculateOpprykkScores, rules, userPredictions[participant], tippekonkurranseData.obosligaTable)),
                                rq.requestorize(curry(_calculateCupScores, rules, userPredictions[participant], tippekonkurranseData.remainingCupContenders))
                            ]),
                            curry(_sum, ratingIndex),
                            rq.requestorize(curry(_currentStandingUpdate, currentStanding, participant))
                        ])
                    );
                }
            });

            return RQ.sequence([
                RQ.parallel(scoresRequestors),
                curry(rq.interceptor, curry(_updateStandings, currentStanding), args),
                curry(rq.terminator, callback)
            ])(rq.execute);
        },


// TODO: Get rid of the RQ callback argument somehow
    _addPreviousMatchRoundRatingToEachParticipantRequestor = exports.addPreviousMatchRoundRatingToEachParticipantRequestor =
        function (userPredictions, scoresStrategy, callback, args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args),

                year = tippekonkurranseData.getYear(),
                previousRound = tippekonkurranseData.round - 1,
                getPreviousRoundTippeligaData = curry(_getStoredTippeligaDataRequestor, year, previousRound),
                addTippekonkurranseScores = curry(_addTippekonkurranseScoresRequestor, userPredictions, scoresStrategy),

                parentRequestion = callback;

            if (previousRound <= 0) {
                return parentRequestion(args);

            } else {
                return RQ.sequence([
                    getPreviousRoundTippeligaData,
                    rq.requestorize(_addGroupingOfTeamAndNumberOfMatchesPlayed),
                    rq.requestorize(_addRound),
                    addTippekonkurranseScores,
                    function (callback, args) {
                        __.each(__.keys(tippekonkurranseData.scores.scores), function (participant) {
                            tippekonkurranseData.scores.scores[participant][appModels.scoreModel.previousRatingPropertyName] = args[tippekonkurranseData.indexOfScores].scores[participant][appModels.scoreModel.ratingPropertyName];
                        });
                        return callback();
                    },
                    function (callback, args) {
                        return parentRequestion(tippekonkurranseData.toArray());
                    }
                ])(rq.execute);
            }
        },


    _addMetadataToScores = exports.addMetadataToScores =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args),
                hasPredictions = {};

            tippekonkurranseData.scores.metadata = {
                isHistoricDataAvailable: tippekonkurranseData.isHistoricDataAvailable,
                isLiveDataAvailable: tippekonkurranseData.isLiveDataAvailable,
                isLive: tippekonkurranseData.isLive,
                year: tippekonkurranseData.getYear(),
                round: tippekonkurranseData.round,
                currentYear: tippekonkurranseData.currentYear,
                currentRound: tippekonkurranseData.currentRound
            };

            // Is user's predictions in place?
            __.each(_predictions[tippekonkurranseData.scores.metadata.year], function (participantPredictions, participant) {
                hasPredictions[participant] = participantPredictions.tabell.length > 0;
            });
            tippekonkurranseData.scores.metadata.hasPredictions = hasPredictions;

            return tippekonkurranseData.toArray();
        },


    _dispatchScoresToClientForPresentation = exports.dispatchScoresToClientForPresentation =
        function (response, args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            response.json(tippekonkurranseData.scores);
            return args;
        },


    _dispatchResultsToClientForPresentation = exports.dispatchResultsToClientForPresentation =
        function (response, args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);
            response.json({
                currentTippeligaTable: tippekonkurranseData.tippeligaTable,
                currentTippeligaToppscorer: tippekonkurranseData.tippeligaTopScorer,
                currentObosligaTable: tippekonkurranseData.obosligaTable,
                currentRemainingCupContenders: tippekonkurranseData.remainingCupContenders,
                currentYear: tippekonkurranseData.getYear(),
                currentRound: tippekonkurranseData.round,
                currentDate: tippekonkurranseData.date
            });
            return args;
        },


    _storeTippeligaRoundMatchData = exports.storeTippeligaRoundMatchData =
        function (args) {
            "use strict";
            var tippekonkurranseData = new TippekonkurranseData(args);

            if (tippekonkurranseData.matchesCountGrouping &&
                tippekonkurranseData.matchesCountGrouping.hasOwnProperty(tippekonkurranseData.round)) {

                var roundNo = parseInt(tippekonkurranseData.round, 10),
                    currentMatchCountInRound = tippekonkurranseData.matchesCountGrouping[tippekonkurranseData.round].length,
                    conditionallyStoreTippeligaRound = curry(_storeTippeligaRound,
                        tippekonkurranseData.tippeligaTable,
                        tippekonkurranseData.tippeligaTopScorer,
                        tippekonkurranseData.obosligaTable,
                        tippekonkurranseData.remainingCupContenders,
                        tippekonkurranseData.getYear(),
                        tippekonkurranseData.round,
                        currentMatchCountInRound);

                dbSchema.TippeligaRound
                    .findOne({ year: tippekonkurranseData.getYear(), round: roundNo })
                    .exec(conditionallyStoreTippeligaRound);
            }
            return args;
        };
