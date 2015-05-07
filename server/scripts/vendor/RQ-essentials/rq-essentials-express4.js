/* global exports:false, console:false, JSON:false */

var _dispatchResponseStatusCode = exports.dispatchResponseStatusCode =
        function (doLog, statusCode, response) {
            'use strict';
            return function requestor(callback, args) {
                if (doLog) {
                    console.log('RQ-essentials-express4 :: HTTP Response status code ' + statusCode);
                }
                response.sendStatus(statusCode);
                return callback(args, undefined);
            };
        },

    _dispatchResponseWithScalarBody = exports.dispatchResponseWithScalarBody =
        function (doLog, statusCode, response) {
            'use strict';
            return function requestor(callback, responseBody) {
                if (doLog) {
                    console.log('RQ-essentials-express4 :: HTTP Response status code ' + statusCode + ' { ' + JSON.stringify(responseBody) + ' }');
                }
                response.status(statusCode).send(responseBody);
                return callback(responseBody, undefined);
            };
        },

    _dispatchResponseWithJsonBody = exports.dispatchResponseWithJsonBody =
        function (doLog, statusCode, responseKeys, response) {
            'use strict';
            return function requestor(callback, responseValues) {
                var responseBodyPropertyKeys = Array.isArray(responseKeys) ? responseKeys : [responseKeys],
                    responseBodyPropertyValues = Array.isArray(responseValues) ? responseValues : [responseValues],
                    responseBody = {};

                responseBodyPropertyKeys.map(function (responseBodyPropertyKey, index) {
                    responseBody[responseBodyPropertyKey] = responseBodyPropertyValues[index];
                });
                if (doLog) {
                    console.log('RQ-essentials-express4 :: HTTP Response status code ' + statusCode + ' { ' + JSON.stringify(responseBody) + ' }');
                }
                response.status(statusCode).send(responseBody);
                return callback(responseValues, undefined);
            };
        };
