/* global exports: false */
var ScoreModel = {
    tabell: "tabell",
    pall: "pall",
    nedrykk: "nedrykk",
    toppscorer: "toppscorer",
    opprykk: "opprykk",
    cup: "cup",

    properties: function () {
        "use strict";
        var scoreModelPropertiesArray = [
                ScoreModel.tabell,
                ScoreModel.pall,
                ScoreModel.nedrykk,
                ScoreModel.toppscorer,
                ScoreModel.opprykk,
                ScoreModel.cup
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

// For client-side: use RequireJS shims
// For server-side/Node.js: CommonJS support
if (typeof exports !== 'undefined') {
    exports.ScoreModel = ScoreModel;
}
