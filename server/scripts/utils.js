/* global require:false */

// Module dependencies, external
var moment = require("moment"),

// Module dependencies, local

// Global helpers
    logPreamble = exports.logPreamble = function () {
        "use strict";
        return "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] ";
    };
