/* global define:false, root:false */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({
    define: typeof define === 'function' ? define : function (A, F) {
            'use strict';
            module.exports = F.apply(null, A.map(require));
        }
}).

/**
 * Just extract function out of here as you find a more suitable and precise location for them ...
 */
define(['underscore', 'moment', './fun'], function (__, moment, fun) {
        'use strict';

        /**
         * A simple timestamp in brackets, suitable for log line preambles.
         * @returns {String} Simple date-in-square-brackets string
         */
        var _logPreamble = function () {
                return '[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] ';
            },


            /** Object.defineProperty config function */
            _mutablePropertyWithDefaultValue = function (defaultValue) {
                return {
                    value: defaultValue,
                    writable: true,
                    enumerable: true,
                    configurable: false
                };
            },


            /** Object.defineProperty config function */
            _immutablePropertyWithDefaultValue = function (defaultValue) {
                return {
                    value: defaultValue,
                    writable: false,
                    enumerable: true,
                    configurable: false
                };
            },


            // TODO: Move to 'location-points-calculation.js' or something like that
            /**
             * ...
             *
             * @param {string} polarity - The polarity of the point as either '-' for negative point numbers, or '+' for positive point numbers
             * @param {number} weight - The amount of points given if match is found
             * @param {number|string} predictedValue - First value to be tested for equality
             * @param {number|string} actualValue - Second value to be tested for equality
             * @returns {number} The calculated points based on given arguments
             */
            _getMatchPoints = function (polarity, weight, predictedValue, actualValue) {
                var polarityCoefficient = polarity === '-' ? -1 : 1,
                    matchPoints = __.isEqual(predictedValue, actualValue) ? weight : 0;

                return polarityCoefficient * matchPoints;
            },


            /**
             * ...
             *
             * @param {string} polarity - The polarity of the point as either '-' for negative point numbers, or '+' for positive point numbers
             * @param {number} weight - The amount of points given if match is found
             * @param valuesToBeTestedForPresence {number|number[]|string|string[]}
             * @param targetValues {number|number[]|string|string[]}
             * @returns {number} The calculated points based on given arguments
             */
                // TODO: Consider renaming to '_getPresentPoints'
            _getSinglePresentPoints = function (polarity, weight, valuesToBeTestedForPresence, targetValues) {
                var polarityCoefficient = polarity === '-' ? -1 : 1,
                    valuesToBeTestedForPresenceArr = __.isArray(valuesToBeTestedForPresence) ? valuesToBeTestedForPresence : [valuesToBeTestedForPresence],
                    targetValuesArr = __.isArray(targetValues) ? targetValues : [targetValues];

                if (valuesToBeTestedForPresenceArr.some(function (element) {
                        return __.contains(targetValuesArr, element);
                    })) {
                    return polarityCoefficient * weight;
                }
                return 0;
            },


            /**
             * ...
             *
             * @param {string} polarity - The polarity of the point as either '-' for negative point numbers, or '+' for positive point numbers
             * @param {number} weight - The amount of points given if match is found
             * @param valuesToBeTestedForPresence {number|number[]|string|string[]}
             * @param targetValues {number|number[]|string|string[]}
             * @returns {number} The calculated points based on given arguments
             */
                // TODO: Rename to '_getAllPresentPoints'
            _getPresentPoints = function (polarity, weight, valuesToBeTestedForPresence, targetValues) {
                var polarityCoefficient = polarity === '-' ? -1 : 1,
                    valuesToBeTestedForPresenceArr = __.isArray(valuesToBeTestedForPresence) ? valuesToBeTestedForPresence : [valuesToBeTestedForPresence],
                    targetValuesArr = __.isArray(targetValues) ? targetValues : [targetValues];

                if (valuesToBeTestedForPresenceArr.every(function (element) {
                        return __.contains(targetValuesArr, element);
                    })) {
                    return polarityCoefficient * weight;
                }
                return 0;
            },


            // TODO: Describe and document!
            _getDisplacementPoints = function (polarity, weight, predictedLocation, actualLocation) {
                var absoluteDisplacement = Math.abs(predictedLocation - actualLocation),
                    weightedAbsoluteDisplacement = weight * absoluteDisplacement;

                return polarity === '-' ? -weightedAbsoluteDisplacement : weightedAbsoluteDisplacement;
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
            _maxDisplacementSumInPermutationOfLength = function (n) {
                if (!__.isNumber(n) || n % 1 !== 0) {
                    throw new Error('Natural number (including zero) argument is mandatory');
                }
                return Math.floor(Math.pow(n, 2) / 2);
            },


            // TODO: Describe and document!
            // How generic is this function really ...?
            _mergeArgsIntoArray = function (valueOrArrayArgs, targetArray, argIndex, argIndexCompensator) {
                var i = 0,
                    isArray = Array.isArray,
                    calculatedScores;

                if (!argIndexCompensator) {
                    argIndexCompensator = 0;
                }

                calculatedScores = valueOrArrayArgs[argIndex - argIndexCompensator];

                if (calculatedScores) {
                    if (isArray(calculatedScores)) {
                        for (; i < calculatedScores.length; i += 1) {
                            targetArray[argIndex + i] = calculatedScores[i];
                        }
                        argIndexCompensator = argIndexCompensator + calculatedScores.length - 1;
                    } else {
                        targetArray[argIndex] = calculatedScores;
                    }
                }
                return argIndexCompensator;
            },

            /***
             * TODO: Preliminary ...
             */
            _memoizationWriter = function (logContent, cache, writeCondition, key, data) {
                if (!cache[key]) {
                    cache[key] = {};
                }
                if (!writeCondition || writeCondition && writeCondition()) {
                    cache[key].value = __.clone(data);
                    cache[key].numberOfHits = 0;
                    if (logContent) {
                        console.log(_logPreamble() + "[key=" + key + "] CACHED (" + JSON.stringify(data) + ")");
                    } else {
                        console.log(_logPreamble() + "[key=" + key + "] CACHED");
                    }
                } else {
                    if (logContent) {
                        console.log(_logPreamble() + "[key=" + key + "] NOT CACHED (" + JSON.stringify(data) + ")");
                    } else {
                        console.log(_logPreamble() + "[key=" + key + "] NOT CACHED");
                    }
                }
                return data;
            },

            /***
             * TODO: Preliminary ...
             */
            _memoizationReader = function (cache, key) {
                if (cache) {
                    var cacheObj = cache[key];
                    if (cacheObj) {
                        cacheObj.numberOfHits += 1;
                        console.log(_logPreamble() + "[key=" + key + "] read for the " + cacheObj.numberOfHits + ". time");
                        return cacheObj.value;
                    }
                } else {
                    console.log(_logPreamble() + "[key=" + key + "] not found");
                }
            };


        return {
            logPreamble: _logPreamble,
            mutablePropertyWithDefaultValue: _mutablePropertyWithDefaultValue,
            immutablePropertyWithDefaultValue: _immutablePropertyWithDefaultValue,
            getMatchPoints: _getMatchPoints,
            getAllPresentPoints: _getPresentPoints,
            getPresentPoints: _getSinglePresentPoints,
            getDisplacementPoints: _getDisplacementPoints,
            maxDisplacementSumInPermutationOfLength: _maxDisplacementSumInPermutationOfLength,

            mergeArgsIntoArray: _mergeArgsIntoArray,

            never: fun.curry(__.identity, false),
            always: fun.curry(__.identity, true),
            memoizationWriter: _memoizationWriter,
            memoizationReader: _memoizationReader
        };
    }
);
