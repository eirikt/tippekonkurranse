/* global exports:false */

var _ = require("underscore"),

    scoreModel = {
        // TODO: rename to 'sumPropertyName' ...
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
            var scoreModelPropertyNamesArray = [
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
// For server-side/Node.js: CommonJS support
if (typeof exports !== 'undefined') {
    exports.scoreModel = scoreModel;
}
