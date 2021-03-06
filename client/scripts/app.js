/* global define:false */

window.console.log('app.js');

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

        window.console.log('app.js :: Application start');

        var app = new Marionette.Application(),

            // NB! To be set manually for now ...
            currentEliteserieSeasonStartDate = new Date(2019, 3 - 1, 30, 15, 30, 0),

            TippekonkurranseModel = Backbone.Model.extend({
                defaults: {
                    initialYear: 2014,
                    initialRound: 1,
                    year: null,
                    round: null,
                    currentYear: currentEliteserieSeasonStartDate.getFullYear(),
                    currentRound: null,
                    currentEliteserieSeasonStartDate: currentEliteserieSeasonStartDate,
                    currentEliteserieSeasonHasStarted: Date.now() - currentEliteserieSeasonStartDate > 0,
                    numberOfRounds: 30,
                    isHistoricDataAvailable: null,
                    isLiveDataAvailable: null//,
                    //isLive: null
                },
                // TODO: Needed?
                //isActiveRound: function (round) {
                //    return true;
                //},
                //isCompletedRound: function (round) {
                //    return true;
                //},
                isFutureRound: function (options) {
                    var year = this.attributes.year,
                        round = this.attributes.round,
                        currentYear = this.attributes.currentYear,
                        currentRound = this.attributes.currentRound;

                    if (options) {
                        if (options.round) {
                            round = options.round;
                        }
                        if (options.year) {
                            year = options.year;
                        }
                    }
                    return year >= currentYear && round > currentRound;
                }
            }),
            appModel = app.model = new TippekonkurranseModel(),

            scores = new ScoresCollection(),
            currentScores,

            historicScores = new HistoricScoresCollection(),

            autoPageRefreshEnabled = app.autoPageRefreshEnabled = true,
            autoPageRefreshIntervalInSeconds = 180,

            autoPageRefreshCountdown = app.autoPageRefreshCountdown = function (remaining) {
                if (!(remaining || remaining === 0)) {
                    remaining = autoPageRefreshIntervalInSeconds;
                }
                var nextRemaining = remaining - 1;
                $('#autoPageRefreshCountdown').empty().append(remaining);
                //console.log('Data fetch in ' + remaining + ' seconds ...');
                if (remaining === 0) {
                    app.execute('getTippekonkurranseScores');
                    nextRemaining = autoPageRefreshIntervalInSeconds;
                }
                if (app.autoPageRefreshEnabled) {
                    setTimeout(function () {
                        app.autoPageRefreshCountdown(nextRemaining);
                    }, 1000);
                }
            };


        app.commands.setHandler('getTippekonkurranseScores', function (year, round) {
            console.log('command::getTippekonkurranseScores(' + year + ', ' + round + ')');
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
            navigatorFooter1: '#roundFooter',
            navigatorFooter2: '#seasonFooter'
        });


        /*
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
         */


        // TODO: Fix JSHint
        /* jshint -W071 */
        app.listenTo(scores, 'reset', function () {
            console.log('event::scores:reset');

            var hasNoMainContentView = !app.mainContent.hasView(),
                hasNoData = scores.models.length <= 0 || scores.round < 1,

                headerModel,
                matchRoundNavigation,
                seasonNavigation,

                participants, gold, silver, bronze, rank, rankTrend, rating, ratingTrend;

            /*if (appModel.get('currentYearOverride') && scores.year !== appModel.get('currentYearOverride')) {
                appModel.set('year', appModel.get('currentYearOverride'));
                appModel.set('round', 0);
            } else */
            if (/*scores.isLiveDataAvailable &&*/ hasNoData) {
                appModel.set('year', appModel.get('currentYear'));
                appModel.set('round', 0);

            } else {
                appModel.set('year', scores.year);
                appModel.set('round', scores.round);
            }

            if (!appModel.has('currentRound')) {
                appModel.set('currentRound', appModel.get('round'));
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
            //if (hasNoData) {
            if (appModel.get("year") === appModel.get("currentYear") && !appModel.get("currentEliteserieSeasonHasStarted")) {
                headerModel.set("hasNoData", true);
            }
            //if (!hasNoMainContentView) {
            currentScores = scores.clone();
            currentScores.unshift(headerModel);
            //}
            //if (hasNoData) {
            if (appModel.get("year") === appModel.get("currentYear") && !appModel.get("currentEliteserieSeasonHasStarted")) {
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
            window.console.log('app.js :: Init');
            console.log('initializing::getTippekonkurranseScores');
            app.execute('getTippekonkurranseScores');
            if (appModel.get("currentEliteserieSeasonHasStarted")) {
                autoPageRefreshCountdown();
            }
        });


        window.app = app;

        return app;
    }
);
