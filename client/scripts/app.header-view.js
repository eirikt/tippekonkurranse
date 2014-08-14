/* global define:false, console:false, $:false */

define(['jquery', 'underscore', 'backbone', 'screenfull'],
    function ($, _, Backbone, Screenfull) {
        'use strict';

        return Backbone.View.extend({

            scoresTemplate: _.template('' +
                    '<h1 style="white-space:nowrap;">' +
                    '  <a href="/#/scores/current"><span style="padding-left:2rem;">Tippekonkurranse <%= year %></span></a>' +
                    '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= round %></span>' +
                    '  <span style="font-size:2rem;color:#d3d3d3;">av 30</span>' +
                    '  <span id="offlineScoresNotification" class="hidden" ' +
                    'data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" ' +
                    'style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;">' +
                    '  </span>' +
                    '  <a href="#" id="fullscreen" class="pull-right"><span class="x-large icon-arrows-alt" title="Fullscreen"></span></a>' +
                    '</h1>'
            ),
            ratingHistoryTemplate: _.template('' +
                    '<h1 style="white-space:nowrap;padding-bottom:2rem;">' +
                    '  <a href="/#/scores/current"><span style="padding-left:2rem;">Tippekonkurranse <%= year %></span></a>' +
                    '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;poengtrend</span>' +
                    '  <a href="#" id="fullscreen" class="pull-right"><span class="x-large icon-arrows-alt" title="Fullscreen"></span></a>' +
                    '</h1>'
            ),

            initialize: function () {
                this.listenTo(this.collection, 'reset', this.render);
            },

            render: function () {
                if (this.collection.rankingsHistory) {
                    this.$el.empty().append(this.ratingHistoryTemplate({
                        year: this.collection.year
                    }));

                } else {
                    this.$el.empty().append(this.scoresTemplate({
                        year: this.collection.at(0).get('year'),
                        round: this.collection.at(0).get('round')
                    }));
                }

                // Register the full screen link (https://github.com/sindresorhus/screenfull.js)
                $('#fullscreen').click(function () {
                    if (Screenfull.enabled) {
                        if (Screenfull.isFullscreen) {
                            Screenfull.exit();
                        } else {
                            Screenfull.request();
                        }
                    }
                });

                return this;
            }
        });
    }
);
