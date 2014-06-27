/* global define:false, console:false, $:false */

define([
        'jquery', 'underscore', 'backbone',
        'utils',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.results-view', 'app.rating-history-view'],

    function ($, _, Backbone, Please, CurrentScoresCollection, HistoricScoresCollection, HeaderView, CurrentScoresView, RatingHistoryView) {
        'use strict';

        return Backbone.Router.extend({
            routes: {
                'scores/current': 'showCurrentScores',
                'scores/:year/:round': 'showScores',
                'ratinghistory/:year': 'showRatingHistory',

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
                $('#jqplot').css({ height: '0px' }).empty();
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
            },


            showRatingHistory: function (year) {
                //console.log('showRankingsHistory(' + year + ') ...');
                var results = new HistoricScoresCollection({
                        year: year
                    }),
                    headerView = new HeaderView({
                        el: 'header',
                        collection: results
                    }),
                    ratingHistoryView = new RatingHistoryView({
                        el: '#jqplot',
                        collection: results
                    });

                results.fetch({ reset: true });

                $('header').removeClass('hidden');
                $('#content').empty();
                $('#intro').remove();
                $('footer').removeClass('hidden');
            },


            defaultAction: function () {
                //console.log("defaultAction() ...");
                var self = this;
                Please.wait(1650).then(function () {
                    $('#intro').hide('slow', self.showCurrentScores);
                });
            }
        });
    }
);
