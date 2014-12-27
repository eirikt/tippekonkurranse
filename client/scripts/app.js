/* global window:false, define:false */
/* jshint -W093 */
define([
        'backbone', 'marionette',
        'app.models',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.results-view', 'app.results-carousel-view', 'app.rating-history-view'
    ],
    function (Backbone, Marionette,
              AppModels,
              CurrentScoresCollection, HistoricScoresCollection,
              HeaderView, CurrentScoresView, RoundCarouselView, RatingHistoryView) {

        'use strict';

        var app = new Marionette.Application(),

            currentScores = new CurrentScoresCollection(),
            historicScores = new HistoricScoresCollection();

        app.commands.setHandler('getTippekonkurranseScores', function (year, round) {
            console.log('"getTippekonkurranseScores(' + year + ', ' + round + ')"');
            if (!year || !round) {
                year = 2014;
                round = 30;
                console.warn('Overriding year and round => "getTippekonkurranseScores(2014, 30)"');
            }
            currentScores.year = year;
            currentScores.round = round;
            currentScores.fetch();
        });
        app.commands.setHandler('getTippekonkurranseScoresHistory', function (year, round) {
            console.log('"getTippekonkurranseScoresHistory(' + year + ', ' + round + ')"');
            historicScores.year = year;
            historicScores.round = round;
            historicScores.fetch({ reset: true });
        });

        app.addRegions({
            header: '#header',
            mainContent: '#mainSection',
            mainFooter: '#mainFooter'
        });

        app.addInitializer(function () {
            app.execute('getTippekonkurranseScores');
        });

        app.listenTo(currentScores, 'reset', function () {
            //console.log('"currentScores:reset"');
            app.header.show(new HeaderView({ model: currentScores }));
            app.mainContent.show(new CurrentScoresView({
                model: new Backbone.Model(),
                collection: currentScores
            }));
            app.mainFooter.show(new RoundCarouselView({ model: currentScores }));
        });

        app.listenTo(historicScores, 'reset', function () {
            //console.log('"historicScores:reset"');
            app.mainContent.show(new RatingHistoryView({ collection: historicScores }));
            app.mainFooter.empty();
        });

        return window.app = app;
    }
);
