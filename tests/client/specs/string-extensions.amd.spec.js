/* global define:false, describe:false, it:false */
/* jshint -W030 */

define(["chai", "underscore", "backbone", "../../../shared/scripts/comparators"],
    function (Chai, _) {
        "use strict";

        var expect = Chai.expect;

        describe("StringExtensions", function () {

            describe("unSnakify string extension", function () {
                it("should exist as a string method", function () {
                    expect(String.prototype.unSnakify).to.exist;
                    expect(_.isFunction(String.prototype.unSnakify)).to.be.true;

                    expect('aString'.unSnakify).to.exist;
                    expect(_.isFunction('aString'.unSnakify)).to.be.true;
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

            describe("toTitleCase string extension", function () {
                it("should exist as a string method", function () {
                    expect(String.prototype.toTitleCase).to.exist;
                    expect(_.isFunction(String.prototype.toTitleCase)).to.be.true;

                    expect('aString'.toTitleCase).to.exist;
                    expect(_.isFunction('aString'.toTitleCase)).to.be.true;
                });

                it("should leave title-cased strings alone", function () {
                    expect("Johnny Boy".toTitleCase()).to.equal("Johnny Boy");
                });

                it("should title-case string", function () {
                    expect("Johnny boy".toTitleCase()).to.equal("Johnny Boy");
                });

                it("should title-case long strings", function () {
                    expect("johnny boy goes home".toTitleCase()).to.equal("Johnny Boy Goes Home");
                    expect("johnny Boy goes Home".toTitleCase()).to.equal("Johnny Boy Goes Home");
                });
            });
        });
    }
);
