/* global define:false, console:false, $:false */
define([
        'jquery', 'underscore', 'backbone',
        'utils',
        'app.models',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.results-view', 'app.results-carousel-view', 'app.rating-history-view'],

    function ($, _, Backbone, Please, App, CurrentScoresCollection, HistoricScoresCollection, HeaderView, CurrentScoresView, RoundCarouselView, RatingHistoryView) {
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
                        el: '#content1',
                        collection: results
                    }),
                    roundCarouselView = new RoundCarouselView({
                        el: '#content2',
                        collection: results
                    });

                results.fetch();

                $('header').removeClass('hidden');
                $('#ratingHistory').empty().css({ height: 0 });
                $('#content1').empty();
                $('#content2').empty();
                $('#splashscreen').remove();
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
                        el: '#content1',
                        collection: results
                    }),
                    roundCarouselView = new RoundCarouselView({
                        el: '#content2',
                        collection: results
                    });

                results.fetch({ reset: true });

                $('header').removeClass('hidden');
                $('#ratingHistory').empty().css({ height: 0 });
                $('#splashscreen').remove();
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
                $('#content1').empty();
                $('#content2').empty();
                $('#splashscreen').remove();
                $('footer').removeClass('hidden');
            },


            defaultAction: function () {
                var self = this;
                Please.wait(1650).then(function () {
                    $('#splashscreen').hide('slow', self.showCurrentScores);
                });
            }
        });
    }
);
