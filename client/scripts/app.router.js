/* global define:false, console:false, $:false */

define([
        'jquery', 'underscore', 'backbone',
        'utils',
        'app.models',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.results-view', 'app.rating-history-view'],

    function ($, _, Backbone, Please, App, CurrentScoresCollection, HistoricScoresCollection, HeaderView, CurrentScoresView, RatingHistoryView) {
        'use strict';

        return Backbone.Router.extend({
            routes: {
                'scores/current': 'showCurrentScores',
                'scores/:year/:round': 'showScores',
                'ratinghistory/:year/:round': 'showRatingHistory',

                // Default
                '*actions': 'defaultAction'
            },


            showCurrentScores: function () {
                var results = new CurrentScoresCollection(),
                    headerView = new HeaderView({
                        el: 'header',
                        collection: results
                    }),
                    resultsView = new CurrentScoresView({
                        el: '#content',
                        collection: results
                    });

                results.fetch();

                $('header').removeClass('hidden');
                $('#ratingHistory').empty().css({ height: 0 });
                $('#content').empty();
                $('#intro').remove();
                $('footer').removeClass('hidden');
            },


            showScores: function (year, round) {
                var results = new CurrentScoresCollection({
                        year: year,
                        round: round
                    }),
                    headerView = new HeaderView({
                        el: 'header',
                        collection: results
                    }),
                    resultsView = new CurrentScoresView({
                        el: '#content',
                        collection: results
                    });

                results.fetch({ reset: true });

                $('#ratingHistory').empty().css({ height: 0 });
            },


            showRatingHistory: function (year, round) {
                var results = new HistoricScoresCollection({
                        year: year,
                        round: round
                    }),
                    headerView = new HeaderView({
                        el: 'header',
                        collection: results
                    }),
                    ratingHistoryView = new RatingHistoryView({
                        el: '#ratingHistory',
                        collection: results,
                        year: parseInt(year, 10),
                        round: parseInt(round, 10)
                    });

                results.fetch({ reset: true });

                $('header').removeClass('hidden');
                $('#ratingHistory').removeClass('hidden');
                $('#content').empty();
                $('#intro').remove();
                $('footer').removeClass('hidden');
            },


            defaultAction: function () {
                var self = this;
                Please.wait(1650).then(function () {
                    $('#intro').hide('slow', self.showCurrentScores);
                });
            }
        });
    }
);
