/* global describe:false, it:false */
/* jshint -W030 */

var expect = require("chai").expect,
    curry = require("../../../shared/scripts/fun").curry,
    maxDisplacementSumInPermutationOfLength = require("../../../server/scripts/utils").maxDisplacementSumInPermutationOfLength;

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
