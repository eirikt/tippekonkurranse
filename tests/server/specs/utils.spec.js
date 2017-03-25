/* global describe:false, it:false */
/* jshint -W030 */

var expect = require("chai").expect,
    curry = require("../../../shared/scripts/fun").curry,

    getDisplacementPoints = require("../../../shared/scripts/utils").getDisplacementPoints,
    getMatchPoints = require("../../../shared/scripts/utils").getMatchPoints,
    getPresentPoints = require("../../../shared/scripts/utils").getPresentPoints,
    getAllPresentPoints = require("../../../shared/scripts/utils").getAllPresentPoints,

    maxDisplacementSumInPermutationOfLength = require("../../../shared/scripts/utils").maxDisplacementSumInPermutationOfLength;


describe("Points calculation functions", function () {
    "use strict";

    describe("getDisplacementPoints", function () {
        it("should return 0 if locations are equal", function () {
            expect(getDisplacementPoints(null, null, 0, 0)).to.be.equal(0);
            expect(getDisplacementPoints(null, null, 10, 10)).to.be.equal(0);
        });
        it("should return 1 when polarity is '+', weight is 1, and locations differ by 1", function () {
            expect(getDisplacementPoints('+', 1, 0, 1)).to.be.equal(1);
            expect(getDisplacementPoints('+', 1, 10, 9)).to.be.equal(1);
            expect(getDisplacementPoints('+', 1, -1, 0)).to.be.equal(1);
        });
        it("should return -4 when polarity is '-', weight is 1, and locations differ by 4", function () {
            expect(getDisplacementPoints('-', 1, 0, 4)).to.be.equal(-4);
            expect(getDisplacementPoints('-', 1, 10, 6)).to.be.equal(-4);
            expect(getDisplacementPoints('-', 1, -1, 3)).to.be.equal(-4);
        });
        it("should return 3 when polarity is '+', weight is 3, and locations differ by 1", function () {
            expect(getDisplacementPoints('+', 3, 0, 1)).to.be.equal(3);
            expect(getDisplacementPoints('+', 3, 10, 9)).to.be.equal(3);
            expect(getDisplacementPoints('+', 3, -1, 0)).to.be.equal(3);
        });
        it("should return -60 when polarity is '-', weight is 10, and locations differ by 6", function () {
            expect(getDisplacementPoints('-', 10, 0, 6)).to.be.equal(-60);
            expect(getDisplacementPoints('-', 10, 10, 4)).to.be.equal(-60);
            expect(getDisplacementPoints('-', 10, -1, 5)).to.be.equal(-60);
        });
    });

    describe("getMatchPoints", function () {
        it("should return 0 if locations differ", function () {
            expect(getMatchPoints(null, null, 0, 1)).to.be.equal(0);
            expect(getMatchPoints(null, null, 10, 8)).to.be.equal(0);
        });
        it("should return 1 when polarity is '+', weight is 1, and given values are equal", function () {
            expect(getMatchPoints('+', 1, 0, 0)).to.be.equal(1);
            expect(getMatchPoints('+', 1, 10, 10)).to.be.equal(1);
            expect(getMatchPoints('+', 1, -1, -1)).to.be.equal(1);
        });
        it("should return -10 when polarity is '-', weight is 10, and given values are equal", function () {
            expect(getMatchPoints('-', 10, 0, 0)).to.be.equal(-10);
        });
        it("should return 4 when polarity is '+', weight is 4, and given values are equal", function () {
            expect(getMatchPoints('+', 4, [1, 2, 3], [1, 2, 3])).to.be.equal(4);
        });
    });

    describe("getPresentPoints", function () {
        it("should return 0 if not all expected elements are present in actual value(s)", function () {
            expect(getPresentPoints(null, null, [11, 12, 13], [2, 1, 3])).to.be.equal(0);
            expect(getPresentPoints(null, null, 11, 22)).to.be.equal(0);
            expect(getPresentPoints(null, null, [1, 2, 3, 4], [1, 2, 3])).to.be.equal(0);
            expect(getPresentPoints(null, null, [1, 2, 3, 4], 3)).to.be.equal(0);
        });
        it("should return -1 when polarity is '-', weight is 1, and otherwise test is OK", function () {
            expect(getPresentPoints('-', 1, [2, 1, 3], [2, 11, 33])).to.be.equal(-1);
            expect(getPresentPoints('-', -1, [2, 1, 3], [2, 11, 33])).to.be.equal(1); // Strange, but OK
        });
        it("should return 1 when polarity is '+', weight is 1, and otherwise test is OK", function () {
            expect(getPresentPoints('+', 1, 1, [2, 1, 3])).to.be.equal(1);
            expect(getPresentPoints('+', 1, [2, 3], 3)).to.be.equal(1);
            expect(getPresentPoints('+', 1, [1, 2, 3], [2, 1, 3])).to.be.equal(1);
            expect(getPresentPoints('+', -1, [1, 2, 3], [2, 11, 33])).to.be.equal(-1); // Strange, but OK
        });
    });

    describe("getAllPresentPoints", function () {
        it("should return 0 if not all expected elements are present in actual value(s)", function () {
            expect(getAllPresentPoints(null, null, [11, 12, 13], [2, 1, 3])).to.be.equal(0);
            expect(getAllPresentPoints(null, null, 11, 22)).to.be.equal(0);
            expect(getAllPresentPoints(null, null, [1, 2, 3, 4], [1, 2, 3])).to.be.equal(0);
            expect(getAllPresentPoints(null, null, [1, 2, 3, 4], 3)).to.be.equal(0);
        });
        it("should return -1 when polarity is '-', weight is 1, and otherwise test is OK", function () {
            expect(getAllPresentPoints('-', 1, 2, [2, 1, 3])).to.be.equal(-1);
        });
        it("should return 1 when polarity is '+', weight is 1, and otherwise test is OK", function () {
            expect(getAllPresentPoints('+', 1, 1, [2, 1, 3])).to.be.equal(1);
            expect(getAllPresentPoints('+', 1, [2, 3], [2, 1, 3])).to.be.equal(1);
            expect(getAllPresentPoints('+', 1, [1, 2, 3], [2, 1, 3])).to.be.equal(1);
        });
    });
});


describe("'maxDisplacementSumInPermutationOfLength' function", function () {
    "use strict";

    it("should be a function", function () {
        expect(maxDisplacementSumInPermutationOfLength).to.exist;
        expect(maxDisplacementSumInPermutationOfLength).to.be.a.function;
    });

    it("should only accept natural numbers (including zero)", function () {
        expect(curry(maxDisplacementSumInPermutationOfLength, undefined)).to.throw(Error, "Natural number (including zero) argument is mandatory");
        expect(curry(maxDisplacementSumInPermutationOfLength, null)).to.throw(Error, "Natural number (including zero) argument is mandatory");
        expect(curry(maxDisplacementSumInPermutationOfLength, "1")).to.throw(Error, "Natural number (including zero) argument is mandatory");
        expect(curry(maxDisplacementSumInPermutationOfLength, new Date())).to.throw(Error, "Natural number (including zero) argument is mandatory");

        expect(curry(maxDisplacementSumInPermutationOfLength, 3.14)).to.throw(Error, "Natural number (including zero) argument is mandatory");
    });

    it("should specify the A007590 arithmetic sequence", function () {
        expect(maxDisplacementSumInPermutationOfLength(0)).to.equal(0);
        expect(maxDisplacementSumInPermutationOfLength(1)).to.equal(0);
        expect(maxDisplacementSumInPermutationOfLength(2)).to.equal(2);
        expect(maxDisplacementSumInPermutationOfLength(3)).to.equal(4);
        expect(maxDisplacementSumInPermutationOfLength(4)).to.equal(8);
        expect(maxDisplacementSumInPermutationOfLength(5)).to.equal(12);
        expect(maxDisplacementSumInPermutationOfLength(6)).to.equal(18);
        expect(maxDisplacementSumInPermutationOfLength(7)).to.equal(24);
        expect(maxDisplacementSumInPermutationOfLength(8)).to.equal(32);
        expect(maxDisplacementSumInPermutationOfLength(9)).to.equal(40);

        expect(maxDisplacementSumInPermutationOfLength(16)).to.equal(128);
    });
});
