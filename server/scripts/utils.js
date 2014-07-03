/* global require:false */

// Module dependencies, external
var __ = require("underscore"),
    moment = require("moment"),


// Module dependencies, local


// Global helpers

    /** @returns {String} Simple date-in-square-brackets string */
    logPreamble = exports.logPreamble = function () {
        "use strict";
        return "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] ";
    },

    /**
     * Trivial RQ.js requestion => the identity function.
     * Convenient for triggering arrays of RQ.js requestors.
     */
    rqGo = exports.rqGo = __.identity;
