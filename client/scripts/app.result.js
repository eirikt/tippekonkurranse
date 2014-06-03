/* global define: false */

define(["underscore", "backbone", "app.models", "utils"],
    function (_, Backbone, App, Utils) {
        "use strict";

        return Backbone.Model.extend({

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
            }
        });
    }
);
