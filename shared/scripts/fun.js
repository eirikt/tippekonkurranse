/* global define:false */
/* jshint -W014, -W121 */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({
    define: typeof define === 'function' ? define : function (A, F) {
        'use strict';
        module.exports = F.apply(null, A.map(require));
    }
}).

    define([], function () {
        'use strict';
        var
            /**
             * Local reference for faster look-up
             * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
             */
            _slice = Array.prototype.slice,

            _map = Array.prototype.map,

            /**
             * @see http://underscorejs.org/#isArray
             */
            _isArray = Array.isArray || function (obj) {
                    return Object.prototype.toString.call(obj) === '[object Array]';
                },

            /**
             * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
             */
            _toArray = function (x) {
                return _slice.call(x);
            },

            /**
             * @see http://fitzgen.github.com/wu.js/
             */
            _curry = function (fn /* variadic number of args */) {
                var args = _slice.call(arguments, 1);
                return function () {
                    return fn.apply(this, args.concat(_toArray(arguments)));
                };
            },

            /**
             * @see http://fitzgen.github.com/wu.js/
             */
            _autoCurry = function (fn, numArgs) {
                numArgs = numArgs || fn.length;
                var f = function () {
                    if (arguments.length < numArgs) {
                        return (numArgs - arguments.length > 0)
                            ? _autoCurry(_curry.apply(this, [ fn ].concat(_toArray(arguments))), numArgs - arguments.length)
                            : _curry.apply(this, [ fn ].concat(_toArray(arguments)));
                    }
                    return fn.apply(this, arguments);
                };
                f.toString = function () {
                    return fn.toString();
                };
                f.curried = true;
                return f;
            },

            /**
             * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
             */
            _decorateFunctionPrototypeWithAutoCurry = (function () {
                Function.prototype.autoCurry = function (n) {
                    return _autoCurry(this, n);
                };
            }());

        return {
            slice: _slice,
            map: _map,
            isArray: _isArray,
            toArray: _toArray,
            curry: _curry
        };
    }
);
