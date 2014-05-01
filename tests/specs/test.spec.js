/* global define:false, describe:false, it:false */
/* jshint -W030 */

// A trivial global function to test ...
var hello = function () {
    "use strict";
    return "Hello world!";
};

define(['chai', 'sinon'], function (chai, sinon) {
        "use strict";

        var expect = chai.expect;

        describe("Trying out the test libraries", function () {

            describe("Mocha", function () {
                it("should just work ...", function () {
                });
            });

            describe("Chai", function () {
                it("should use 'expect' to check equality", function () {
                    expect(hello()).to.equal("Hello world!");
                });
            });

            describe("Sinon.JS", function () {
                it("should exist", function () {
                    expect(sinon).to.exist;
                });
            });

            describe("Sinon.JS", function () {
                it("should report spy being called", function () {
                    expect(hello).to.exist;
                    var helloSpy = sinon.spy(window, "hello");
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
