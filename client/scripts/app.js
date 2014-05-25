/* global define:false, console:false, $:false */
define([
        'underscore', 'backbone', 'jquery', 'jquery.bootstrap', 'toastr',
        'backbone.fetch-local-copy', 'utils',
        'app.result-collection', 'app.results-view'],

    function (_, Backbone, $, Bootstrap, toastr, BackboneFetchLocalCopy, Please, TippekonkurranseCurrentResultsCollection, TippekonkurranseCurrentResultsView) {
        'use strict';

        var HeaderView = Backbone.View.extend({
                template: _.template('' +
                        '<h1 style="white-space:nowrap;">' +
                        '  <span style="padding-left:2rem;">Tippekonkurranse <%= year %></span>' +
                        '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= round %></span>' +
                        '  <span style="font-size:2rem;color:#d3d3d3;">av 30</span>' +
                        '  <span id="offlineScoresNotification" class="hidden" data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;"></span>' +
                        '</h1>'
                ),
                initialize: function () {
                    this.listenTo(this.collection, 'reset', this.render);
                },
                render: function () {
                    this.$el.empty().append(this.template({
                            year: this.collection.at(0).get('year'),
                            round: this.collection.at(0).get('round')
                        }
                    ));
                }
            }),

            onDomReady = function () {
                console.log('DOM ready! Starting ...');

                // TODO: Move to file 'app.router.js'
                var AppRouter = Backbone.Router.extend({
                        routes: {
                            'scores/:year/:round': 'showHistoricScores',
                            // Default
                            '*actions': 'defaultAction'
                        },
                        showHistoricScores: function (year, round) {
                            //console.log("showHistoricScores(" + year + ", " + round + ") ...");
                            $('#content').hide('slow', function () {
                                var results = new TippekonkurranseCurrentResultsCollection({
                                        year: year,
                                        round: round
                                    }),
                                    headerView = new HeaderView({
                                        el: 'header',
                                        collection: results
                                    }),
                                    resultsView = new TippekonkurranseCurrentResultsView({
                                        el: '#content',
                                        collection: results
                                    });

                                $('header').removeClass('hidden');
                                $('footer').removeClass('hidden');
                                $('#intro').remove();

                                $('#content').show();

                                results.fetch();
                            });
                        },
                        defaultAction: function () {
                            //console.log("defaultAction() ...");
                            Please.wait(1650).then(function () {
                                $('#intro').hide('slow', function () {
                                    var results = new TippekonkurranseCurrentResultsCollection(),
                                        headerView = new HeaderView({
                                            el: 'header',
                                            collection: results
                                        }),
                                        resultsView = new TippekonkurranseCurrentResultsView({
                                            el: '#content',
                                            collection: results
                                        });

                                    $('header').removeClass('hidden');
                                    $('footer').removeClass('hidden');
                                    $('#intro').remove();

                                    results.fetch();
                                });
                            });
                        }
                    }),
                    appRouter = new AppRouter();

                Backbone.history.start({
                    pushState: false,
                    hashChange: true,
                    root: '/'
                });

                BackboneFetchLocalCopy.listenToServerConnectionDropouts([
                    '#offlineScoresNotification',
                    '#offlineCurrentResultsNotification'
                ]);
            };

        // Toastr.js config (=> http://codeseven.github.io/toastr/demo.html)
        toastr.options = {
            "positionClass": 'toast-top-full-width',
            "timeOut": 6000
        };

        // Application starting point (when DOM is ready ...)
        $(document).ready(onDomReady);
    }
);
