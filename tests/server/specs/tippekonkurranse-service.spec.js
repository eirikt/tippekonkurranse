/* global  describe:false, it:false */
/* jshint -W030 */

var expect = require("../../../node_modules/chai/chai.js").expect,
    sinon = require('../../../node_modules/sinon/lib/sinon'),

    updateScores = require("../../../server/scripts/tippekonkurranse-service.js")._updateScores;


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


    describe("updateScores", function () {

        describe("Border cases", function () {
            it("should get hold on private functions within Node.js file", function () {
                expect(updateScores).to.exist;
            });

            it("should do nothing and return empty object if no args are provided", function () {
                expect(updateScores()).to.be.empty;
            });

            it("should do nothing and return empty object if empty prediction object is provided only", function () {
                expect(updateScores({})).to.be.empty;
            });

            it("should return zero-only score object if null user prediction object is provided", function () {
                var userPredictions = {
                    john: null
                };
                expect(updateScores(userPredictions)).to.be.ok;
                expect(updateScores(userPredictions)).not.to.be.empty;
                expect(updateScores(userPredictions, null, null, null, null)).to.be.ok;
                expect(updateScores(userPredictions, null, null, null, null)).not.to.be.empty;
                expect(JSON.stringify(updateScores(userPredictions))).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });

            it("should return zero-only score object if empty user prediction object is provided", function () {
                var userPredictions = {
                    john: {}
                };
                expect(updateScores(userPredictions)).to.be.ok;
                expect(updateScores(userPredictions)).not.to.be.empty;
                expect(updateScores(userPredictions, null, null, null, null)).to.be.ok;
                expect(updateScores(userPredictions, null, null, null, null)).not.to.be.empty;
                expect(JSON.stringify(updateScores(userPredictions))).to.equal(
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
                };
                expect(updateScores(userPredictions)).to.be.ok;
                expect(updateScores(userPredictions)).not.to.be.empty;
                expect(updateScores(userPredictions, null, null, null, null)).to.be.ok;
                expect(updateScores(userPredictions, null, null, null, null)).not.to.be.empty;
                expect(JSON.stringify(updateScores(userPredictions))).to.equal(
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
                };
                expect(updateScores(userPredictions)).to.be.ok;
                expect(updateScores(userPredictions)).not.to.be.empty;
                expect(updateScores(userPredictions, null, null, null, null)).to.be.ok;
                expect(updateScores(userPredictions, null, null, null, null)).not.to.be.empty;
                expect(JSON.stringify(updateScores(userPredictions))).to.equal(
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
                    perfectPrediction = updateScores(userPredictions, actualTable, null, null, null);

                expect(perfectPrediction.john.tabell).to.equal(0);
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
                    predictionGiving2PenaltyPoints = updateScores(userPredictions, actualTable2penaltyPoints, null, null, null),
                    predictionGiving10PenaltyPoints = updateScores(userPredictions, actualTable10penaltyPoints, null, null, null),
                    predictionGiving32PenaltyPoints = updateScores(userPredictions, actualTable32penaltyPoints, null, null, null);

                expect(predictionGiving2PenaltyPoints.john.tabell).to.equal(2);
                expect(predictionGiving10PenaltyPoints.john.tabell).to.equal(10);
                expect(predictionGiving32PenaltyPoints.john.tabell).to.equal(32);
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
                    perfectPrediction = updateScores(userPredictions, actualTable, null, null, null);

                expect(perfectPrediction.john.tabell).to.equal(116);
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
                    thumbsUpNedrykkPrediction1 = updateScores(userPredictions, actualNedrykkTable1, null, null, null),
                    thumbsUpNedrykkPrediction2 = updateScores(userPredictions, actualNedrykkTable2, null, null, null);

                expect(thumbsUpNedrykkPrediction1.john.nedrykk).to.equal(-1);
                expect(thumbsUpNedrykkPrediction2.john.nedrykk).to.equal(-1);
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
                    closeButNoSigarPrediction1 = updateScores(userPredictions, actualNedrykkTable1, null, null, null),
                    closeButNoSigarPrediction2 = updateScores(userPredictions, actualNedrykkTable2, null, null, null);

                expect(closeButNoSigarPrediction1.john.nedrykk).to.equal(0);
                expect(closeButNoSigarPrediction2.john.nedrykk).to.equal(0);
            });
        });


        describe("'Opprykk' penalty point calculations", function () {
            it("should give no bonus points if retrieved table data is missing 'no' property", function () {
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
                    ];

                expect(JSON.stringify(updateScores(userPredictions, null, null, actualOpprykkTable, null))).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
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
                    ];

                expect(JSON.stringify(updateScores(userPredictions, null, null, actualOpprykkTable1, null))).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: -1, cup: 0, rating: -1 }
                    })
                );
                expect(JSON.stringify(updateScores(userPredictions, null, null, actualOpprykkTable2, null))).to.equal(
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
                    ];

                expect(JSON.stringify(updateScores(userPredictions, null, null, actualOpprykkTable1, null))).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
                expect(JSON.stringify(updateScores(userPredictions, null, null, actualOpprykkTable2, null))).to.equal(
                    JSON.stringify({
                        john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0, rating: 0 }
                    })
                );
            });
        });
    });
});
