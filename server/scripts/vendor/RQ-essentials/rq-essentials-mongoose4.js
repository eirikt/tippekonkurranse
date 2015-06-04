/* global require:false, exports:false, console:false, JSON:false */

var __ = require('underscore'),

// TODO: Fix this lib, functions (including naming) seem strange and not consistent ...
    /**
     * ...
     */
    mongoose4GenericInvocationFactory = exports.mongoose =
        function (mongooseModel, mongooseModelFunction, conditions) {
            'use strict';

            var func = __.isString(mongooseModelFunction) ?
                mongooseModel[mongooseModelFunction] :
                mongooseModelFunction;

            return function requestor(callback, args) {
                func.call(mongooseModel, conditions, function (err, result) {
                    if (err) {
                        // TODO: Curry in error handler function?
                        //return error.handle(err, { rqCallback: callback });

                        return callback(undefined, err);
                    }
                    console.log('RQ-essentials-mongoose4 :: returning raw result (' + result + ')');
                    return callback(result, undefined);
                });
            };
        },


// TODO: Document ...
    /**
     * ...
     */
    mongoose4ModelGenericInvocationWithJsonResultFactory = exports.mongooseJson =
        function (mongooseModel, mongooseModelFunctionName, conditions) {
            'use strict';
            if (!__.isString(mongooseModelFunctionName)) {
                throw new Error('RQ-essentials-mongoose4 :: mongooseJson, second argument must be a String!');
            }
            var func = mongooseModel[mongooseModelFunctionName];

            return function requestor(callback, args) {
                func.call(mongooseModel, conditions, function (err, result) {
                    if (err) {
                        return callback(undefined, err);
                    }
                    var jsonResult = {};
                    jsonResult[mongooseModelFunctionName] = result;
                    console.log('RQ-essentials-mongoose4 :: Function name \'' + mongooseModelFunctionName + '\', returning JSON result (' + JSON.stringify(jsonResult) + ')');
                    return callback(jsonResult, undefined);
                });
            };
        },


// TODO: Document ...
    /**
     * ...
     */
    mongoose4FindFactory = exports.mongooseFindInvocation =
        function (type, findQuery, sortQuery, skip, limit) {
            'use strict';
            return function requestor(callback, args) {
                type.find(findQuery).sort(sortQuery).skip(skip).limit(limit).exec(function (err, books) {
                    callback(books, undefined);
                });
            };
        },


// TODO: Document ...
    /**
     * ...
     */
    mongoose4QueryInvocationFactory = exports.mongooseQueryInvocation =
        function (functionName, conditions) {
            'use strict';
            return function requestor(callback, mongooseQuery) {
                return mongooseQuery[functionName](conditions, function (err, result) {
                    if (err) {
                        console.error(err);
                        return callback(undefined, err);
                    }
                    var jsonResult = {};
                    jsonResult[functionName] = result;

                    return callback(jsonResult, undefined);
                });
            };
        };

