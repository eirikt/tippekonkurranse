/* global require:false, exports:false, console:false, JSON:false */

var utils = require('./utils'),

    _mongoose4ModelInvocation = exports.mongoose =
        function (mongooseModel, mongooseModelFunction, conditions) {
            'use strict';

            var func = utils.isString(mongooseModelFunction) ?
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


    _mongoose4ModelInvocationJson = exports.mongooseJson =
        function (mongooseModel, mongooseModelFunctionName, conditions) {
            'use strict';
            if (!utils.isString(mongooseModelFunctionName)) {
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
                    console.log('RQ-essentials-mongoose4 :: Function name \'' + mongooseModelFunctionName + '\', returning JSON result (' + jsonResult + ')');
                    return callback(jsonResult, undefined);
                });
            };
        },


    _mongoose4QueryInvocationFactory = exports.mongooseQueryInvocation =
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
