/* global define:false */

// CommonJS and AMD support (no RequireJS shim 'dependency')
// => http://stackoverflow.com/questions/13673346/supporting-both-commonjs-and-amd

// TODO: Perhaps better resources are:
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html

(function (name, definition) {
    'use strict';
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('comparators', function () {
    'use strict';

    var

    // TODO: Support for dependency loading! Client-side tests crashes ...
    // Works for server-side tests
    //F = require("./fun"),

        _slice = Array.prototype.slice,
        _isArray = Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        _toArray = function (x) {
            return _slice.call(x);
        },
        _curry = function (fn /* variadic number of args */) {
            var args = _slice.call(arguments, 1);
            return function () {
                return fn.apply(this, args.concat(_toArray(arguments)));
            };
        },


        _propertyGetter = function (propertyName, model) {
            return model[propertyName];
        },

        _backbonePropertyGetter = function (propertyName, model) {
            return model.get(propertyName);
        },

        _alwaysEqualComparator = function (model, otherModel) {
            return 0;
        },

        _chainableAscendingComparator = function (propertyGetter, nextComparator, propertyName, model, otherModel) {
            var modelProperty = propertyGetter(propertyName, model),
                otherModelProperty = propertyGetter(propertyName, otherModel);

            if (modelProperty > otherModelProperty) {
                return 1;
            }
            if (modelProperty < otherModelProperty) {
                return -1;
            }
            return nextComparator(model, otherModel);
        },

        _ascendingComparator = function (propertyGetter, propertyNameArray, model, otherModel) {
            var propArray = _isArray(propertyNameArray) ? propertyNameArray : [propertyNameArray],
                prop, i, propPartial;

            prop = propArray[propArray.length - 1];
            propPartial = _curry(_chainableAscendingComparator, _backbonePropertyGetter, _alwaysEqualComparator, prop);
            for (i = propArray.length - 2; i >= 0; i -= 1) {
                prop = propArray[i];
                propPartial = _curry(_chainableAscendingComparator, _backbonePropertyGetter, propPartial, prop);
            }
            return propPartial(model, otherModel);
        };

    // This is the code you would normally have inside define() or add to module.exports
    return {
        propertyGetter: _propertyGetter,
        backbonePropertyGetter: _backbonePropertyGetter,
        alwaysEqualComparator: _alwaysEqualComparator,
        chainableAscendingComparator: _chainableAscendingComparator,
        ascendingComparator: _ascendingComparator,
        ascendingBackboneComparator: _curry(_ascendingComparator, _backbonePropertyGetter)
    };
}));
