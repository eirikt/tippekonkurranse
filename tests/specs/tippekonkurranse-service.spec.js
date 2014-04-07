/* global global:false, require:false, describe:false, it:false, sinon:false, hello:false */
/* jshint -W030 */

/* For WebStorm ...
 var assert = require('../bower_components/chai/chai').assert,
 expect = require('../bower_components/chai/chai').expect,
 sinon = require('../bower_components/sinon/lib/sinon');
 */

var assert = require("../bower_components/chai/chai.js").assert,
    expect = require("../bower_components/chai/chai.js").expect,

    updateScores = require("../../server/scripts/tippekonkurranse-service.js")._updateScores;

describe("Tippekonkurranse service", function () {
    "use strict";

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

        it("should return score object with zeros only if null user prediction object is provided", function () {
            var userPredictions = {
                john: null
            };
            expect(updateScores(userPredictions)).to.be.ok;
            expect(updateScores(userPredictions)).not.to.be.empty;
            expect(updateScores(userPredictions, null, null, null, null)).to.be.ok;
            expect(updateScores(userPredictions, null, null, null, null)).not.to.be.empty;
            expect(JSON.stringify(updateScores(userPredictions))).to.equal(
                JSON.stringify({
                    john: {
                        tabell: 0,
                        pall: 0,
                        nedrykk: 0,
                        toppscorer: 0,
                        opprykk: 0,
                        cup: 0
                    }
                })
            );
        });

        it("should return score object with zeros only if empty user prediction object is provided", function () {
            var userPredictions = {
                john: {}
            };
            expect(updateScores(userPredictions)).to.be.ok;
            expect(updateScores(userPredictions)).not.to.be.empty;
            expect(updateScores(userPredictions, null, null, null, null)).to.be.ok;
            expect(updateScores(userPredictions, null, null, null, null)).not.to.be.empty;
            expect(JSON.stringify(updateScores(userPredictions))).to.equal(
                JSON.stringify({
                    john: {
                        tabell: 0,
                        pall: 0,
                        nedrykk: 0,
                        toppscorer: 0,
                        opprykk: 0,
                        cup: 0
                    }
                })
            );
        });

        it("should return score object with zeros only if non-complete user prediction object is provided", function () {
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
                    john: {
                        tabell: 0,
                        pall: 0,
                        nedrykk: 0,
                        toppscorer: 0,
                        opprykk: 0,
                        cup: 0
                    }
                })
            );
        });

        it("should return score object with zeros only if non-complete user prediction object is provided", function () {
            var userPredictions = {
                john: {
                    tabell: [],
                    pall: null,
                    nedrykk: undefined,
                    toppscorer: {},
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
                    john: {
                        tabell: 0,
                        pall: 0,
                        nedrykk: 0,
                        toppscorer: 0,
                        opprykk: 0,
                        cup: 0
                    }
                })
            );
        });
    });


    describe("'Opprykk' penalty point calculations", function () {
        it("should throw exception if retrieved table data is missing 'no' property", function () {
            var userPredictions = {
                    john: {
                        tabell: null,
                        pall: null,
                        nedrykk: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamB"],
                        cup: null
                    }
                },
                actualOpprykkTable = {
                    "TeamA": null,
                    "TeamB": null,
                    "Some other team": null,
                    "And one more team": null
                };

            assert.throw(function () {
                updateScores(userPredictions, null, actualOpprykkTable, null, null);
            }, TypeError, "Cannot read property 'no' of null");
        });

        it("should give -1 if both teams exist in prediction, whatever order ", function () {
            var userPredictions = {
                    john: {
                        tabell: null,
                        pall: null,
                        nedrykk: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamB"],
                        cup: null
                    }
                },
                actualOpprykkTable1 = {
                    "TeamA": { no: 1, matches: 3 },
                    "TeamB": { no: 2, matches: 3 },
                    "Some other team": { no: 3, matches: 3 },
                    "And one more team": { no: 4, matches: 3 }
                },
                actualOpprykkTable2 = {
                    "TeamB": { no: 1, matches: 3 },
                    "TeamA": { no: 2, matches: 3 },
                    "Some other team": { no: 3, matches: 3 },
                    "And one more team": { no: 4, matches: 3 }
                };

            expect(JSON.stringify(updateScores(userPredictions, null, actualOpprykkTable1, null, null))).to.equal(
                JSON.stringify({
                    john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: -1, cup: 0 }
                })
            );
            expect(JSON.stringify(updateScores(userPredictions, null, actualOpprykkTable2, null, null))).to.equal(
                JSON.stringify({
                    john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: -1, cup: 0 }
                })
            );
        });

        it("should give nothing if only one team exist in prediction, whatever order ", function () {
            var userPredictions = {
                    john: {
                        tabell: null,
                        pall: null,
                        nedrykk: null,
                        toppscorer: null,
                        opprykk: ["TeamA", "TeamC"],
                        cup: null
                    }
                },
                actualOpprykkTable1 = {
                    "TeamA": { no: 1, matches: 3 },
                    "TeamB": { no: 2, matches: 3 },
                    "TeamC": { no: 3, matches: 3 },
                    "And one more team": { no: 4, matches: 3 }
                },
                actualOpprykkTable2 = {
                    "TeamC": { no: 1, matches: 3 },
                    "TeamB": { no: 2, matches: 3 },
                    "TeamA": { no: 3, matches: 3 },
                    "And one more team": { no: 4, matches: 3 }
                };

            expect(JSON.stringify(updateScores(userPredictions, null, actualOpprykkTable1, null, null))).to.equal(
                JSON.stringify({
                    john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0 }
                })
            );
            expect(JSON.stringify(updateScores(userPredictions, null, actualOpprykkTable2, null, null))).to.equal(
                JSON.stringify({
                    john: { tabell: 0, pall: 0, nedrykk: 0, toppscorer: 0, opprykk: 0, cup: 0 }
                })
            );
        });
    });
});
