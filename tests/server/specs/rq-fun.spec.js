/* global describe:false, it:false */
/* jshint -W030 */

var expect = require("chai").expect,
    Comparators = require('../../../shared/scripts/comparators'),
    rq = require("../../../server/scripts/rq-fun");

describe("rq-fun clone", function () {
    "use strict";

    it("should be a function", function () {
        expect(rq).to.exist;
        expect(rq.clone).to.be.a.function;
    });

    it("should just return falsy values", function () {
        expect(rq.clone()).not.to.exist;
        expect(rq.clone(null)).to.be.null;
        expect(rq.clone(false)).to.be.false;
        expect(rq.clone(0)).to.be.equal(0);
        expect(rq.clone("")).to.be.equal("");
    });

    it("should clone arrays (of e.g. dates)", function () {
        var aDate = new Date(2014, 10, 25, 0, 0, 0);
        var anArray = [];

        anArray[0] = null;
        anArray[1] = aDate;
        anArray[2] = "Something else";

        var aClonedArray = rq.clone(anArray);
        expect(aClonedArray[0]).to.be.null;
        expect(aClonedArray[1]).to.be.an.object;
        expect(aClonedArray[1].getTime()).to.be.equal(new Date(2014, 10, 25, 0, 0, 0).getTime());
        expect(aClonedArray[1]).to.be.equal(aDate);
        expect(aClonedArray[2]).to.be.equal("Something else");
    });
});
