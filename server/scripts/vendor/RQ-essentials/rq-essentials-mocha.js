/* global require:false, exports:false */

var RQ = require('async-rq'),
    rq = require('./rq-essentials'),

    /**
     * Typical execution of Mocha-based specification/test of requestors.
     *
     * Do something like this:
     * <pre>
     *     it("should execute an asynchronous test using RQ", function (done) {
     *         var inputArgs = ["a", "b"],
     *             verify = function (args) {
     *                 expect(args.myProperty).to.equal(2);
     *             };
     *
     *      require("rq-essentials").executeAndVerify(requestorToTest, inputArgs, verify, done);
     *  });
     * </pre>
     */
    _executeAndVerify = exports.executeAndVerify =
        function (requestorToTest, initialArguments, verifyFunction, doneFunction) {
            'use strict';
            RQ.sequence([
                requestorToTest,
                rq.requestorize(verifyFunction),
                rq.requestorize(doneFunction)
            ])(rq.identity, initialArguments);
        };
