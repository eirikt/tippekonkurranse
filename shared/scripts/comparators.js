/* global define:false */
/* jshint -W106 */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({
    define: typeof define === 'function' ? define : function (A, F) {
        'use strict';
        module.exports = F.apply(null, A.map(require));
    }
}).

    define(['./fun'], function (F) {
        'use strict';

        var
            /**
             * JavaScript's default way of accessing object properties and array elements.
             *
             * @return The property with the given <code>propertyName</code> in the given object
             */
            _propertyGetter = function (propertyName, object) {
                return object[propertyName];
            },


            /**
             * Backbone.js' way of accessing model properties, 'getters' and 'setters'.
             *
             * @returns The property with the given <code>propertyName</code> in the given Backbone Model object
             */
            _backbonePropertyGetter = function (propertyName, backboneModelObject) {
                return backboneModelObject.get(propertyName);
            },


            /**
             * @returns Comparator equal (being 0)
             */
            _alwaysEqualComparator = function (object, otherObject) {
                return 0;
            },


        // TODO: Add support/polyfill for IE10 and Safari
            /**
             * Alphanumeric comparators works for Strings.
             * The support for comparator distance is not yet fully supported.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
             * @returns The comparator (x < 0 < y) value
             */
            _alphanumericAscendingValueComparator = function (locale, options, value, otherValue) {
                return value.localeCompare(otherValue, locale, options);
            }.autoCurry(),


            /**
             * Arithmetic comparators works for Numbers and Dates.
             * In addition to the comparator (x < 0 < y) function, it returns the distance between the two arguments.
             */
            _arithmeticAscendingValueComparator = function (value, otherValue) {
                return value - otherValue;
            },


            /**
             * Wrapper around the two sorting scheme functions above.
             */
            _typeAwareAscendingValueComparator = function (locale, options, value, otherValue) {
                if (F.isString(value)) {
                    return _alphanumericAscendingValueComparator(locale, options, value, otherValue);
                }
                return _arithmeticAscendingValueComparator(value, otherValue);
            }.autoCurry(),


            /**
             * Curry-friendly ascending comparator function.
             *
             * @param propertyGetter {Function} Function for obtaining properties from the objects being compared
             * @param nextComparator {Function} The (next) comparator function to call if this comparator cannot decide the object order
             * @param propertyName {String} The name of the property to be compared
             * @param object {Object} object to be compared
             * @param otherObject {Object} object to be compared against
             */
            _chainable_AscendingComparator = function (locale, options, propertyGetter, nextComparator, propertyName, object, otherObject) {
                var compareResult = _typeAwareAscendingValueComparator(locale, options, propertyGetter(propertyName, object), propertyGetter(propertyName, otherObject));
                if (!compareResult) {
                    return nextComparator(object, otherObject);
                }
                return compareResult;
            }.autoCurry(),


            /**
             * Multi-property ascending comparator function.
             *
             * @param locale {String} TODO: ...
             * @param options {Object} TODO: ...
             * @param propertyGetter {Function} Function for obtaining properties from the objects being compared
             * @param propertyNameArray {[String]} Ordered names of the object properties to be compared
             * @param object {Object} object to be compared
             * @param otherObject {Object} object to be compared against
             */
            _ascendingComparator = function (locale, options, propertyGetter, propertyNameArray, object, otherObject) {
                var propertyArray = F.isArray(propertyNameArray) ? propertyNameArray : [propertyNameArray],
                    propertyName, i, ascendingComparator;

                propertyName = propertyArray[propertyArray.length - 1];
                ascendingComparator = _chainable_AscendingComparator(locale, options, propertyGetter, _alwaysEqualComparator, propertyName);
                for (i = propertyArray.length - 2; i >= 0; i -= 1) {
                    propertyName = propertyArray[i];
                    ascendingComparator = _chainable_AscendingComparator(locale, options, propertyGetter, ascendingComparator, propertyName);
                }
                return ascendingComparator(object, otherObject);
            }.autoCurry(),


        // TODO: Move to application config
            norwegianLocale = 'nb-NO',

        // TODO: Move to application config
            norwegianCompareOptions = { usage: 'sort', sensitivity: 'variant' };


        return {
            // "Private" functions exported for specification/testing purposes.
            _propertyGetter: _propertyGetter,
            _backbonePropertyGetter: _backbonePropertyGetter,
            _arithmeticAscendingValue: _arithmeticAscendingValueComparator,
            _alphanumericAscendingValue: _alphanumericAscendingValueComparator(norwegianLocale, norwegianCompareOptions),
            _alwaysEqual: _alwaysEqualComparator,
            // /"Private" functions

            // Public API
            // TODO: Move locale config to application
            ascendingByProperty: _ascendingComparator(norwegianLocale, norwegianCompareOptions, _propertyGetter),
            ascendingByArrayElement: _ascendingComparator(norwegianLocale, norwegianCompareOptions, _propertyGetter),
            ascendingByBackboneProperty: _ascendingComparator(norwegianLocale, norwegianCompareOptions, _backbonePropertyGetter)
        };
    }
);
