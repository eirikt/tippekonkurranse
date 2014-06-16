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
             * The standard way of accessing object properties.
             * @return The property with the given <code>propertyName</code> in the given object
             */
            _propertyGetter = function (propertyName, object) {
                return object[propertyName];
            },

            /**
             * Backbone.js' way of accessing model properties.
             * @return The property with the given <code>propertyName</code> in the given Backbone Model object
             */
            _backbonePropertyGetter = function (propertyName, modelObject) {
                return modelObject.get(propertyName);
            },

            /**
             * @return Comparator equal (being 0)
             */
            _alwaysEqualComparator = function (object, otherObject) {
                return 0;
            },

            /**
             * Curry-friendly ascending comparator functions.
             *
             * @param propertyGetter {Function} Function for obtaining properties from the objects being compared
             * @param nextComparator {Function} The (next) comparator function to call if this comparator cannot decide the object order
             * @param propertyName {String} The name of the property to compare
             * @param object {Object} object to be compared
             * @param otherObject {Object} object to be coompared against
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

        // ...
            _ascendingComparator = function (propertyGetter, object, otherObject) {
                var objectProperty = propertyGetter(object),
                    otherObjectProperty = propertyGetter(otherObject);

                if (objectProperty > otherObjectProperty) {
                    return 1;
                }
                if (objectProperty < otherObjectProperty) {
                    return -1;
                }
                return 0;
            },

            /**
             * Multi-property ascending comparator function.
             *
             * @param propertyGetter {Function} Function for obtaining properties from the objects being compared
             * @param propertyNameArray {[String]} Ordered names of the properties to compare
             * @param object {Object} object to be compared
             * @param otherObject {Object} object to be coompared against
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
            propertyGetter: _propertyGetter,
            backbonePropertyGetter: _backbonePropertyGetter,

            alwaysEqualComparator: _alwaysEqualComparator,

            chainableAscendingComparator: _chainableAscendingComparator,

            ascending: _ascendingComparator,
            multiAscending: _multiAscendingComparator,
            multiAscendingBackbone: _multiAscendingComparator(_backbonePropertyGetter)
        };
    }
);
