/* global global:false, require:false, describe:false, it:false, expect:false, sinon:false, hello:false */
var root = global || window;

/* For WebStorm ... */
var expect = require('../bower_components/chai/chai').expect,
    sinon = require('../bower_components/sinon/lib/sinon');

var getNedrykkScore = require("../../server/scripts/tippekonkurranse-service.js")._getNedrykkScore;
var updateScores = require("../../server/scripts/tippekonkurranse-service.js")._updateScores;
//var predictions2014 = require("../../server/scripts/tippekonkurranse-service.js").predictions2014;

describe("'tippekonkurranse-service' specs", function () {
    "use strict";
    describe("'Opprykk' penalty point calculations", function () {
        it("should get hold on private functions within Node.js file", function () {
            expect(getNedrykkScore).to.exist;
        });
        it("should give -1 if both teams exist in prediction", function () {
            expect(updateScores().throw("lkjlkjklj"));
        });
    });
});
