/* global define: false */
define(["underscore", "backbone", "app.models"],
    function (_, Backbone, App) {
        "use strict";

        var participantScore = Backbone.Model.extend({
        }, {
            yearPropertyName: "year",
            roundPropertyName: "round",
            namePropertyName: "name",
            ratingPropertyName: "rating",
            hiddenRatingPropertyName: "ratingHidden",
            previousSumPropertyName: "previousSum",
            previousRatingPropertyName: "previousRating",

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
                var modelSum = model.get(App.scoreModel.sumPropertyName),
                    otherModelSum = otherModel.get(App.scoreModel.sumPropertyName),
                    modelName = model.get(participantScore.namePropertyName),
                    otherModelName = otherModel.get(participantScore.namePropertyName);

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
                return model.get(participantScore.previousSumPropertyName);
            }
        });

        return participantScore;
    }
);
