/* global define: false */
define(["underscore", "backbone", "app.models.scoreModel"],
    function (_, Backbone, ScoreModel) {
        "use strict";

        var participantScore = Backbone.Model.extend({
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
            participantYearPropertyName: "year",
            participantRoundPropertyName: "round",
            participantNamePropertyName: "name",
            participantRatingPropertyName: "rating",
            participantHiddenRatingPropertyName: "ratingHidden",
            participantPreviousSumPropertyName: "previousSum",
            participantPreviousRatingPropertyName: "previousRating",

            /** Ascending sum */
            sortBySum: function (model) {
                return "" + model.get(ScoreModel.sum) + model.get(participantScore.participantNamePropertyName);
            },

            /** Ascending previous sum */
            sortByPreviousSum: function (model) {
                return model.get(participantScore.participantPreviousSumPropertyName);
            }
        });

        return participantScore;
    }
);
