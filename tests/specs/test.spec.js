/* global global:false, require:false, describe:false, it:false, expect:false, sinon:false, hello:false */
/* jshint -W030 */

var root = global || window;

/* For WebStorm ...
var expect = require('../bower_components/chai/chai').expect,
    sinon = require('../bower_components/sinon/lib/sinon');
*/

describe("Trying out the test libraries", function () {
    "use strict";

    describe("Mocha", function () {
        it("should function ...", function () {
            // ...
        });
    });

    describe("Chai", function () {
        it("should be equal using 'expect'", function () {
            expect(hello()).to.equal("Hello World");
        });
    });

    describe("Sinon.JS", function () {
        it("should report spy being called", function () {
            var helloSpy = sinon.spy(root, "hello");

            expect(hello).to.exist;
            expect(helloSpy).to.exist;

            expect(helloSpy.called).to.be.false;
            hello();
            expect(helloSpy.called).to.be.true;

            hello.restore();
        });
    });
});
