var expect = require("../../../node_modules/chai/chai.js").expect,

    __ = require('../../../node_modules/underscore/underscore-min'),
    stringExtensions = require('../../../shared/scripts/string-extensions');


describe("StringExtensions", function () {
    "use strict";

    describe("unSnakify string extension", function () {
        it("should exist as a string method", function () {
            expect(String.prototype.unSnakify).to.exist;
            expect(__.isFunction(String.prototype.unSnakify)).to.be.true;

            expect('aString'.unSnakify).to.exist;
            expect(__.isFunction('aString'.unSnakify)).to.be.true;
        });

        it("should leave non-snakified strings alone", function () {
            expect("johnny".unSnakify()).to.equal("johnny");
            expect("Johnny".unSnakify()).to.equal("Johnny");

            expect("johnny boy".unSnakify()).to.equal("johnny boy");
            expect("Johnny boy".unSnakify()).to.equal("Johnny boy");
        });

        it("should un-snakify string, leaving case alone", function () {
            expect("johnny_boy".unSnakify()).to.equal("johnny boy");
            expect("Johnny_boy".unSnakify()).to.equal("Johnny boy");
            expect("johnny_Boy".unSnakify()).to.equal("johnny Boy");
            expect("Johnny_Boy".unSnakify()).to.equal("Johnny Boy");
        });

        it("should un-snakify long strings", function () {
            expect("johnny_boy_goes_home".unSnakify()).to.equal("johnny boy goes home");
            expect("johnny_boy_goes home".unSnakify()).to.equal("johnny boy goes home");
        });
    });

    describe("titleCase string extension", function () {
        it("should exist as a string method", function () {
            expect(String.prototype.titleCase).to.exist;
            expect(__.isFunction(String.prototype.titleCase)).to.be.true;

            expect('aString'.titleCase).to.exist;
            expect(__.isFunction('aString'.titleCase)).to.be.true;
        });

        it("should leave title-cased strings alone", function () {
            expect("Johnny Boy".titleCase()).to.equal("Johnny Boy");
        });

        it("should title-case string", function () {
            expect("Johnny boy".titleCase()).to.equal("Johnny Boy");
        });

        it("should title-case long strings", function () {
            expect("johnny boy goes home".titleCase()).to.equal("Johnny Boy Goes Home");
            expect("johnny Boy goes Home".titleCase()).to.equal("Johnny Boy Goes Home");
        });
    });
});
