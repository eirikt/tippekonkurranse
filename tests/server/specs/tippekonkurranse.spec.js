/* global require:false, describe:false, beforeEach:false, it:false, root:false */
/* jshint -W030 */

var __ = require("underscore"),

    expect = require("chai").expect,
    rq = require("rq-essentials"),

    Comparators = require('../../../shared/scripts/comparators'),
    curry = require("../../../shared/scripts/fun").curry,
    maxDisplacementSumInPermutationOfLength = require("../../../shared/scripts/utils").maxDisplacementSumInPermutationOfLength,

    TeamPlacement = require("../../../shared/scripts/app.models").TeamPlacement,
    TippekonkurranseData = require("../../../shared/scripts/app.models").TippekonkurranseData,
    tippekonkurranse = require("../../../server/scripts/tippekonkurranse"),

    addRound = tippekonkurranse.addRound,
    addTippekonkurranseScoresRequestor = tippekonkurranse.addTippekonkurranseScoresRequestor,

    predictions2014 = tippekonkurranse.predictions[2014],
    rules2014 = tippekonkurranse.rules[2014],

    predictions2015 = tippekonkurranse.predictions[2015],
    rules2015 = tippekonkurranse.rules[2015],

    predictions2016 = tippekonkurranse.predictions[2016],
    rules2016 = tippekonkurranse.rules[2016],

    addTippekonkurranseScores2014 = curry(addTippekonkurranseScoresRequestor, predictions2014, rules2014),
    addTippekonkurranseScores2015 = curry(addTippekonkurranseScoresRequestor, predictions2015, rules2015),
    addTippekonkurranseScores2016 = curry(addTippekonkurranseScoresRequestor, predictions2016, rules2016),

    expectDefaultGlobalStatePreserved = function () {
        "use strict";
        expect(root.currentRound).is.null;
    };


describe("Tippekonkurranse", function () {
    "use strict";

    describe("Underlying basics", function () {
        it("should ensure (native) sorting of number strings", function () {
            expect(Math.max.apply(null, ["1", "2"])).to.equal(2);
            expect(Math.max.apply(null, ["0", "4", "9"])).to.equal(9);
            expect(Math.max.apply(null, ["8", "9", "10"])).to.equal(10);
            expect(Math.max.apply(null, ["02", "009", "10", "103"])).to.equal(103);
        });
    });

    describe("addRound", function () {
        beforeEach(function () {
            // Global state
            root.currentYear = new Date().getFullYear();
            root.currentRound = null;
            //root.isCurrentRoundCompleted = false;
        });

        it("should throw error if no requestion argument is provided", function () {
            expect(addRound).to.throw(Error, "Requestion argument array is missing - check your RQ.js setup");
        });

        it("should throw error if live data and round is already present", function () {
            var args = new TippekonkurranseData();
            args.isLive = true;
            args.round = 1;
            expect(curry(addRound, args.toArray())).to.throw(Error, "Round is already set, it shouldn't be - it is the sole responsibility of this function");
            expectDefaultGlobalStatePreserved();
        });

        it("should throw error if live data and current round is already present", function () {
            var args = new TippekonkurranseData();
            args.isLive = true;
            args.currentRound = 1;
            expect(curry(addRound, args.toArray())).to.throw(Error, "Current round is already set, it shouldn't be - it is the sole responsibility of this function");
            expectDefaultGlobalStatePreserved();
        });

        // Error throwing deactivated for this one ...
        //it("should throw error if not live data and round is not already present", function () {
        //    var args = new TippekonkurranseData();
        //    args.isLive = false;
        //    expect(curry(addRound, args.toArray())).to.throw(Error, "Round is not set, it should be");
        //    expectDefaultGlobalStatePreserved();
        //});

        // Error throwing deactivated for this one ...
        //it("should throw error if not live data and current round not is already present", function () {
        //    var args = new TippekonkurranseData();
        //    args.isLive = false;
        //    args.round = 1;
        //    expect(curry(addRound, args.toArray())).to.throw(Error, "Current round is not set, it should be");
        //    expectDefaultGlobalStatePreserved();
        //});
    });


    describe("addTippekonkurranseScores requestor", function () {

        it("should throw error if no user predictions are provided", function () {
            expect(addTippekonkurranseScoresRequestor).to.throw(Error, "User predictions are missing - cannot calculate Tippekonkurranse scores");
        });


        it("should throw error if no requestion argument is provided", function () {
            expect(addTippekonkurranseScores2014).to.throw(Error, "RQ callback argument is missing - check your RQ setup");
        });


        it("should throw error if no argument array is provided", function () {
            expect(curry(addTippekonkurranseScores2014, rq.execute)).to.throw(Error, "RQ callback argument array is missing - check your RQ setup");
        });


        it("should throw error if null as user predictions are provided", function () {
            var userPredictions = null,
                requestion = null,
                args = null,
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, requestion, args);

            expect(addTippekonkurranseScores).to.throw(Error, "User predictions are missing - cannot calculate Tippekonkurranse scores");
        });


        it("should throw error if empty user prediction object is provided", function () {
            var userPredictions = {},
                requestion = null,
                args = null,
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, requestion, args);

            expect(addTippekonkurranseScores).to.throw(Error, "User predictions are missing - cannot calculate Tippekonkurranse scores");
        });


        it("should return scores-of-more-than-999 (meaning: missing predictions) if null user prediction property is provided", function (done) {
            var userPredictions = {
                    john: null
                },
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                verify = function (args) {
                    expect(args).to.exist;
                    expect(args).to.be.an.object;
                    expect(args).to.not.be.an.empty.object;

                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores).to.exist;
                    expect(tippekonkurranseData.scores).to.be.an.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(tippekonkurranseData.scores.scores).not.to.be.an.empty.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(JSON.stringify(tippekonkurranseData.scores.scores)).to.be.equal(
                        JSON.stringify({
                            john: {
                                tabell: 1000,
                                pall: 1000,
                                nedrykk: 1000,
                                toppscorer: 1000,
                                opprykk: 1000,
                                cup: 1000,
                                rating: 1000
                            }
                        })
                    );
                },
                args = [];

            rq.mocha.executeAndVerify(addTippekonkurranseScores, args, verify, done);
        });


        it("should return scores-of-more-than-999 (meaning: missing predictions) if empty user prediction property is provided", function (done) {
            var userPredictions = {
                    john: {}
                },
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                verify = function (args) {
                    expect(args).to.exist;
                    expect(args).to.be.an.object;
                    expect(args).to.not.be.an.empty.object;

                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores).to.exist;
                    expect(tippekonkurranseData.scores).to.be.an.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(tippekonkurranseData.scores.scores).not.to.be.an.empty.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(JSON.stringify(tippekonkurranseData.scores.scores)).to.be.equal(
                        JSON.stringify({
                            john: {
                                tabell: 1000,
                                pall: 1000,
                                nedrykk: 1000,
                                toppscorer: 1000,
                                opprykk: 1000,
                                cup: 1000,
                                rating: 1000
                            }
                        })
                    );
                },
                args = [];

            rq.mocha.executeAndVerify(addTippekonkurranseScores, args, verify, done);
        });


        it("should return scores-of-more-than-999 (meaning: missing predictions) if non-complete user prediction property is provided (1)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null
                    }
                },
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                verify = function (args) {
                    expect(args).to.exist;
                    expect(args).to.be.an.object;
                    expect(args).to.not.be.an.empty.object;

                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores).to.exist;
                    expect(tippekonkurranseData.scores).to.be.an.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(tippekonkurranseData.scores.scores).not.to.be.an.empty.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(JSON.stringify(tippekonkurranseData.scores.scores)).to.be.equal(
                        JSON.stringify({
                            john: {
                                tabell: 1000,
                                pall: 2000,
                                nedrykk: 1000,
                                toppscorer: 1000,
                                opprykk: 1000,
                                cup: 1000,
                                rating: 7000
                            }
                        })
                    );
                },
                args = [];

            rq.mocha.executeAndVerify(addTippekonkurranseScores, args, verify, done);
        });


        it("should return scores-of-more-than-999 (meaning: missing predictions) if non-complete user prediction property is provided (2)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [],
                        toppscorer: undefined,
                        opprykk: null,
                        cup: []
                    }
                },
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                verify = function (args) {
                    expect(args).to.exist;
                    expect(args).to.be.an.object;
                    expect(args).to.not.be.an.empty.object;

                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores).to.exist;
                    expect(tippekonkurranseData.scores).to.be.an.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(tippekonkurranseData.scores.scores).not.to.be.an.empty.object;
                    expect(tippekonkurranseData.scores.metadata).to.be.null;
                    expect(JSON.stringify(tippekonkurranseData.scores.scores)).to.be.equal(
                        JSON.stringify({
                            john: {
                                tabell: 1000,
                                pall: 2000,
                                nedrykk: 1000,
                                toppscorer: 1000,
                                opprykk: 1000,
                                cup: 1000,
                                rating: 7000
                            }
                        })
                    );
                },
                args = [];

            rq.mocha.executeAndVerify(addTippekonkurranseScores, args, verify, done);
        });


        // TODO: Struggling with this one ...
        /*
         it("should throw error if retrieved table data deviates from user prediction data", function (done) {
         var userPredictions = {
         john: {
         tabell: [ "TeamA", "TeamB" ],
         toppscorer: null,
         opprykk: null,
         cup: null
         }
         },
         actualTable = [
         { name: "TeamA" },
         { name: "TeamC" }
         ],
         requestion = rq.execute,
         //verify = rq.execute,
         verify = function () {
         var e = 3;
         },

         args = [],
         addTippekonkurranseScores;

         args[ TippekonkurranseData.indexOfTippeligaTable ] = actualTable;

         addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules);//, requestion, args);

         //try {
         //    addTippekonkurranseScores();
         //} catch (e) {
         //    expect(e.message).to.equal("Unable to calculate scores for team 'TeamB' for participant 'john' - probably illegal data format");
         //    done();
         //}

         //try {
         rq.executeAndVerify(addTippekonkurranseScores, verify, done, args);
         //} catch (e) {
         //    expect(e.message).to.equal("Unable to calculate scores for team 'TeamB' for participant 'john' - probably illegal data format");
         //    done();
         //}
         });
         */
    });


    describe("'Tabell' penalty points calculations", function () {

        it("should have 0 as minimum penalty points", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "Strømsgodset",
                            "Rosenborg",
                            "Haugesund",
                            "Aalesund",
                            "Viking",
                            "Molde",
                            "Odd",
                            "Brann",
                            "Start",
                            "Lillestrøm",
                            "Vålerenga",
                            "Sogndal",
                            "Sandnes Ulf",
                            "Sarpsborg 08",
                            "Tromsø",
                            "Hønefoss"
                        ]
                    }
                },
                actualTable = [
                    { name: "Strømsgodset", no: 1, matches: 30 },
                    { name: "Rosenborg", no: 2, matches: 30 },
                    { name: "Haugesund", no: 3, matches: 30 },
                    { name: "Aalesund", no: 4, matches: 30 },
                    { name: "Viking", no: 5, matches: 30 },
                    { name: "Molde", no: 6, matches: 30 },
                    { name: "Odd", no: 7, matches: 30 },
                    { name: "Brann", no: 8, matches: 30 },
                    { name: "Start", no: 9, matches: 30 },
                    { name: "Lillestrøm", no: 10, matches: 30 },
                    { name: "Vålerenga", no: 11, matches: 30 },
                    { name: "Sogndal", no: 12, matches: 30 },
                    { name: "Sandnes Ulf", no: 13, matches: 30 },
                    { name: "Sarpsborg 08", no: 14, matches: 30 },
                    { name: "Tromsø", no: 15, matches: 30 },
                    { name: "Hønefoss", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    var perfectPrediction = tippekonkurranseData.scores;

                    expect(perfectPrediction.scores.john.tabell).to.equal(0);
                    expect(perfectPrediction.scores.john.pall).to.equal(-4);
                    expect(perfectPrediction.scores.john.nedrykk).to.equal(-1);
                };

            inputArgs.tippeligaTable = actualTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give 1 penalty point for each table placing deviation, 2 points", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "Strømsgodset",
                            "Rosenborg",
                            "Haugesund",
                            "Aalesund",
                            "Viking",
                            "Molde",
                            "Odd",
                            "Brann",
                            "Start",
                            "Lillestrøm",
                            "Vålerenga",
                            "Sogndal",
                            "Sandnes Ulf",
                            "Sarpsborg 08",
                            "Tromsø",
                            "Hønefoss"
                        ]
                    }
                },
                twoPenaltyPoints = [
                    { name: "Rosenborg", no: 1, matches: 30 },      // Switched
                    { name: "Strømsgodset", no: 2, matches: 30 },   // Switched
                    { name: "Haugesund", no: 3, matches: 30 },
                    { name: "Aalesund", no: 4, matches: 30 },
                    { name: "Viking", no: 5, matches: 30 },
                    { name: "Molde", no: 6, matches: 30 },
                    { name: "Odd", no: 7, matches: 30 },
                    { name: "Brann", no: 8, matches: 30 },
                    { name: "Start", no: 9, matches: 30 },
                    { name: "Lillestrøm", no: 10, matches: 30 },
                    { name: "Vålerenga", no: 11, matches: 30 },
                    { name: "Sogndal", no: 12, matches: 30 },
                    { name: "Sandnes Ulf", no: 13, matches: 30 },
                    { name: "Sarpsborg 08", no: 14, matches: 30 },
                    { name: "Tromsø", no: 15, matches: 30 },
                    { name: "Hønefoss", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.tabell).to.equal(2);
                };

            inputArgs.tippeligaTable = twoPenaltyPoints;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give 1 penalty point for each table placing deviation, 10 points", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "Strømsgodset",
                            "Rosenborg",
                            "Haugesund",
                            "Aalesund",
                            "Viking",
                            "Molde",
                            "Odd",
                            "Brann",
                            "Start",
                            "Lillestrøm",
                            "Vålerenga",
                            "Sogndal",
                            "Sandnes Ulf",
                            "Sarpsborg 08",
                            "Tromsø",
                            "Hønefoss"
                        ]
                    }
                },
                tenPenaltyPoints = [
                    { name: "Strømsgodset", no: 1, matches: 30 },
                    { name: "Rosenborg", no: 2, matches: 30 },
                    { name: "Haugesund", no: 3, matches: 30 },
                    { name: "Aalesund", no: 4, matches: 30 },
                    { name: "Viking", no: 5, matches: 30 },
                    { name: "Vålerenga", no: 6, matches: 30 },      // Switched
                    { name: "Odd", no: 7, matches: 30 },
                    { name: "Brann", no: 8, matches: 30 },
                    { name: "Start", no: 9, matches: 30 },
                    { name: "Lillestrøm", no: 10, matches: 30 },
                    { name: "Molde", no: 11, matches: 30 },         // Switched
                    { name: "Sogndal", no: 12, matches: 30 },
                    { name: "Sandnes Ulf", no: 13, matches: 30 },
                    { name: "Sarpsborg 08", no: 14, matches: 30 },
                    { name: "Tromsø", no: 15, matches: 30 },
                    { name: "Hønefoss", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.tabell).to.equal(10);
                };

            inputArgs.tippeligaTable = tenPenaltyPoints;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give 1 penalty point for each table placing deviation, 32 points", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "Strømsgodset",
                            "Rosenborg",
                            "Haugesund",
                            "Aalesund",
                            "Viking",
                            "Molde",
                            "Odd",
                            "Brann",
                            "Start",
                            "Lillestrøm",
                            "Vålerenga",
                            "Sogndal",
                            "Sandnes Ulf",
                            "Sarpsborg 08",
                            "Tromsø",
                            "Hønefoss"
                        ]
                    }
                },
                thirtyTwoPenaltyPoints = [
                    { name: "Strømsgodset", no: 1, matches: 30 },
                    { name: "Rosenborg", no: 2, matches: 30 },
                    { name: "Sarpsborg 08", no: 3, matches: 30 },   // Switched 2
                    { name: "Aalesund", no: 4, matches: 30 },
                    { name: "Viking", no: 5, matches: 30 },
                    { name: "Vålerenga", no: 6, matches: 30 },      // Switched 1
                    { name: "Odd", no: 7, matches: 30 },
                    { name: "Brann", no: 8, matches: 30 },
                    { name: "Start", no: 9, matches: 30 },
                    { name: "Lillestrøm", no: 10, matches: 30 },
                    { name: "Molde", no: 11, matches: 30 },         // Switched 1
                    { name: "Sogndal", no: 12, matches: 30 },
                    { name: "Sandnes Ulf", no: 13, matches: 30 },
                    { name: "Haugesund", no: 14, matches: 30 },     // Switched 2
                    { name: "Tromsø", no: 15, matches: 30 },
                    { name: "Hønefoss", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.tabell).to.equal(32);
                };

            inputArgs.tippeligaTable = thirtyTwoPenaltyPoints;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should have 128 as maximum penalty points with 16 teams", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "Hønefoss",
                            "Haugesund",
                            "Tromsø",
                            "Sarpsborg 08",
                            "Sandnes Ulf",
                            "Sogndal",
                            "Vålerenga",
                            "Lillestrøm",
                            "Start",
                            "Brann",
                            "Odd",
                            "Molde",
                            "Viking",
                            "Aalesund",
                            "Rosenborg",
                            "Strømsgodset"
                        ]
                    }
                },
                reversedClonedPredictionTable = JSON.parse(JSON.stringify(userPredictions.john.tabell)).reverse(),
                reversedTable = [],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.tabell).to.equal(maxDisplacementSumInPermutationOfLength(reversedTable.length));
                    expect(tippekonkurranseData.scores.scores.john.tabell).to.equal(128);
                };

            for (var i = 0; i < reversedClonedPredictionTable.length; i += 1) {
                reversedTable[i] = new TeamPlacement(reversedClonedPredictionTable[i], i + 1, reversedClonedPredictionTable.length * 2 - 2);
            }

            inputArgs.tippeligaTable = reversedTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });
    });


    describe("'Nedrykk' bonus point calculations", function () {

        it("should give -1 if both teams exist in prediction, exact order (2014 only)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "N",
                            "M",
                            "L",
                            "K",
                            "J",
                            "I",
                            "H",
                            "G",
                            "F",
                            "E",
                            "D",
                            "C",
                            "B",
                            "A",
                            "TeamA",
                            "TeamB"
                        ],
                        opprykk: null,
                        toppscorer: null,
                        cup: null
                    }
                },
                actualNedrykkTable = [
                    { name: "A", no: 1, matches: 30 },
                    { name: "B", no: 2, matches: 30 },
                    { name: "C", no: 3, matches: 30 },
                    { name: "D", no: 4, matches: 30 },
                    { name: "E", no: 5, matches: 30 },
                    { name: "F", no: 6, matches: 30 },
                    { name: "G", no: 7, matches: 30 },
                    { name: "H", no: 8, matches: 30 },
                    { name: "I", no: 9, matches: 30 },
                    { name: "J", no: 10, matches: 30 },
                    { name: "K", no: 11, matches: 30 },
                    { name: "L", no: 12, matches: 30 },
                    { name: "M", no: 13, matches: 30 },
                    { name: "N", no: 14, matches: 30 },
                    { name: "TeamA", no: 15, matches: 30 },
                    { name: "TeamB", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.nedrykk).to.equal(-1);
                };

            inputArgs.tippeligaTable = actualNedrykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give nothing if both teams exist in prediction, exact order (2015 and onwards)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "N",
                            "M",
                            "L",
                            "K",
                            "J",
                            "I",
                            "H",
                            "G",
                            "F",
                            "E",
                            "D",
                            "C",
                            "B",
                            "A",
                            "TeamA",
                            "TeamB"
                        ],
                        opprykk: null,
                        toppscorer: null,
                        cup: null
                    }
                },
                actualNedrykkTable = [
                    { name: "A", no: 1, matches: 30 },
                    { name: "B", no: 2, matches: 30 },
                    { name: "C", no: 3, matches: 30 },
                    { name: "D", no: 4, matches: 30 },
                    { name: "E", no: 5, matches: 30 },
                    { name: "F", no: 6, matches: 30 },
                    { name: "G", no: 7, matches: 30 },
                    { name: "H", no: 8, matches: 30 },
                    { name: "I", no: 9, matches: 30 },
                    { name: "J", no: 10, matches: 30 },
                    { name: "K", no: 11, matches: 30 },
                    { name: "L", no: 12, matches: 30 },
                    { name: "M", no: 13, matches: 30 },
                    { name: "N", no: 14, matches: 30 },
                    { name: "TeamA", no: 15, matches: 30 },
                    { name: "TeamB", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2015),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.nedrykk).to.equal(0);
                };

            inputArgs.tippeligaTable = actualNedrykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give -1 if both teams exist in prediction, whatever order (2014 only)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "N",
                            "M",
                            "L",
                            "K",
                            "J",
                            "I",
                            "H",
                            "G",
                            "F",
                            "E",
                            "D",
                            "C",
                            "B",
                            "A",
                            "TeamA",
                            "TeamB"
                        ],
                        opprykk: null,
                        toppscorer: null,
                        cup: null
                    }
                },
                actualNedrykkTable = [
                    { name: "A", no: 1, matches: 30 },
                    { name: "B", no: 2, matches: 30 },
                    { name: "C", no: 3, matches: 30 },
                    { name: "D", no: 4, matches: 30 },
                    { name: "E", no: 5, matches: 30 },
                    { name: "F", no: 6, matches: 30 },
                    { name: "G", no: 7, matches: 30 },
                    { name: "H", no: 8, matches: 30 },
                    { name: "I", no: 9, matches: 30 },
                    { name: "J", no: 10, matches: 30 },
                    { name: "K", no: 11, matches: 30 },
                    { name: "L", no: 12, matches: 30 },
                    { name: "M", no: 13, matches: 30 },
                    { name: "N", no: 14, matches: 30 },
                    { name: "TeamB", no: 15, matches: 30 },
                    { name: "TeamA", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.nedrykk).to.equal(-1);
                };

            inputArgs.tippeligaTable = actualNedrykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give nothing if only one team exist in prediction, whatever order 1", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "N",
                            "M",
                            "L",
                            "K",
                            "J",
                            "I",
                            "H",
                            "G",
                            "F",
                            "E",
                            "D",
                            "C",
                            "B",
                            "A",
                            "TeamA",
                            "TeamB"
                        ],
                        toppscorer: null,
                        opprykk: null,
                        cup: null
                    }
                },
                actualNedrykkTable = [
                    { name: "A", no: 1, matches: 30 },
                    { name: "B", no: 2, matches: 30 },
                    { name: "C", no: 3, matches: 30 },
                    { name: "D", no: 4, matches: 30 },
                    { name: "E", no: 5, matches: 30 },
                    { name: "F", no: 6, matches: 30 },
                    { name: "G", no: 7, matches: 30 },
                    { name: "H", no: 8, matches: 30 },
                    { name: "I", no: 9, matches: 30 },
                    { name: "J", no: 10, matches: 30 },
                    { name: "K", no: 11, matches: 30 },
                    { name: "L", no: 12, matches: 30 },
                    { name: "M", no: 13, matches: 30 },
                    { name: "TeamB", no: 14, matches: 30 },
                    { name: "TeamA", no: 15, matches: 30 },
                    { name: "N", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.nedrykk).to.equal(0);
                };

            inputArgs.tippeligaTable = actualNedrykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("should give nothing if only one team exist in prediction, whatever order 2", function (done) {
            var userPredictions = {
                    john: {
                        tabell: [
                            "N",
                            "M",
                            "L",
                            "K",
                            "J",
                            "I",
                            "H",
                            "G",
                            "F",
                            "E",
                            "D",
                            "C",
                            "B",
                            "A",
                            "TeamA",
                            "TeamB"
                        ],
                        toppscorer: null,
                        opprykk: null,
                        cup: null
                    }
                },
                actualNedrykkTable = [
                    { name: "A", no: 1, matches: 30 },
                    { name: "B", no: 2, matches: 30 },
                    { name: "C", no: 3, matches: 30 },
                    { name: "D", no: 4, matches: 30 },
                    { name: "E", no: 5, matches: 30 },
                    { name: "F", no: 6, matches: 30 },
                    { name: "G", no: 7, matches: 30 },
                    { name: "H", no: 8, matches: 30 },
                    { name: "I", no: 9, matches: 30 },
                    { name: "J", no: 10, matches: 30 },
                    { name: "K", no: 11, matches: 30 },
                    { name: "L", no: 12, matches: 30 },
                    { name: "M", no: 13, matches: 30 },
                    { name: "TeamA", no: 14, matches: 30 },
                    { name: "TeamB", no: 15, matches: 30 },
                    { name: "N", no: 16, matches: 30 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2015),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.nedrykk).to.equal(0);
                };

            inputArgs.tippeligaTable = actualNedrykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });
    });


    describe("'Opprykk' bonus point calculations", function () {

        it("2014: should give -1 if both teams exist in prediction, exact order", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamB", "C", "D"],
                        cup: null
                    }
                },
                actualOpprykkTable = [
                    new TeamPlacement("TeamA", 1, 30),
                    new TeamPlacement("TeamB", 2, 30),
                    new TeamPlacement("C", 3, 30),
                    new TeamPlacement("D", 4, 30)
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.opprykk).to.equal(-1);
                };

            inputArgs.adeccoligaTable = actualOpprykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });

        it("2014: should give -1 if both teams exist in prediction, whatever order", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamB"],
                        cup: null
                    }
                },
                actualOpprykkTable = [
                    { name: "TeamB", no: 1, matches: 3 },
                    { name: "TeamA", no: 2, matches: 3 },
                    { name: "Some other team", no: 3, matches: 3 },
                    { name: "And one more team", no: 4, matches: 3 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.opprykk).to.equal(-1);
                };

            inputArgs.adeccoligaTable = actualOpprykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2014: should give nothing if only one team exist in prediction, whatever order 1", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamC"],
                        cup: null
                    }
                },
                actualOpprykkTable = [
                    { name: "TeamA", no: 1, matches: 3 },
                    { name: "TeamB", no: 2, matches: 3 },
                    { name: "TeamC", no: 3, matches: 3 },
                    { name: "And one more team", no: 4, matches: 3 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.opprykk).to.equal(0);
                };

            inputArgs.adeccoligaTable = actualOpprykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2014: should give nothing if only one team exist in prediction, whatever order 2", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamC"],
                        cup: null
                    }
                },
                actualOpprykkTable = [
                    { name: "TeamC", no: 1, matches: 3 },
                    { name: "TeamB", no: 2, matches: 3 },
                    { name: "TeamA", no: 3, matches: 3 },
                    { name: "And one more team", no: 4, matches: 3 }
                ],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.opprykk).to.equal(0);
                };

            inputArgs.adeccoligaTable = actualOpprykkTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });
    });


    describe("'Toppscorer' bonus point calculations", function () {

        it("2014: should give -1 if toppscorer is correct", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: ["Mr. T"],
                        opprykk: null,
                        cup: null
                    }
                },
                actualToppscorerTable = ["Mr. T"],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.toppscorer).to.equal(-1);
                };

            inputArgs.tippeligaTopScorer = actualToppscorerTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2015: should give -5 if toppscorer is correct", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: ["Mr. T"],
                        opprykk: null,
                        cup: null
                    }
                },
                actualToppscorerTable = ["Mr. T"],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2015),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.toppscorer).to.equal(-5);
                };

            inputArgs.tippeligaTopScorer = actualToppscorerTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2014: should give 0 if toppscorer is not present in toppscorer collection (more than one toppscorer)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: ["Mr. T"],
                        opprykk: null,
                        cup: null
                    }
                },
                actualToppscorerTable = ["Mr. A", "Mr. B"],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.toppscorer).to.equal(0);
                };

            inputArgs.tippeligaTopScorer = actualToppscorerTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2015: should give 0 if toppscorer is not present in toppscorer collection (more than one toppscorer)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: ["Mr. T"],
                        opprykk: null,
                        cup: null
                    }
                },
                actualToppscorerTable = ["Mr. A", "Mr. B"],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2015),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.toppscorer).to.equal(0);
                };

            inputArgs.tippeligaTopScorer = actualToppscorerTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2014: should give -1 if toppscorer is present in toppscorer collection (more than one toppscorer)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: ["Mr. T"],
                        opprykk: null,
                        cup: null
                    }
                },
                actualToppscorerTable = ["Mr. A", "Mr. T"],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2014),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.toppscorer).to.equal(-1);
                };

            inputArgs.tippeligaTopScorer = actualToppscorerTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });


        it("2015: should give -5 if toppscorer is present in toppscorer collection (more than one toppscorer)", function (done) {
            var userPredictions = {
                    john: {
                        tabell: null,
                        toppscorer: ["Mr. T"],
                        opprykk: null,
                        cup: null
                    }
                },
                actualToppscorerTable = ["Mr. A", "Mr. T"],
                addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestor, userPredictions, rules2015),
                inputArgs = new TippekonkurranseData(),
                verify = function (args) {
                    var tippekonkurranseData = new TippekonkurranseData(args);
                    expect(tippekonkurranseData.scores.scores.john.toppscorer).to.equal(-5);
                };

            inputArgs.tippeligaTopScorer = actualToppscorerTable;

            rq.mocha.executeAndVerify(addTippekonkurranseScores, inputArgs.toArray(), verify, done);
        });
    });
});
