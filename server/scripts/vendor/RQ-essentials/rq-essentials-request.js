/* global require:false, exports:false, console:false */

var request = require('request'),
    iconv = require('iconv-lite'),

    /**
     * Simple requestor factory for HTTP GET using the "request" library.
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     *
     * @see https://github.com/mikeal/request
     * @see https://www.npmjs.org/package/request
     */
    _getRequestorizer = exports.get =
        function (encoding, uri) {
            'use strict';
            if (arguments.length < 2) {
                uri = encoding;
                encoding = null;
            }
            return function requestor(callback, args) {
                return request(uri, function (err, response, body) {
                    var decodedBody;
                    if (!err && response.statusCode === 200) {
                        if (encoding) {
                            decodedBody = iconv.decode(new Buffer(body), encoding);
                        } else {
                            decodedBody = body;
                        }
                        return callback(decodedBody);

                    } else {
                        if (!err) {
                            err = 'Unexpected HTTP status code: ' + response.statusCode + ' (only status code 200 is supported)';
                        }
                        console.error('[' + new Date().toISOString() + ' rq-essentials-request.get] ' + err);
                        return callback(undefined, err);
                    }
                });
            };
        },


    _getAndEncodeRequestorizer = exports.getEncoded =
        function (uri, encoding) {
            'use strict';
            return function requestor(callback, args) {
                return request(uri, function (err, response, body) {
                    if (!err && response.statusCode === 200) {
                        var decodedBody = iconv.decode(new Buffer(body), encoding);
                        return callback(decodedBody);

                    } else {
                        if (!err) {
                            err = 'Unexpected HTTP status code: ' + response.statusCode + ' (only status code 200 is supported)';
                        }
                        console.error('[' + new Date().toISOString() + ' rq-essentials-request.get] ' + err);
                        return callback(undefined, err);
                    }
                });
            };
        };
