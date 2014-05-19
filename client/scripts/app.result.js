/* global define: false */
define(["underscore", "backbone", "app.models.scoreModel"],
    function (_, Backbone, ScoreModel) {
        "use strict";

        var participantScore = Backbone.Model.extend({
        }, {
            participantYearPropertyName: "year",
            participantRoundPropertyName: "round",
            participantNamePropertyName: "name",
            participantRatingPropertyName: "rating",
            participantHiddenRatingPropertyName: "ratingHidden",
            participantPreviousSumPropertyName: "previousSum",
            participantPreviousRatingPropertyName: "previousRating",

            printableName: function (userId) {
                if (userId === "jantore") {
                    return "Jan Tore";

                } else if (userId === "hansbernhard") {
                    return "Hans Bernhard";

                } else if (userId === "oleerik") {
                    return "Ole Erik";

                } else if (userId === "sveintore") {
                    return "Svein Tore";
                }
                return userId.charAt(0).toUpperCase() + userId.slice(1);
            },

            /** Ascending sum */
            sortBySum: function (model, otherModel) {
                var modelSum = model.get(ScoreModel.sum),
                    otherModelSum = otherModel.get(ScoreModel.sum),
                    modelName = model.get(participantScore.participantNamePropertyName),
                    otherModelName = otherModel.get(participantScore.participantNamePropertyName);

                if (modelSum > otherModelSum) {
                    return 1;
                }
                if (modelSum < otherModelSum) {
                    return -1;
                }
                return modelName > otherModelName;
            },

            /** Ascending previous sum */
            sortByPreviousSum: function (model) {
                return model.get(participantScore.participantPreviousSumPropertyName);
            }
        });

        return participantScore;
    }
);
