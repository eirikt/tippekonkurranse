/* global define: false */
define(["underscore", "backbone", "app.models.ScoreModel"],
    function (_, Backbone, ScoreModel) {
        "use strict";

        var participantScore = Backbone.Model.extend({
            sum: function () {
                return parseInt(this.get(ScoreModel.tabell), 10) +
                    parseInt(this.get(ScoreModel.pall), 10) +
                    parseInt(this.get(ScoreModel.nedrykk), 10) +
                    parseInt(this.get(ScoreModel.toppscorer), 10) +
                    parseInt(this.get(ScoreModel.opprykk), 10) +
                    parseInt(this.get(ScoreModel.cup), 10);
            },
            printableName: function (nameKey) {
                if (nameKey === "jantore") {
                    return "Jan Tore";
                } else if (nameKey === "hansbernhard") {
                    return "Hans Bernhard";
                } else if (nameKey === "oleerik") {
                    return "Ole Erik";
                } else if (nameKey === "sveintore") {
                    return "Svein Tore";
                }
                return nameKey.charAt(0).toUpperCase() + nameKey.slice(1);
            }

        }, {
            participantResultNamePropertyName: "name",
            participantResultPoengsumPropertyName: "poengsum",
            /** Ascending poengsum */
            sortByPoengsum: function (model) {
                return model.get(participantScore.participantResultPoengsumPropertyName);
            }
        });

        return participantScore;
    }
);
