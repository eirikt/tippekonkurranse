/* global require:false, exports:false, console:false, JSON:false */

var __ = require('underscore'),
    httpResponse = require('statuses'),
    rq = require('./rq-essentials'),

// TODO: Document ...
    /**
     * ...
     *
     * Charset will by default be set to UTF-8.
     * Content Type will by default be set to 'application/json'.
     */
    dispatchResponseStatusCode = exports.dispatchResponseStatusCode =
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


// TODO: Document ...
    /**
     * Include the complete requestor argument as response body as is.
     *
     * Charset will by default be set to UTF-8.
     * Content Type will by default be set to 'application/json'.
     */
    dispatchResponseWithScalarBody = exports.dispatchResponseWithScalarBody =
        function (doLog, statusCode, response) {
            'use strict';
            return function requestor(callback, responseBody) {
                if (doLog) {
                    console.log('RQ-essentials-express4 :: HTTP Response status code ' + statusCode + ' { ' + JSON.stringify(responseBody) + ' }');
                }
                response.status(statusCode).json(responseBody);
                return callback(responseBody, undefined);
            };
        },


// TODO: Document ...
    /**
     * Include the given properties (stated in "responseKeys" array) only,
     * picked from the requestor argument ("responseValues" object) as response body.
     *
     * Charset will by default be set to UTF-8.
     * Content Type will by default be set to 'application/json'.
     */
    dispatchResponseWithJsonBody = exports.dispatchResponseWithJsonBody =
        function (doLog, statusCode, responseKeys, response) {
            'use strict';
            return function requestor(callback, responseValues) {
                var responseBodyPropertyKeys = Array.isArray(responseKeys) ? responseKeys : [responseKeys],
                    responseBody = {};

                responseBodyPropertyKeys.map(function (responseBodyPropertyKey) {
                    responseBody[responseBodyPropertyKey] = responseValues[responseBodyPropertyKey];
                });
                if (doLog) {
                    console.log('RQ-essentials-express4 :: HTTP Response status code ' + statusCode + ' { ' + JSON.stringify(responseBody) + ' }');
                }
                response.status(statusCode).json(responseBody);
                return callback(responseValues, undefined);
            };
        },


///////////////////////////////////////////////////////////////////////////////
// Handlers and instigators.

// RQ requestor chains need an initial callback function to start executing.
// This callback function also acts as a handler completed requestor chains.
// The callback function has two arguments: <code>success</code> and <code> failure</code>,
// handling both successful executions and failures, e.g. timeouts.
///////////////////////////////////////////////////////////////////////////////

    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * The identity function as a vanilla requestor chain executor/handler.
     * </p>
     * <p>
     * <em>Aliases</em>
     * </p>
     * <p>
     * <ul>
     *     <li><code>run</code></li>
     *     <li><code>go</code></li>
     * </ul>
     * </p>
     * ...
     * <p>
     * <em>Usage examples</em>
     * </p>
     * <p>
     * Convenient for triggering execution of RQ requestor chains:
     * <pre>
     *     var RQ = ('async-rq'),
     *         rq = ('rq-essentials'),
     *         run = rq.run;
     *
     *     RQ.sequence([
     *         myRequestor,
     *         myNextRequestor,
     *         ...
     *     ])(run)
     * </pre>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     */
    vanillaExecutor = exports.vanillaExecutor =
        rq.identity,


    /**
     * Success handling: Only supports status code only, via (Number) incoming argument.
     *
     * @function
     * @private
     */
    _handleSuccess = function (success, failure, request, response) {
        'use strict';
        var successMessage,
            uri = request.originalUrl,
            internalServerError = httpResponse['Internal Server Error'],
            statusCode = internalServerError;

        if (__.isNumber(success)) {
            statusCode = success;
            successMessage = httpResponse[statusCode];
            response.status(statusCode).json(successMessage);
        }
        console.log('RQ-essentials-express4 :: Resource \'' + uri + '\' processed successfully (' + successMessage + ')');

        if (failure) {
            console.warn('RQ-essentials-express4 :: Resource \'' + uri + '\' processed successfully, but failure also present (' + failure + ')');
        }
    },


    /**
     * Failure handling: Supports timeout handling and all kinds of failures, with 500 Internal Server Error aa the default error response code.
     *
     * @function
     * @private
     */
    _handleFailure = function (success, failure, request, response) {
        'use strict';
        var failureMessage,
            internalServerError = httpResponse['Internal Server Error'],
            statusCode = internalServerError;

        if (__.isFunction(failure)) {
            failureMessage = typeof failure;

        } else if (__.isObject(failure)) {
            failureMessage = 'Details: ';
            if (failure.name) {
                failureMessage += failure.name;
                if (failure.milliseconds) {
                    failureMessage += ' after ' + failure.milliseconds + ' milliseconds';
                }
            } else {
                failureMessage = JSON.stringify(failure);
            }

        } else if (__.isNumber(failure)) {
            statusCode = failure;
            failureMessage = httpResponse[statusCode];

        } else {
            failureMessage = failure;
        }

        console.error('RQ-essentials-express4 :: Resource \'' + request.originalUrl + '\' failed! (' + failureMessage + ')');
        response.status(statusCode).json(failureMessage);
    },


    handleTimeout = exports.handleTimeout =
        function (request, response) {
            'use strict';
            return function (success, failure) {
                if (failure) {
                    _handleFailure(success, failure, request, response);
                }
            };
        },


    handleTimeoutAndStatusCode = exports.handleTimeoutAndStatusCode =
        function (request, response) {
            'use strict';
            return function (success, failure) {
                if (success) {
                    _handleSuccess(success, failure, request, response);
                    return;
                }
                if (failure) {
                    _handleFailure(success, failure, request, response);
                }
            };
        };
