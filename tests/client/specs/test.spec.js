/* global define:false, describe:false, it:false */
/* jshint -W030 */

/* For WebStorm ...
var expect = require('../../node_modules/chai/chai').expect,
    sinon = require('../../node_modules/sinon/lib/sinon');
*/

// Meta tests ...
var hello = function () {
    "use strict";
    return "Hello world!";
};

define(["chai", "sinon"], function (Chai, Sinon) {
        "use strict";

        var expect = Chai.expect;

        describe("Trying out the test libraries", function () {

            describe("Mocha", function () {
                it("should just work ...", function () {
                });
            });

            describe("Chai", function () {
                it("should use 'expect' to check e.g. truthiness and equality", function () {
                    expect(true).to.be.OK;
                    expect(true).to.be.true;
                    expect(1 === 1).to.be.true;
                    expect(hello()).to.equal("Hello world!");
                    expect(
                        (function () {
                            return 1;
                        }())
                    ).to.equal(1);
                });
            });

            describe("Sinon.JS", function () {
                it("should exist", function () {
                    expect(Sinon).to.exist;
                });
            });

            describe("Sinon.JS", function () {
                it("should report spy being called", function () {
                    expect(hello).to.exist;
                    var helloSpy = Sinon.spy(window, "hello");
                    expect(helloSpy).to.exist;

                    expect(helloSpy.called).to.be.false;
                    expect(helloSpy.calledOnce).to.be.false;
                    expect(helloSpy.callCount).to.equal(0);
                    hello();
                    expect(helloSpy.called).to.be.true;
                    expect(helloSpy.calledOnce).to.be.true;
                    expect(helloSpy.callCount).to.equal(1);

                    hello.restore();
                });
            });
        });
    }
);
