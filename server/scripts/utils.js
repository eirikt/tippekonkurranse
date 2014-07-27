/* global require:false */

// Module dependencies, external
var __ = require("underscore"),
    moment = require("moment"),


// Module dependencies, local


// Global helpers

    /**
     * A simple timestamp in brackets, suitable for log line preambles.
     * @returns {String} Simple date-in-square-brackets string
     */
    logPreamble = exports.logPreamble = function () {
        "use strict";
        return "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] ";
    },


// TODO: Extract generic requestions out of here to a standalone reusable lib, and document it!

    /**
     * Trivial RQ.js requestion => the identity function.
     * Convenient for triggering arrays of RQ.js requestors.
     * @return {*} The given argument
     */
    rqGo = exports.rqGo = function (value) {
        "use strict";
        return value;
    },

    nullRequestor = exports.nullArg = function (requestion, args) {
        "use strict";
        return requestion(null, undefined);
    },

    identityRequestory = exports.identity = function (value) {
        "use strict";
        return function requestor(requestion, args) {
            return requestion(value, undefined);
        };
    },

    functionWrapperRequestory = exports.requestor = function (func) {
        "use strict";
        return function requestor(requestion, args) {
            return requestion(func(args), undefined);
        };
    };
