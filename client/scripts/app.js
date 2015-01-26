/* global define:false */
define([
        'underscore', 'backbone', 'marionette',
        'client-utils',
        'app.models',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.results-view', 'app.navigator-view', 'app.rating-history-view'
    ],
    function (_, Backbone, Marionette,
              Please,
              AppModels,
              ScoresCollection, HistoricScoresCollection,
              HeaderView, CurrentScoresView, NavigatorView, RatingHistoryView) {

        'use strict';

        var app = new Marionette.Application(),

            appModel = new Backbone.Model({
                initialYear: 2014,
                initialRound: 1,
                year: 2015,
                round: 1,
                currentYear: 2015,
                currentRound: 1
            }),

            scores = new ScoresCollection(),
            currentScores = new ScoresCollection(),

            historicScores = new HistoricScoresCollection(),
            currentHistoricScores = new HistoricScoresCollection();


        app.commands.setHandler('getTippekonkurranseScores', function (year, round) {
            //console.log('command::getTippekonkurranseScores(' + year + ', ' + round + ')');
            if (!year) {
                year = appModel.get('currentYear');
            }
            if (!round) {
                round = appModel.get('currentRound');
            }
            scores.reset(null, { silent: true });
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
            if (scores.models.length > 0) {
                appModel.set('year', scores.year);
                appModel.set('round', scores.round);

                app.mainContent.show(new CurrentScoresView({
                    model: appModel.clone(),
                    collection: currentScores
                }));

            } else {
                appModel.set('year', 2015);
                appModel.set('round', 0);

                app.mainContent.empty();
            }

            var matchRoundNavigation = appModel.clone();

            var seasonNavigation = appModel.clone();
            seasonNavigation.set('isSeason', true, { silent: true });

            app.header.show(new HeaderView({ model: appModel }));
            app.navigatorFooter1.show(new NavigatorView({ model: matchRoundNavigation }));
            app.navigatorFooter2.show(new NavigatorView({ model: seasonNavigation }));

            currentScores = scores.clone();
        });


        app.listenTo(scores, 'reset', function () {
            var _delayedRelocationOfParticipant = function (timeOutInMillis, participantToRemove, participantToAdd) {
                var dfd = $.Deferred();
                Please.wait(timeOutInMillis).then(function () {
                    //if (participantToRemove) {
                    //    console.log("Relocating participant (" + participantToRemove.get("name") + " | " + participantToAdd.get("name") + ")");
                    //} else {
                    //    console.log("No participant to relocate ...");
                    //}
                    app.mainContent.currentView.collection.remove(participantToRemove);
                    app.mainContent.currentView.collection.add(participantToAdd);
                    dfd.resolve();
                });
                return dfd.promise();
            };

            if (app.mainContent.hasView()) {
                var i,
                    addingOfParticipantFuncs = [],
                    delayInMillis = 250,
                    delayedRelocatingOfParticipantFunc,
                    delayedParticipantRelocationFunc;

                for (i = 0; i < scores.size(); i += 1) {
                    var participantToAdd = scores.at(i),
                        participantToRemove = app.mainContent.currentView.collection.findWhere({ userId: participantToAdd.get("userId") });

                    delayedRelocatingOfParticipantFunc = _.bind(_delayedRelocationOfParticipant, this);
                    delayedRelocatingOfParticipantFunc = _.partial(delayedRelocatingOfParticipantFunc, delayInMillis, participantToRemove, participantToAdd);
                    addingOfParticipantFuncs.push(delayedRelocatingOfParticipantFunc);
                }
                // Execute all these deferred functions sequentially
                if (scores.size() > 0) {
                    delayedParticipantRelocationFunc = addingOfParticipantFuncs[ 0 ]();
                    for (i = 0; i < addingOfParticipantFuncs.length; i += 1) {
                        //console.log("#" + i + " " + delayedParticipantRelocationFunc);
                        delayedParticipantRelocationFunc = delayedParticipantRelocationFunc.then(addingOfParticipantFuncs[ i + 1 ]);
                    }
                }
            }
        });


        app.listenTo(historicScores, 'reset', function () {
            //console.log('event::historicScores:reset');
            var ratingHistoryAppModel = appModel.clone();

            ratingHistoryAppModel.set('year', historicScores.year);
            ratingHistoryAppModel.set('round', historicScores.round);
            ratingHistoryAppModel.set('isRatingHistory', true);

            app.header.show(new HeaderView({ model: ratingHistoryAppModel }));
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
