/* global exports:false */

var

///////////////////////////////////////////////////////////////////////////////
// A generic cache
///////////////////////////////////////////////////////////////////////////////

    _cache = {},

    /**
     * <p>
     * Write to cache:
     * <pre>
     *     f(key) = F(callback(x))
     * </pre>
     * </p>
     * <p>
     * This function is just a NOOP function -
     * with the side effect of writing the arg to the associative array cache object using the given cache key.
     * </p>
     */
    cacheWrite = exports.cacheWrite = exports.write =
        function (cacheKey) {
            'use strict';
            return function (callback, argsToBeCached) {
                _cache[cacheKey] = argsToBeCached;
                return callback(argsToBeCached, undefined);
            };
        },

    /**
     * <p>
     * Read from cache:
     * <pre>
     *     f(key) = F(callback(cache[key]))
     * </pre>
     * </p>
     * <p>
     * This function hi-jacks the argument-passing by substituting the callback arguments with a previously cached variable.
     * </p>
     */
    cacheRead = exports.cacheRead = exports.read =
        function (cacheKey) {
            'use strict';
            return function (callback, args) {
                return callback(_cache[cacheKey], undefined);
            };
        },


///////////////////////////////////////////////////////////////////////////////
// A stack
///////////////////////////////////////////////////////////////////////////////

    _stack = [],

    _getStack = exports._getStack =
        function () {
            'use strict';
            return _stack;
        },

    _resetStack = exports._resetStack =
        function () {
            'use strict';
            _stack = [];
        },

    stackPush = exports.stackPush = exports.push =
        function (callback, args) {
            'use strict';
            _stack.push(args);
            return callback(args, undefined);
        },

    stackPop = exports.stackPop = exports.pop =
        function (callback, args) {
            'use strict';
            return callback(_stack.pop(), undefined);
        };
