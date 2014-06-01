/* global define: false */

define(["underscore", "backbone", "app.models", "utils"],
    function (_, Backbone, App, Utils) {
        "use strict";

        var participantScore = Backbone.Model.extend({

        }, {
            userIdPropertyName: "userId",
            namePropertyName: "name",
            yearPropertyName: "year",
            roundPropertyName: "round",
            ratingPropertyName: "rating",
            ratingNumberPropertyName: "ratingNumber",
            previousSumPropertyName: "previousSum",
            previousRatingNumberPropertyName: "previousRatingNumber",

            // TODO: Switch to a 'jan_tore' user id scheme (=> uniform capitalization routine)
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
                return Utils.capitalize(userId);
            },

            // TODO: Move it shared Backbone utility function object
            ascendingOpenEndedComparator: function (nextComparator, propertyName, model, otherModel) {
                var modelProperty = model.get(propertyName),
                    otherModelProperty = otherModel.get(propertyName);
                if (modelProperty > otherModelProperty) {
                    return 1;
                }
                if (modelProperty < otherModelProperty) {
                    return -1;
                }
                return nextComparator(model, otherModel);
            },

            // TODO: Make this generic and bottom-less with an array of property name as argument
            // TODO: Then move it to shared Backbone utility function object
            doublePropertyComparator: function (propName1, propName2, model, otherModel) {
                var alwaysEqualComparator = function () {
                        return 0;
                    },
                    prop2Partial = _.partial(participantScore.ascendingOpenEndedComparator, alwaysEqualComparator, propName2),
                    prop1Partial = _.partial(participantScore.ascendingOpenEndedComparator, prop2Partial, propName1);

                return prop1Partial(model, otherModel);
            },

            /** Ascending sum */
            sortBySum: function (model, otherModel) {
                return participantScore.doublePropertyComparator(
                    App.scoreModel.sumPropertyName, participantScore.namePropertyName,
                    model, otherModel);
            },

            /** Ascending previous sum */
            sortByPreviousSum: function (model, otherModel) {
                return participantScore.doublePropertyComparator(
                    participantScore.previousSumPropertyName, participantScore.namePropertyName,
                    model, otherModel);
            }
        });

        return participantScore;
    }
);
