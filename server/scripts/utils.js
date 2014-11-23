/* global require:false */

// TODO: Move this lib to 'shared' area

// Module dependencies, external
var __ = require("underscore"),
    moment = require("moment"),

// Module dependencies, local

// Global helpers

    /**
     * A simple timestamp in brackets, suitable for log line preambles.
     * @returns {String} Simple date-in-square-brackets string
     */
    _logPreamble = exports.logPreamble = function () {
        "use strict";
        return "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] ";
    },

    /**
     * Maximum sum of displacements of elements in a permutation of (1..n)
     * Defined by:
     *
     *     f(n) = floor(n^2/2)
     *
     * @see http://oeis.org/A007590
     * @returns {Number} The maximum sum of displacements of elements in a permutation of given argument
     */
    _maxDisplacementSumInPermutationOfLength = exports.maxDisplacementSumInPermutationOfLength = function (n) {
        "use strict";
        if (!__.isNumber(n) || (n % 1 !== 0)) {
            throw new Error("Natural number (including zero) argument is mandatory");
        }
        return Math.floor(Math.pow(n, 2) / 2);
    };
