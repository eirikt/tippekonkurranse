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

        // TODO: move this shared-lib
        /** String.trim() extension */
        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }

        /** String.startsWith() extension */
        if (typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (prefix) {
                return this.indexOf(prefix) === 0;
            };
        }

        /** String.endsWith() extension */
        if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function (suffix) {
                return this.indexOf(suffix, this.length - suffix.length) !== -1;
            };
        }

        /** String.contains() extension */
        if (typeof String.prototype.contains !== 'function') {
            String.prototype.contains = function (str) {
                return this.indexOf(str) !== -1;
            };
        }

        /** String.capitalize() extension */
        if (typeof String.prototype.capitalize !== 'function') {
            String.prototype.capitalize = function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            };
        }

        /** String.titleCase() extension */
        if (typeof String.prototype.titleCase !== 'function') {
            String.prototype.titleCase = function () {
                var words = this.split(/ /g),
                    titleCasedWords = __.map(words, function (word) {
                        return word.capitalize();
                    });
                return titleCasedWords.join(' ');
            };
        }

        /** String.snakify() extension */
        if (typeof String.prototype.snakify !== 'function') {
            String.prototype.snakify = function () {
                throw new Error('Not implemented');
            };
        }

        /** String.unSnakify() extension */
        if (typeof String.prototype.unSnakify !== 'function') {
            String.prototype.unSnakify = function () {
                return this.replace(/_/g, ' ');
            };
        }

        /** String.camelize() extension */
        if (typeof String.prototype.camelize !== 'function') {
            String.prototype.camelize = function (str) {
                throw new Error('Not implemented');
            };
        }

        /** String.unCamelize() extension */
        if (typeof String.prototype.unCamelize !== 'function') {
            String.prototype.unCamelize = function (str) {
                throw new Error('Not implemented');
            };
        }

        /** String.humanize() extension */
        if (typeof String.prototype.humanize !== 'function') {
            String.prototype.humanize = function (str) {
                throw new Error('Not implemented');
            };
        }
    }
);
