/* global exports:false, JSON:false */
/* jshint -W121, -W126 */

// TODO: Specify/Test these

var

    /**
     * Local reference for faster look-up
     * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
     */
    slice = Array.prototype.slice,
//map = Array.prototype.map,
    isArray = Array.isArray,

    parse = JSON.parse,
    stringify = JSON.stringify,


//isUndefined = exports.isUndefined =
//    function (obj) {
//        'use strict';
//        return typeof obj === 'undefined';
//    },


//isString = exports.isString =
//    function (obj) {
//        'use strict';
//        return typeof obj === 'string' || obj instanceof String;
//    };//,


//isNumber = exports.isNumber =
//    function (obj) {
//        'use strict';
//        throw new Error('Not yet implemented');
//    },


//isDate = exports.isDate =
//    function (obj) {
//        'use strict';
//        throw new Error('Not yet implemented');
//    },


//isFunction = exports.isFunction =
//    function (obj) {
//        'use strict';
//        return obj && Object.prototype.toString.call(obj) === '[object Function]';
//    },


    /**
     * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
     */
    toArray = exports.toArray =
        function (x) {
            'use strict';
            return slice.call(x);
        },


    /**
     * Deep cloning.
     * It is sometimes necessary to clone arguments due to occasional <code>Object.freeze()</code> in RQ.
     */
    clone = exports.clone =
        function (arg) {
            'use strict';
            if (!arg) {
                return arg;
            }
            if (isArray(arg)) {
                return arg.slice();
            }
            return parse(stringify(arg));
        },


    /**
     * @see http://fitzgen.github.com/wu.js/
     */
    curry = exports.curry =
        function (fn /* variadic number of args */) {
            'use strict';
            var args = slice.call(arguments, 1);
            return function () {
                return fn.apply(this, args.concat(toArray(arguments)));
            };
        };

/**
 * @see http://fitzgen.github.com/wu.js/
 */
//autoCurry = exports.autoCurry = function (fn, numArgs) {
//    'use strict';
//    numArgs = numArgs || fn.length;
//    var f = function () {
//        if (arguments.length < numArgs) {
//            return numArgs - arguments.length > 0 ?
//                autoCurry(curry.apply(this, [fn].concat(toArray(arguments))), numArgs - arguments.length) :
//                curry.apply(this, [fn].concat(toArray(arguments)));
//        }
//        return fn.apply(this, arguments);
//    };
//    f.toString = function () {
//        return fn.toString();
//    };
//    f.curried = true;
//    return f;
//},


/**
 * @see https://github.com/loop-recur/FunctionalJS/blob/master/functional.js/
 */
//decorateFunctionPrototypeWithAutoCurry =
//    (function () {
//        'use strict';
//        Function.prototype.autoCurry = function (n) {
//            return autoCurry(this, n);
//        };
//    })();
