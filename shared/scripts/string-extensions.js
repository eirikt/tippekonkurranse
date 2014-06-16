/* global define:false */
/* jshint -W121 */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({ define: typeof define === 'function' ? define : function (A, F) {
    'use strict';
    module.exports = F.apply(null, A.map(require));
}}).

    define(['underscore'], function (__) {
        'use strict';

        var _trim = function (str) {
                return str.replace(/^\s+|\s+$/g, '');
            },
            _startsWith = function (str, prefix) {
                return str.indexOf(prefix) === 0;
            },
            _endsWith = function (str, suffix) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            },
            _contains = function (str, substr) {
                return str.indexOf(substr) !== -1;
            },
            _capitalize = function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            _toTitleCase = function (str) {
                var words = str.split(/ /g),
                    titleCasedWords = __.map(words, function (word) {
                        return _capitalize(word);
                    });
                return titleCasedWords.join(' ');
            },
            _toCamelCase = function (str) {
                throw new Error('Not implemented');
            },
            _toSnakeCase = function (str) {
                throw new Error('Not implemented');
            },
            _unSnakify = function (str) {
                return str.replace(/_/g, ' ');
            },
            _toSentenceCase = function (str) {
                throw new Error('Not implemented');
            };


        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () {
                return _trim(this);
            };
        }

        if (typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (prefix) {
                return _startsWith(this, prefix);
            };
        }

        if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function (suffix) {
                return _endsWith(this, suffix);
            };
        }

        if (typeof String.prototype.contains !== 'function') {
            String.prototype.contains = function (substr) {
                return _contains(this, substr);
            };
        }

        //if (typeof String.prototype.capitalize !== 'function') {
        String.prototype.capitalize = function () {
            return _capitalize(this);
        };
        //}

        //if (typeof String.prototype.toTitleCase !== 'function') {
        String.prototype.toTitleCase = function () {
            return _toTitleCase(this);
        };
        //}

        //if (typeof String.prototype.toSnakeCase !== 'function') {
        String.prototype.toSnakeCase = function () {
            return _toSnakeCase(this);
        };
        //}

        //if (typeof String.prototype.snakify !== 'function') {
        String.prototype.snakify = String.prototype.toSnakeCase;
        //}

        //if (typeof String.prototype.unSnakify !== 'function') {
        String.prototype.unSnakify = function () {
            return _unSnakify(this);
        };
        //}

        //if (typeof String.prototype.toCamelCase !== 'function') {
        String.prototype.toCamelCase = function () {
            return _toCamelCase(this);
        };
        //}

        //if (typeof String.prototype.camelize !== 'function') {
        String.prototype.camelize = String.prototype.toCamelCase;
        //}

        //if (typeof String.prototype.unCamelize !== 'function') {
        String.prototype.unCamelize = function (str) {
            throw new Error('Not implemented');
        };
        //}

        //if (typeof String.prototype.toSentenceCase !== 'function') {
        String.prototype.toSentenceCase = function () {
            return _toSentenceCase(this);
        };
        //}

        //if (typeof String.prototype.humanize !== 'function') {
        String.prototype.humanize = String.prototype.toSentenceCase;
        //}

        return {
            trim: _trim,
            startsWith: _startsWith,
            endsWith: _endsWith,
            contains: _contains,
            capitalize: _capitalize,
            toTitleCase: _toTitleCase,
            toCamelCase: _toCamelCase,
            toSnakeCase: _toSnakeCase,
            snakify: _toSnakeCase,
            unSnakify: _unSnakify,
            toSentenceCase: _toSentenceCase
        };
    }
);
