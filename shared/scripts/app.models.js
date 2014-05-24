/* global exports:false */

var __ = require('underscore'),

    appName = 'Tippekonkurranse',

    resource = {
        uri: {
            element: {
                current: "current"
            }
        },
        predictions: {
            baseUri: "/api/predictions",
            uri: '/api/predictions/:year/:userId'
        },
        results: {
            baseUri: "/api/results",
            uri: '/api/results/:year/:round'
        },
        scores: {
            baseUri: "/api/scores",
            uri: '/api/scores/:year/:round'
        }
    },

    scoreModel = {
        tabellPropertyName: 'tabell',
        pallPropertyName: 'pall',
        nedrykkPropertyName: 'nedrykk',
        toppscorerPropertyName: 'toppscorer',
        opprykkPropertyName: 'opprykk',
        cupPropertyName: 'cup',
        sumPropertyName: 'sum',

        /**
         * Creates and populates the ScoreModel with the given properties,
         */
        createObjectWith: function () {
            "use strict";
            var scoreModelPropertyNamesArray = [
                    scoreModel.tabellPropertyName,
                    scoreModel.pallPropertyName,
                    scoreModel.nedrykkPropertyName,
                    scoreModel.toppscorerPropertyName,
                    scoreModel.opprykkPropertyName,
                    scoreModel.cupPropertyName,
                    scoreModel.sumPropertyName
                ],
                args,
                model = {};

            if (arguments.length > 0) {
                args = __.toArray(arguments);
            } else {
                args = scoreModelPropertyNamesArray.map(function () {
                    return 0;
                });
            }

            scoreModelPropertyNamesArray.forEach(function (propName, index) {
                model[propName] = args[index];
            });

            return model;
        }
    };


// For client-side: use RequireJS shims
// => http://stackoverflow.com/questions/18650066/can-we-export-multiple-non-amd-functions-from-a-module-in-requirejs

// For server-side/Node.js: CommonJS support
if (typeof exports !== 'undefined') {
    exports.appName = appName;
    exports.name = appName;

    exports.resource = resource;
    exports.scoreModel = scoreModel;
}
