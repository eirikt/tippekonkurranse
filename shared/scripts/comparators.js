/* global define:false */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({ define: typeof define === 'function' ? define : function (A, F) {
    'use strict';
    module.exports = F.apply(null, A.map(require));
}}).

    define(['./fun'], function (F) {
        'use strict';

        var
            /**
             * JavaScript's default way of accessing object properties and array elements.
             * @private
             * @return The property with the given <code>propertyName</code> in the given object
             */
            _propertyGetter = function (propertyName, object) {
                return object[propertyName];
            },

            /**
             * Backbone.js' way of accessing model properties.
             * @private
             * @return The property with the given <code>propertyName</code> in the given Backbone Model object
             */
            _backbonePropertyGetter = function (propertyName, backboneModelObject) {
                return backboneModelObject.get(propertyName);
            },

            /**
             * Arithmetic comparators works for Numbers and Dates.
             * In addition to the comparator (x<0<y) function, it returns the distance between the two arguments.
             * @private
             */
            _arithmeticAscendingValueComparator = function (value, otherValue) {
                return value - otherValue;
            },

            /**
             * Arithmetic comparators works for Numbers and Dates.
             * In addition to the comparator (x<0<y) function, it returns the distance between the two arguments.
             */
            _arithmeticAscendingComparator = function (comparableValueGetter, object, otherObject) {
                return _arithmeticAscendingValueComparator(comparableValueGetter(object), comparableValueGetter(otherObject));
            }.autoCurry(),

            /**
             * Arithmetic comparators works for Numbers and Dates.
             * In addition to the comparator (x<0<y) function, it returns the distance between the two arguments.
             */
            _propertyArithmeticAscendingComparator = function (propertyGetter, propertyName, object, otherObject) {
                if (typeof propertyName === 'function') {
                    propertyName = propertyName.call(this);
                }
                return _arithmeticAscendingValueComparator(propertyGetter(propertyName, object), propertyGetter(propertyName, otherObject));
            }.autoCurry(),

            /**
             * @private
             * @return Comparator equal (being 0)
             */
            _alwaysEqualComparator = function (object, otherObject) {
                return 0;
            },

            /**
             * Curry-friendly ascending comparator function.
             *
             * @param propertyGetter {Function} Function for obtaining properties from the objects being compared
             * @param nextComparator {Function} The (next) comparator function to call if this comparator cannot decide the object order
             * @param propertyName {String} The name of the property to be compared
             * @param object {Object} object to be compared
             * @param otherObject {Object} object to be compared against
             * @private
             */
            _chainableAscendingComparator = function (propertyGetter, nextComparator, propertyName, object, otherObject) {
                var objectProperty = propertyGetter(propertyName, object),
                    otherObjectProperty = propertyGetter(propertyName, otherObject);

                if (objectProperty > otherObjectProperty) {
                    return 1;
                }
                if (objectProperty < otherObjectProperty) {
                    return -1;
                }
                return nextComparator(object, otherObject);
            }.autoCurry(),

            /**
             * Multi-property ascending comparator function.
             *
             * @param propertyGetter {Function} Function for obtaining properties from the objects being compared
             * @param propertyNameArray {[String]} Ordered names of the object properties to be compared
             * @param object {Object} object to be compared
             * @param otherObject {Object} object to be compared against
             */
            _multiAscendingComparator = function (propertyGetter, propertyNameArray, object, otherObject) {
                var propArray = F.isArray(propertyNameArray) ? propertyNameArray : [propertyNameArray],
                    prop, i, ascendingComparator;

                prop = propArray[propArray.length - 1];
                ascendingComparator = _chainableAscendingComparator(propertyGetter, _alwaysEqualComparator, prop);
                for (i = propArray.length - 2; i >= 0; i -= 1) {
                    prop = propArray[i];
                    ascendingComparator = _chainableAscendingComparator(propertyGetter, ascendingComparator, prop);
                }
                return ascendingComparator(object, otherObject);
            }.autoCurry();

        return {
            // "Private" functions exported for specification/testing purposes.
            _propertyGetter: _propertyGetter,
            _backbonePropertyGetter: _backbonePropertyGetter,
            _arithmeticAscendingValue: _arithmeticAscendingValueComparator,
            _alwaysEqual: _alwaysEqualComparator,
            _chainableAscending: _chainableAscendingComparator,

            arithmeticAscending: _arithmeticAscendingComparator,

            propertyArithmeticAscending: _propertyArithmeticAscendingComparator(_propertyGetter),
            arrayElementArithmeticAscending: _propertyArithmeticAscendingComparator(_propertyGetter),

            backbonePropertyArithmeticAscending: _propertyArithmeticAscendingComparator(_backbonePropertyGetter),

            multiAscending: _multiAscendingComparator(_propertyGetter),
            backboneMultiAscending: _multiAscendingComparator(_backbonePropertyGetter)
        };
    }
);
