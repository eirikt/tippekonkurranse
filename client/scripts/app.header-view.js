/* global define:false */
define([ 'jquery', 'underscore', 'moment', 'backbone', 'marionette' ],
    function ($, _, Moment, Backbone, Marionette) {
        'use strict';

        return Marionette.ItemView.extend({
            tagName: 'div',
            className: 'clearfix',
            template: function (scores) {
                var scoresTemplate = '' +
                    '  <span class="heading"><a href="/#/scores/current">Tippekonkurranse <%= args.year %></a></span>' +
                    '  <span class="heading-extra">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= args.round %></span>' +
                    '  <span class="dimmed heading-extra">&nbsp;av 30</span>' +
                    '  <span id="offlineScoresNotification" class="hidden" ' +
                    'data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" ' +
                    'style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;"></span>' +
                    '<div class="countdown pull-right">' +
                    '  <span><em>Til seriestart:&nbsp;</em></span>' +
                    '  <span id="countdown"></span>' +
                    '</div>';

                var ratingHistoryTemplate = '' +
                    '<div>' +
                    '  <span class="heading"><a href="/#/scores/current">Tippekonkurranse <%= args.year %></a></span>' +
                    '  <span class="heading-extra">&nbsp;&nbsp;|&nbsp;&nbsp;poengtrend</span>' +
                    '</div>';

                if (scores.isRatingHistory) {
                    return _.template(ratingHistoryTemplate, {
                        year: scores ? scores.year : '?'
                    }, { variable: 'args' });

                } else {
                    return _.template(scoresTemplate, {
                        year: scores ? scores.year : '?',
                        round: scores ? scores.round : '?'
                    }, { variable: 'args' });
                }
            },
            onRender: function () {
                this.$('#countdown').countdown(window.app.model.get('currentTippeligaSeasonStartDate'), function (event) {
                    $(this).html(event.strftime(
                        '<span class="contrast"><strong>%w</strong></span> uke ' +
                        '<span class="contrast"><strong>%d</strong></span> dager ' +
                        '<span class="contrast"><strong>%H</strong></span> timer ' +
                        '<span class="contrast"><strong>%M</strong></span> minutter ' +
                        '<span class="contrast"><strong>%S</strong></span> sekunder'));
                });
            }
        });
    }
);
