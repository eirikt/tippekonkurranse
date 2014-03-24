var root = global || window;

/* For WebStorm ...
var expect = require('../scripts/vendor/chai').expect,
    sinon = require('../scripts/vendor/sinon');
*/

describe("Trying out the test libraries", function () {

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
