/* global define:false */
define([ 'jquery', 'underscore', 'backbone', 'marionette' ],
    function ($, _, Backbone, Marionette) {
        'use strict';

        return Marionette.ItemView.extend({
            tagName: 'div',

            template: function (scores) {
                var scoresTemplate = '' +
                    '<h1 style="white-space:nowrap;">' +
                    '  <a href="/#/scores/current"><span style="padding-left:2rem;">Tippekonkurranse <%= args.year %></span></a>' +
                    '  <span style="font-size:2rem;color:#808080;">&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= args.round %></span>' +
                    '  <span style="font-size:2rem;color:#d3d3d3;">av 30</span>' +
                    '  <span id="offlineScoresNotification" class="hidden" ' +
                    'data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" ' +
                    'style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;">' +
                    '  </span>' +
                    '</h1>';

                var ratingHistoryTemplate = '' +
                    '<h1 style="white-space:nowrap;padding-bottom:2rem;">' +
                    '  <a href="/#/scores/current"><span style="padding-left:2rem;">Tippekonkurranse <%= args.year %></span></a>' +
                    '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;poengtrend</span>' +
                    '</h1>';

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
            }
        });
    }
);
