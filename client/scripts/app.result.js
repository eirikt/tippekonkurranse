/* global define: false */

define(["jquery", "underscore", "backbone"],
    function ($, _, Backbone) {
        "use strict";

        return Backbone.Model.extend({

        }, {
            userIdPropertyName: "userId",
            namePropertyName: "name",
            yearPropertyName: "year",
            roundPropertyName: "round",

            rankPropertyName: "rank",
            previousRankPropertyName: "previousRank",

            rankPresentationPropertyName: "rankPresentation"
        });
    }
);
