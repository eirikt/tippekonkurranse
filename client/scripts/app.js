/* global define:false */
define([
        'backbone', 'marionette',
        'app.models',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.results-view', 'app.navigator-view', 'app.rating-history-view'
    ],
    function (Backbone, Marionette,
              AppModels,
              ScoresCollection, HistoricScoresCollection,
              HeaderView, CurrentScoresView, NavigatorView, RatingHistoryView) {

        'use strict';

        var app = new Marionette.Application(),

            appNavigationModel = new Backbone.Model({
                initialYear: 2014,
                initialRound: 1,
                year: 2015,
                round: 1,
                currentYear: 2015,
                currentRound: 1
            }),
            scores = new ScoresCollection(),
            historicScores = new HistoricScoresCollection();

        app.commands.setHandler('getTippekonkurranseScores', function (year, round) {
            console.log('command::getTippekonkurranseScores(' + year + ', ' + round + ')');
            if (!year) {
                year = appNavigationModel.get("currentYear");
            }
            if (!round) {
                round = appNavigationModel.get("currentRound");
            }
            scores.year = year;
            scores.round = round;
            scores.fetch();
        });

        app.commands.setHandler('getTippekonkurranseScoresHistory', function (year, round) {
            //console.log('command::getTippekonkurranseScoresHistory(' + year + ', ' + round + ')');
            historicScores.year = year;
            historicScores.round = round;
            historicScores.fetch({ reset: true });
        });

        app.addRegions({
            header: '#header',
            mainContent: '#mainSection',
            navigatorFooter1: '#footer1',
            navigatorFooter2: '#footer2'
        });

        app.listenTo(scores, 'reset', function () {
            //console.log('event::scores:reset');
            if (scores.models.length > 0) {
                appNavigationModel.set("year", parseInt(scores.year, 10));
                appNavigationModel.set("round", parseInt(scores.round, 10));

                app.mainContent.show(new CurrentScoresView({
                    model: new Backbone.Model(),
                    collection: scores
                }));

            } else {
                appNavigationModel.set("year", 2015);
                appNavigationModel.set("round", 0);

                app.mainContent.empty();
            }
            var seasonNavigation = appNavigationModel.clone();
            var matchRoundNavigation = appNavigationModel.clone();
            seasonNavigation.set("isSeason", true, { silent: true });

            app.header.show(new HeaderView({ model: appNavigationModel }));
            app.navigatorFooter1.show(new NavigatorView({ model: matchRoundNavigation }));
            app.navigatorFooter2.show(new NavigatorView({ model: seasonNavigation }));
        });

        app.listenTo(historicScores, 'reset', function () {
            //console.log('event::historicScores:reset');
            app.mainContent.show(new RatingHistoryView({ collection: historicScores }));
            app.navigatorFooter1.empty();
            app.navigatorFooter2.empty();
        });

        app.addInitializer(function () {
            app.execute('getTippekonkurranseScores');
        });

        return app;
    }
);
