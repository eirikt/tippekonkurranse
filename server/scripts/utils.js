/* global require:false */

// Module dependencies, external
var __ = require("underscore"),
    promise = require("promised-io/promise"),
    moment = require("moment"),

// Module dependencies, local

// Global helpers

    /** @returns {String} Simple date-in-square-brackets string */
    logPreamble = exports.logPreamble = function () {
        "use strict";
        return "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] ";
    },

    /**
     * Async wrapper using Promised-IO.
     * @see https://github.com/kriszyp/promised-io
     * @constructor
     */
    PromisedIoAsyncExecutor = exports.PromisedIoAsyncExecutor = function (func) {
        "use strict";
        this._func = func;
        this._deferred = new promise.Deferred();
        this._success = this._deferred.resolve;
        this._failure = this._deferred.reject;
        this.exec = function () {
            var asyncReadyFunc = __.partial(this._func, this._success, this._failure);
            asyncReadyFunc.apply(this, __.toArray(arguments));
            return this._deferred.promise;
        };
    },

    /** @returns {Function} Bound PromisedIoAsyncExecutor.exec */
    asyncExecution = exports.asyncExecution = function (func) {
        "use strict";
        var wrapper = new PromisedIoAsyncExecutor(func);
        return __.bind(wrapper.exec, wrapper);
    };

