/* global exports:false */

var _ = require("underscore"),

    scoreModel = {
        sum: "sum",

        tabell: "tabell",
        pall: "pall",
        nedrykk: "nedrykk",
        toppscorer: "toppscorer",
        opprykk: "opprykk",
        cup: "cup",

        /**
         * Creates and populates the ScoreModel with the given properties,
         */
        properties: function () {
            "use strict";
            var scoreModelPropertiesArray = [
                    scoreModel.sum,

                    scoreModel.tabell,
                    scoreModel.pall,
                    scoreModel.nedrykk,
                    scoreModel.toppscorer,
                    scoreModel.opprykk,
                    scoreModel.cup
                ],
                args,
                model = {};

            if (arguments.length > 0) {
                args = _.toArray(arguments);

            } else {
                args = scoreModelPropertiesArray.map(function () {
                    return 0;
                });
            }

            scoreModelPropertiesArray.forEach(function (propName, index) {
                model[propName] = args[index];
            });

            return model;
        }
    };

// For client-side: use RequireJS shims
// For server-side/Node.js: CommonJS support
if (typeof exports !== 'undefined') {
    exports.scoreModel = scoreModel;
}
