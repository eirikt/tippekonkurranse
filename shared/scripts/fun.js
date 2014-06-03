(function (name, definition) {
    'use strict';
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('fun', function () {
    'use strict';
    var
        /**
         * Local reference for faster look-up
         * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
         */
        _slice = Array.prototype.slice,

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
        };

    return {
        slice: _slice,
        isArray: _isArray,
        toArray: _toArray,
        curry: _curry
    };
}));
