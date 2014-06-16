/* global define:false */

define([
        "jquery", "underscore", "backbone", "moment",
        "comparators", "string-extensions",
        "app.models"
    ],
    function ($, _, Backbone, Moment, Comparators, Str, App) {
        "use strict";

        var ParticipantRatingHistory = Backbone.Model.extend({

        }, {
            /** Sort by last element in rating, to suit jqPlot series/label presentations */
            comparatorPropertyGetter: function (model) {
                var modelRatings = model.get("ratings");
                return modelRatings[modelRatings.length - 1];
            },
            /** @see {@link http://www.jqplot.com|jqPlot} */
            toJqPlotSerie: function (model) {
                return { "label": model.get("userId").unSnakify().toTitleCase() };
            },
            /** @see {@link http://www.jqplot.com|jqPlot} */
            toJqPlotPlot: function (model) {
                var roundAndRating = _.map(model.get("ratings"), function (zeroBasedRoundRating, index) {
                    return [index + 1, zeroBasedRoundRating];
                });
                roundAndRating.unshift([0, 1]);
                return roundAndRating;
            }
        });

        return Backbone.Collection.extend({
            model: ParticipantRatingHistory,
            rankingsHistory: true,

            initialize: function (options) {
                if (options) {
                    this.year = options.year;
                }
                if (_.isUndefined(this.year)) {
                    this.year = new Date().getFullYear();
                }
            },
            url: function () {
                return [App.resource.ratingHistory.baseUri, this.year].join("/");
            },
            comparator: function (model, otherModel) {
                return Comparators.ascending(this.model.comparatorPropertyGetter, model, otherModel);
            },
            getJqPlotSeries: function () {
                return _.map(this.models, this.model.toJqPlotSerie);
            },
            getJqPlotPlot: function () {
                return _.map(this.models, this.model.toJqPlotPlot);
            }
        });
    }
);
