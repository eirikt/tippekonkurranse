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

        // TODO: JSDoc
            _chainableAscendingComparator = function (propertyGetter, nextComparator, propertyName, object, otherObject) {
                var modelProperty = propertyGetter(propertyName, object),
                    otherModelProperty = propertyGetter(propertyName, otherObject);

                if (modelProperty > otherModelProperty) {
                    return 1;
                }
                if (modelProperty < otherModelProperty) {
                    return -1;
                }
                return nextComparator(object, otherObject);
            }.autoCurry(),

        // TODO: JSDoc
            _ascendingComparator = function (propertyGetter, propertyNameArray, object, otherObject) {
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
            ascendingComparator: _ascendingComparator,
            ascendingBackboneComparator: _ascendingComparator(_backbonePropertyGetter)
        };
    }
);
