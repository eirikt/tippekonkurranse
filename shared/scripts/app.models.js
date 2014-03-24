/* global exports: false */

// For client-side: use RequireJS shims

var ScoreModel = {
    poengsum: "poengsum",
    tabell: "tabell",
    pall: "pall",
    cup: "cup",
    toppscorer: "toppscorer",
    opprykk: "opprykk",
    nedrykk: "nedrykk",

    properties: function () {
        "use strict";

        var scoreModelPropertiesArray = [
                //ScoreModel.poengsum,
                ScoreModel.tabell,
                ScoreModel.pall,
                ScoreModel.cup,
                ScoreModel.toppscorer,
                ScoreModel.opprykk,
                ScoreModel.nedrykk
            ],
            args,
            model = {},
            i;

        if (arguments.length < 1) {
            args = [];
            for (i = 0; i < scoreModelPropertiesArray.length; i += 1) {
                args.push(0);
            }
        } else {
            args = Array.prototype.slice.call(arguments, 0);
        }

        scoreModelPropertiesArray.forEach(function (propName, index) {
            model[propName] = args[index];
        });

        return model;
    }
};

// For server-side/Node.js: CommonJS support
if (typeof exports !== 'undefined') {
    exports.ScoreModel = ScoreModel;
}
