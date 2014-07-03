/* global  describe:false, it:false */
/* jshint -W030 */

var __ = require("../../../node_modules/underscore/underscore.js"),
    curry = require("../../../node_modules/curry/curry"),

    expect = require("../../../node_modules/chai/chai.js").expect,
    sinon = require('../../../node_modules/sinon/lib/sinon'),

    go = require("../../../server/scripts/utils.js").rqGo,

    tippeligaTableIndex = require("../../../server/scripts/tippekonkurranse.js").tippeligaTableIndex,
    adeccoligaTableIndex = require("../../../server/scripts/tippekonkurranse.js").adeccoligaTableIndex,
    scoresIndex = require("../../../server/scripts/tippekonkurranse.js").scoresIndex,
    addTippekonkurranseScoresRequestion = require("../../../server/scripts/tippekonkurranse.js").addTippekonkurranseScoresRequestion,

    addTippekonkurranseScores2014 = __.partial(addTippekonkurranseScoresRequestion, require("../../../server/scripts/user-predictions-2014.js").predictions2014),

    sortByPropertyRequestion = require("../../../server/scripts/tippekonkurranse.js").sortByPropertyRequestion;


describe("Tippekonkurranse service", function () {
    "use strict";

    describe("Underlying basics", function () {
        it("should ensure (native) sorting of number strings", function () {
            expect(Math.max.apply(null, ["1", "2"])).to.equal(2);
            expect(Math.max.apply(null, ["0", "4", "9"])).to.equal(9);
            expect(Math.max.apply(null, ["8", "9", "10"])).to.equal(10);
            expect(Math.max.apply(null, ["02", "009", "10", "103"])).to.equal(103);
        });
    });


    describe("addTippekonkurranseScores requestion", function () {

        describe("Border cases", function () {

            it("should get hold on private functions within Node.js file", function () {
                expect(addTippekonkurranseScores2014).to.exist;
            });

            it("should throw error if no requestion argument is provided", function () {
                expect(addTippekonkurranseScores2014).to.throw(Error, "Requestion argument is missing - check your RQ.js setup");
            });

            it("should throw error if no argument array is provided", function () {
                var addTippekonkurranseScores = __.partial(addTippekonkurranseScores2014, function () {
                });
                expect(addTippekonkurranseScores).to.throw(Error, "Requestion argument array is missing - check your RQ.js functions and setup");
            });

            it("should throw error if no user predictions are provided", function () {
                var userPredictions = null,
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);//,
                //addTippekonkurranseScores = __.partial(addTippekonkurranseScores2014, requestion, args);
                try {
                    addTippekonkurranseScores(requestion, args);
                    throw new Error("Should have thrown error");
                } catch (e) {
                    expect(e.message).to.be.equal("User predictions argument are missing - cannot calculate Tippekonkurranse scores");
                }
                // TODO: Do something like this instead ...
                //var addTippekonkurranseScores = __.bind(addTippekonkurranseScores, [{}, function () {}, {}]);
                //expect(addTippekonkurranseScores).to.throw(Error, "More than 2 arguments present - this requestion must be curried with predictions object before use");
                //});
            });

            it("should return empty score object if empty user prediction object is provided", function () {
                var userPredictions = {},
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                expect(addTippekonkurranseScores(requestion, args)).to.exist;
                expect(addTippekonkurranseScores(requestion, args)).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)).to.not.be.an.empty.object;
                expect(addTippekonkurranseScores(requestion, args).length).to.be.equal(9);

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.exist;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores).to.be.an.empty.object;
            });

            it("should return zero-only score object if null user prediction object is provided", function () {
                var userPredictions = {
                        john: null
                    },
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                expect(addTippekonkurranseScores(requestion, args)).to.exist;
                expect(addTippekonkurranseScores(requestion, args)).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)).to.not.be.an.empty.object;
                expect(addTippekonkurranseScores(requestion, args).length).to.be.equal(9);

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.exist;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores).not.to.be.an.empty.object;

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.be.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });

            it("should return zero-only score object if empty user prediction object is provided", function () {
                var userPredictions = {
                        john: {}
                    },
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                expect(addTippekonkurranseScores(requestion, args)).to.exist;
                expect(addTippekonkurranseScores(requestion, args)).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)).to.not.be.an.empty.object;
                expect(addTippekonkurranseScores(requestion, args).length).to.be.equal(9);

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.exist;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores).not.to.be.an.empty.object;

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.be.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });

            it("should return zero-only score object if non-complete user prediction object is provided", function () {
                var userPredictions = {
                        john: {
                            tabell: null
                        }
                    },
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                expect(addTippekonkurranseScores(requestion, args)).to.exist;
                expect(addTippekonkurranseScores(requestion, args)).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)).to.not.be.an.empty.object;
                expect(addTippekonkurranseScores(requestion, args).length).to.be.equal(9);

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.exist;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores).not.to.be.an.empty.object;

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.be.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });

            it("should return zero-only score object if non-complete user prediction object is provided", function () {
                var userPredictions = {
                        john: {
                            tabell: [],
                            toppscorer: undefined,
                            opprykk: null,
                            cup: []
                        }
                    },
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                expect(addTippekonkurranseScores(requestion, args)).to.exist;
                expect(addTippekonkurranseScores(requestion, args)).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)).to.not.be.an.empty.object;
                expect(addTippekonkurranseScores(requestion, args).length).to.be.equal(9);

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.exist;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex]).to.be.an.object;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores).not.to.be.an.empty.object;

                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].metadata).to.be.null;
                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.be.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });
        });


        describe("'Tabell' penalty point calculations", function () {

            it("should have 0 as minimum penalty points", function () {
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
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions),
                    impeccablePrediction;

                args[tippeligaTableIndex] = actualTable;
                impeccablePrediction = addTippekonkurranseScores(requestion, args)[scoresIndex];

                expect(impeccablePrediction.scores.john.tabell).to.equal(0);
                expect(impeccablePrediction.scores.john.nedrykk).to.equal(-1);
                expect(impeccablePrediction.scores.john.pall).to.equal(-4);
            });

            it("should give 1 penalty point for each table placing deviation", function () {
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
                    actualTable2penaltyPoints = [
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
                    actualTable10penaltyPoints = [
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
                    actualTable32penaltyPoints = [
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
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[tippeligaTableIndex] = actualTable2penaltyPoints;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.tabell).to.equal(2);

                args[tippeligaTableIndex] = actualTable10penaltyPoints;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.tabell).to.equal(10);

                args[tippeligaTableIndex] = actualTable32penaltyPoints;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.tabell).to.equal(32);
            });

            it("should have 116 as maximum score, shouldn't it?", function () {
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
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[tippeligaTableIndex] = actualTable;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.tabell).to.equal(116);
            });
        });


        describe("'Nedrykk' penalty point calculations", function () {
            it("should give -1 if both teams exist in prediction, whatever order ", function () {
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
                                "TeamA",
                                "TeamB"
                            ],
                            opprykk: null,
                            toppscorer: null,
                            cup: null
                        }
                    },
                    actualNedrykkTable1 = [
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
                        { name: "TeamA", no: 15, matches: 30 },
                        { name: "TeamB", no: 16, matches: 30 }
                    ],
                    actualNedrykkTable2 = [
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
                        { name: "TeamB", no: 15, matches: 30 },
                        { name: "TeamA", no: 16, matches: 30 }
                    ],
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[tippeligaTableIndex] = actualNedrykkTable1;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.nedrykk).to.equal(-1);

                args[tippeligaTableIndex] = actualNedrykkTable2;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.nedrykk).to.equal(-1);
            });

            it("should give nothing if only one team exist in prediction, whatever order ", function () {
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
                                "TeamA",
                                "TeamB"
                            ],
                            toppscorer: null,
                            opprykk: null,
                            cup: null
                        }
                    },
                    actualNedrykkTable1 = [
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
                        { name: "TeamB", no: 14, matches: 30 },
                        { name: "TeamA", no: 15, matches: 30 },
                        { name: "Sarpsborg 08", no: 16, matches: 30 }
                    ],
                    actualNedrykkTable2 = [
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
                        { name: "TeamA", no: 14, matches: 30 },
                        { name: "Sarpsborg 08", no: 15, matches: 30 },
                        { name: "TeamB", no: 16, matches: 30 }
                    ],
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[tippeligaTableIndex] = actualNedrykkTable1;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.nedrykk).to.equal(0);

                args[tippeligaTableIndex] = actualNedrykkTable2;
                expect(addTippekonkurranseScores(requestion, args)[scoresIndex].scores.john.nedrykk).to.equal(0);
            });
        });


        describe("'Opprykk' penalty point calculations", function () {
            it("should throw error if retrieved table data is missing 'no' property", function () {
                var userPredictions = {
                        john: {
                            tabell: null,
                            toppscorer: null,
                            opprykk: ["TeamA", "TeamB"],
                            cup: null
                        }
                    },
                    actualOpprykkTable = [
                        { name: "TeamA" },
                        { name: "TeamB" },
                        { name: "Some other team" },
                        { name: "And one more team" }
                    ],
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[tippeligaTableIndex] = actualOpprykkTable;

                try {
                    addTippekonkurranseScores(requestion, args);
                    throw new Error("Should have thrown error");
                } catch (e) {
                    expect(e.message).to.be.equal("Illegal data format ('no' property is missing) - cannot calculate Tippekonkurranse scores");
                }
                // TODO: Do something like this instead ...
                //var addTippekonkurranseScores = __.bind(addTippekonkurranseScores, [{}, function () {}, {}]);
                //expect(addTippekonkurranseScores).to.throw(Error, "More than 2 arguments present - this requestion must be curried with predictions object before use");
                //});
            });

            it("should give -1 if both teams exist in prediction, whatever order ", function () {
                var userPredictions = {
                        john: {
                            tabell: null,
                            toppscorer: null,
                            opprykk: ["TeamA", "TeamB"],
                            cup: null
                        }
                    },
                    actualOpprykkTable1 = [
                        { name: "TeamA", no: 1, matches: 3 },
                        { name: "TeamB", no: 2, matches: 3 },
                        { name: "Some other team", no: 3, matches: 3 },
                        { name: "And one more team", no: 4, matches: 3 }
                    ],
                    actualOpprykkTable2 = [
                        { name: "TeamB", no: 1, matches: 3 },
                        { name: "TeamA", no: 2, matches: 3 },
                        { name: "Some other team", no: 3, matches: 3 },
                        { name: "And one more team", no: 4, matches: 3 }
                    ],
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[adeccoligaTableIndex] = actualOpprykkTable1;
                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: -1, cup: 0, rating: -1 }
                    })
                );

                args[tippeligaTableIndex] = actualOpprykkTable2;
                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: -1, cup: 0, rating: -1 }
                    })
                );
            });

            it("should give nothing if only one team exist in prediction, whatever order ", function () {
                var userPredictions = {
                        john: {
                            tabell: null,
                            toppscorer: null,
                            opprykk: ["TeamA", "TeamC"],
                            cup: null
                        }
                    },
                    actualOpprykkTable1 = [
                        { name: "TeamA", no: 1, matches: 3 },
                        { name: "TeamB", no: 2, matches: 3 },
                        { name: "TeamC", no: 3, matches: 3 },
                        { name: "And one more team", no: 4, matches: 3 }
                    ],
                    actualOpprykkTable2 = [
                        { name: "TeamC", no: 1, matches: 3 },
                        { name: "TeamB", no: 2, matches: 3 },
                        { name: "TeamA", no: 3, matches: 3 },
                        { name: "And one more team", no: 4, matches: 3 }
                    ],
                    requestion = go,
                    args = [],
                    addTippekonkurranseScores = curry(addTippekonkurranseScoresRequestion)(userPredictions);

                args[adeccoligaTableIndex] = actualOpprykkTable1;

                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );

                args[tippeligaTableIndex] = actualOpprykkTable2;

                expect(JSON.stringify(addTippekonkurranseScores(requestion, args)[scoresIndex].scores)).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });
        });
    });


    describe("sortByPropertyRequestion", function () {
        describe("Border cases", function () {
            var bypassRequestion = go;

            it("should get hold on private functions within Node.js file", function () {
                expect(sortByPropertyRequestion).to.exist;
            });

            it("should throw error if no requestion argument is provided", function () {
                var sortByMyPropertyRequestion = __.partial(sortByPropertyRequestion, "myProperty");
                expect(sortByMyPropertyRequestion).to.throw(Error, "Requestion argument is missing - check your RQ.js setup");
            });

            it("should throw error if no argument array is provided", function () {
                var sortByMyPropertyRequestion = __.partial(sortByPropertyRequestion, "myProperty", bypassRequestion);
                expect(sortByMyPropertyRequestion).to.throw(Error, "Requestion argument array is missing - check your RQ.js functions and setup");
            });

            it("should sort arguments array by numbers", function () {
                var args = [
                    [
                        ["A"],
                        [3]
                    ],
                    [
                        ["B"],
                        [-1]
                    ],
                    [
                        ["C"],
                        [1]
                    ]
                ];
                expect(sortByPropertyRequestion(1, bypassRequestion, args)).to.be.deep.equal([
                    [
                        ["B"],
                        [-1]
                    ],
                    [
                        ["C"],
                        [1]
                    ],
                    [
                        ["A"],
                        [3]
                    ]
                ]);
            });

            it("should sort arguments array by number strings as well", function () {
                var args = [
                    [
                        ["B"],
                        [-1]
                    ],
                    [
                        ["A"],
                        [3]
                    ],
                    [
                        ["C"],
                        [1]
                    ]
                ];
                expect(sortByPropertyRequestion("0", bypassRequestion, args)).to.be.deep.equal([
                    [
                        ["B"],
                        [-1]
                    ],
                    [
                        ["A"],
                        [3]
                    ],
                    [
                        ["C"],
                        [1]
                    ]
                ]);
            });
        });
    });
});
