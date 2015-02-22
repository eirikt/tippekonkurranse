/* global define:false */
define([
        'underscore', 'backbone', 'marionette',
        'client-utils',
        'app.models',
        'app.result-collection', 'app.rating-history-collection',
        'app.header-view', 'app.pre-season-table-view', 'app.scores-table-view', 'app.navigator-view', 'app.rating-history-view'
    ],
    function (_, Backbone, Marionette,
              Please,
              AppModels,
              ScoresCollection, HistoricScoresCollection,
              HeaderView, PreSeasonView, CurrentScoresView, NavigatorView, RatingHistoryView) {

        'use strict';

        var app = new Marionette.Application(),

            currentTippeligaSeasonStartDate = new Date(2015, (4 - 1), 6, 15, 30, 0),

            appModel = new Backbone.Model({
                initialYear: 2014,
                initialRound: 1,
                year: null,
                round: null,
                currentYear: null,
                currentRound: null,
                currentTippeligaSeasonStartDate: currentTippeligaSeasonStartDate,
                currentTippeligaSeasonHasStarted: Date.now() - currentTippeligaSeasonStartDate > 0
            }),

            scores = new ScoresCollection(),
            currentScores,

            historicScores = new HistoricScoresCollection();


        app.model = appModel;

        app.commands.setHandler('getTippekonkurranseScores', function (year, round) {
            console.log('command::getTippekonkurranseScores(' + year + ', ' + round + ')');
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
            console.log('command::getTippekonkurranseScoresHistory(' + year + ', ' + round + ')');
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


        var _delayedRelocationOfParticipant = function (timeOutInMillis, participantToRemove, participantToAdd) {
            var dfd = $.Deferred();
            Please.wait(timeOutInMillis).then(function () {
                if (participantToRemove) {
                    console.log("Relocating participant (" + participantToRemove.get("name") + " | " + participantToAdd.get("name") + ")");
                    app.mainContent.currentView.collection.remove(participantToRemove);
                } else {
                    console.log("No participant to relocate ...");
                }
                app.mainContent.currentView.collection.add(participantToAdd);
                dfd.resolve();
            });
            return dfd.promise();
        };


        // TODO: Fix
        /* jshint -W071 */
        app.listenTo(scores, 'reset', function () {
            console.log('event::scores:reset');

            var hasNoMainContentView = !app.mainContent.hasView(),
                hasNoData = scores.models.length <= 0 || scores.round < 1,

                headerModel,// = appModel.clone(),
                matchRoundNavigation,// = appModel.clone(),
                seasonNavigation,// = appModel.clone(),

                participants, gold, silver, bronze, rank, rankTrend, rating, ratingTrend;

            if (hasNoData) {
                appModel.set('year', new Date().getFullYear());
                appModel.set('round', 0);
                appModel.set('currentYear', appModel.get('year'));
                appModel.set('currentRound', appModel.get('round'));

            } else {
                appModel.set('year', scores.year);
                appModel.set('round', scores.round);
            }

            headerModel = appModel.clone();
            matchRoundNavigation = appModel.clone();
            seasonNavigation = appModel.clone();

            seasonNavigation.set('isSeason', true, { silent: true });

            app.header.show(new HeaderView({ model: headerModel }));
            app.navigatorFooter1.show(new NavigatorView({ model: matchRoundNavigation }));
            app.navigatorFooter2.show(new NavigatorView({ model: seasonNavigation }));

            // TODO: Make the animations work ...
            /*
             if (hasNoData) {
             app.mainContent.empty();
             // Remember the current displayed scores for transition effects purposes
             currentScores = scores.clone();
             return;
             }
             */

            /*
             if (hasNoMainContentView) {
             currentScores = scores.clone();
             } else {
             //currentScores.shift();
             }
             */

            /*
             if (scores.models.length === 14) {
             currentScores.shift();
             }
             currentScores.unshift(headerModel);
             */


            // Temporary ... To be removed when applying animations
            if (hasNoData) {
                //if (!appModel.get("currentTippeligaSeasonHasStarted")) {
                headerModel.set("hasNoData", true);
            }
            //if (!hasNoMainContentView) {
            currentScores = scores.clone();
            currentScores.unshift(headerModel);
            //}
            if (hasNoData) {
                //if (!appModel.get("currentTippeligaSeasonHasStarted")) {
                app.mainContent.show(new PreSeasonView({
                    model: appModel,
                    collection: currentScores
                }));
                return;
            }
            // /Temporary


            app.mainContent.show(new CurrentScoresView({
                model: appModel,
                collection: currentScores
            }));

            if (hasNoMainContentView) {
                // No animation as current data already is rendered
                return;

            } else {
                participants = app.mainContent.currentView.$el.find('.participant');
                gold = app.mainContent.currentView.$el.find('.icon-trophy-gold');
                silver = app.mainContent.currentView.$el.find('.icon-trophy-silver');
                bronze = app.mainContent.currentView.$el.find('.icon-trophy-bronze');
                rank = app.mainContent.currentView.$el.find('.rank');
                rankTrend = app.mainContent.currentView.$el.find('.rank-trend');
                rating = app.mainContent.currentView.$el.find('.rating');
                ratingTrend = app.mainContent.currentView.$el.find('.rating-trend');

                /*
                 $(participants).removeClass('current-scores').addClass('outdated-scores');
                 $(gold).removeClass('icon-trophy-gold');
                 $(silver).removeClass('icon-trophy-silver');
                 $(bronze).removeClass('icon-trophy-bronze');
                 $(rank).empty();
                 $(rankTrend).empty();
                 $(rating).empty();
                 $(ratingTrend).empty();

                 var i,
                 addingOfParticipantFuncs = [],
                 delayInMillis = 250,
                 delayedRelocatingOfParticipantFunc,
                 delayedParticipantRelocationFunc;

                 for (i = 0; i < currentScores.size(); i += 1) {
                 var participantToAdd = currentScores.at(i),
                 participantToRemove = app.mainContent.currentView.collection.findWhere({ userId: participantToAdd.get("userId") });

                 delayedRelocatingOfParticipantFunc = _.bind(_delayedRelocationOfParticipant, this);
                 delayedRelocatingOfParticipantFunc = _.partial(delayedRelocatingOfParticipantFunc, delayInMillis, participantToRemove, participantToAdd);
                 addingOfParticipantFuncs.push(delayedRelocatingOfParticipantFunc);
                 }
                 // Execute all these deferred functions sequentially
                 if (currentScores.size() > 0) {
                 delayedParticipantRelocationFunc = addingOfParticipantFuncs[ 0 ]();
                 for (i = 0; i < addingOfParticipantFuncs.length; i += 1) {
                 console.log("#" + i + " " + delayedParticipantRelocationFunc);
                 delayedParticipantRelocationFunc = delayedParticipantRelocationFunc.then(addingOfParticipantFuncs[ i + 1 ]);
                 }
                 }
                 */
            }

            // Remember the current displayed scores for transition effects purposes
            //currentScores = scores.clone();
        });


        app.listenTo(historicScores, 'reset', function () {
            console.log('event::historicScores:reset');
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
            console.log('initializing::getTippekonkurranseScores');
            app.execute('getTippekonkurranseScores');
        });


        window.app = app;

        return app;
    }
);
