/* global describe:false, it:false */
/* jshint -W030, -W064 */

var expect = require("chai").expect,
    fail = require("chai").assert.fail,
    TeamPlacement = require("../../../shared/scripts/app.models").TeamPlacement,
    TippekonkurranseData = require("../../../shared/scripts/app.models").TippekonkurranseData;

describe("TeamPlacement objects", function () {
    "use strict";

    it("should be a function", function () {
        expect(TeamPlacement).to.exist;
        expect(TeamPlacement).to.be.a.function;
        expect(TeamPlacement()).to.be.a.function;
        expect(new TeamPlacement()).to.be.a.function;
    });

    it("should have 'name' property", function () {
        //expect(TeamPlacement.prototype.name).to.exist;
        //expect(TeamPlacement().name).to.exist;
        //expect(new TeamPlacement().name).to.exist;
        expect(TeamPlacement("myName").name).to.exist;
        expect(new TeamPlacement("myName").name).to.exist;
    });

    // TODO: complete this specification...

    //this.name = teamName;
    //this.no = placement;
    //this.matches = numberOfMatchesPlayed;

});


describe("TippekonkurranseData constructor function / objects", function () {
    "use strict";

    it("should be a function", function () {
        expect(TippekonkurranseData).to.exist;
        expect(TippekonkurranseData).to.be.a.function;
    });

    it("should be a constructor function", function () {
        expect(new TippekonkurranseData()).to.be.an.instanceof(TippekonkurranseData);
    });

    it("should be a constructor function always calling 'new'", function () {
        expect(TippekonkurranseData()).to.be.an.instanceof(TippekonkurranseData);
    });

    it("should have private properties", function () {
        var tippekonkurranseData = new TippekonkurranseData();
        expect(tippekonkurranseData.useDefaultValues).to.not.exist;
    });

    it("should have properties with default values", function () {
        var tippekonkurranseData = new TippekonkurranseData();

        expect(tippekonkurranseData.isLive).to.be.a.property;
        expect(tippekonkurranseData.isLive).to.be.null;
        expect(tippekonkurranseData.tippeligaTable).to.be.a.property;
        expect(tippekonkurranseData.tippeligaTable).to.be.null;
        expect(tippekonkurranseData.tippeligaTopScorer).to.be.a.property;
        expect(tippekonkurranseData.tippeligaTopScorer).to.be.null;
        expect(tippekonkurranseData.adeccoligaTable).to.be.a.property;
        expect(tippekonkurranseData.adeccoligaTable).to.be.null;
        expect(tippekonkurranseData.remainingCupContenders).to.be.a.property;
        expect(tippekonkurranseData.remainingCupContenders).to.be.null;
        //expect(tippekonkurranseData.currentYear).to.be.a.property;
        //expect(tippekonkurranseData.currentYear).to.be.equal(new Date().getFullYear());
        //expect(tippekonkurranseData.year).to.be.a.property;
        //expect(tippekonkurranseData.year).to.be.null;
        expect(tippekonkurranseData.currentRound).to.be.a.property;
        expect(tippekonkurranseData.currentRound).to.be.equal(0);
        expect(tippekonkurranseData.round).to.be.a.property;
        expect(tippekonkurranseData.round).to.be.equal(0);
        expect(tippekonkurranseData.currentDate).to.be.a.property;
        expect(tippekonkurranseData.currentDate).to.be.above(new Date().setSeconds(new Date().getSeconds() - 1));
        expect(tippekonkurranseData.date).to.be.a.property;
        expect(tippekonkurranseData.date).to.be.null;
        expect(tippekonkurranseData.matchesCountGrouping).to.be.a.property;
        expect(tippekonkurranseData.matchesCountGrouping).to.be.null;
        expect(tippekonkurranseData.scores).to.be.a.property;
        expect(tippekonkurranseData.scores).to.be.null;
    });

    it("should have a properties with given, ordered, values", function () {
        var tippekonkurranseData = new TippekonkurranseData([]);
        expect(tippekonkurranseData.tippeligaTable).to.be.null;
        tippekonkurranseData = new TippekonkurranseData([
            true, ["a", "b"], [], [], [], 2014, 2014, 1, 1, new Date(), new Date(), null, null
        ]);
        expect(tippekonkurranseData.tippeligaTable).to.be.deep.equal(["a", "b"]);
    });

    it("should be sealed", function () {
        var tippekonkurranseData = new TippekonkurranseData();
        expect(Object.isSealed(tippekonkurranseData)).to.be.true;
    });

    it("should not be frozen", function () {
        var tippekonkurranseData = new TippekonkurranseData();
        expect(Object.isFrozen(tippekonkurranseData)).to.be.false;
    });

    it("should deny any other properties", function () {
        var tippekonkurranseData = new TippekonkurranseData();
        try {
            tippekonkurranseData.tippeligaTable = "something";
            tippekonkurranseData.unknownProperty = "something else";
            fail(null, null, "Property 'unknownProperty' should not be allowed to be added");
        } catch (e) {
            expect(e.message).to.be.equal("Can't add property unknownProperty, object is not extensible");
        }
    });

    it("should have a 'toArray' function, containing all public properties in a well-defined order", function () {
        expect(TippekonkurranseData.prototype.toArray).to.exist;
        expect(TippekonkurranseData.prototype.toArray).to.be.a.function;
        expect(new TippekonkurranseData().toArray).to.exist;
        expect(new TippekonkurranseData().toArray).to.be.a.function;

        var isLive = true,
            tippeligaTable = [],
            tippeligaTopScorer = [],
            adeccoligaTable = [],
            remainingCupContenders = [],
            currentRound = 23,
            round = 2,
            currentDate = new Date(),
            date = new Date().setMonth(new Date().getMonth() - 2),
            matchesCountGrouping = null,
            scores = null,

            tippekonkurranseData = new TippekonkurranseData(),
            tippekonkurranseDataArray = null;

        // Arbitrary order of properties
        tippekonkurranseData.adeccoligaTable = adeccoligaTable;
        tippekonkurranseData.round = round;
        tippekonkurranseData.matchesCountGrouping = matchesCountGrouping;
        tippekonkurranseData.isLive = isLive;
        tippekonkurranseData.currentDate = currentDate;
        tippekonkurranseData.tippeligaTopScorer = tippeligaTopScorer;
        tippekonkurranseData.tippeligaTable = tippeligaTable;
        tippekonkurranseData.date = date;
        tippekonkurranseData.scores = scores;
        tippekonkurranseData.remainingCupContenders = remainingCupContenders;
        tippekonkurranseData.currentRound = currentRound;

        // Predefined order in toArray() function
        tippekonkurranseDataArray = tippekonkurranseData.toArray();
        expect(tippekonkurranseDataArray[0]).to.equal(isLive);
        expect(tippekonkurranseDataArray[1]).to.equal(tippeligaTable);
        expect(tippekonkurranseDataArray[2]).to.equal(tippeligaTopScorer);
        expect(tippekonkurranseDataArray[3]).to.equal(adeccoligaTable);
        expect(tippekonkurranseDataArray[4]).to.equal(remainingCupContenders);
        expect(tippekonkurranseDataArray[5]).to.equal(round);
        expect(tippekonkurranseDataArray[6]).to.equal(date);
        expect(tippekonkurranseDataArray[7]).to.equal(currentRound);
        expect(tippekonkurranseDataArray[8]).to.equal(currentDate);
        expect(tippekonkurranseDataArray[9]).to.equal(matchesCountGrouping);
        expect(tippekonkurranseDataArray[10]).to.equal(scores);
    });
});
