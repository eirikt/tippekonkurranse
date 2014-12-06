/* global define:false */
define([ 'jquery', 'underscore', 'backbone', 'marionette' ],
    function ($, _, Backbone, Marionette) {
        'use strict';

        var scoresTemplate = '' +
                '<h1 style="white-space:nowrap;">' +
                '  <a href="/#/scores/current"><span style="padding-left:2rem;">Tippekonkurranse <%= args.year %></span></a>' +
                '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= args.round %></span>' +
                '  <span style="font-size:2rem;color:#d3d3d3;">av 30</span>' +
                '  <span id="offlineScoresNotification" class="hidden" ' +
                'data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="Denne stillingen er beregnet" ' +
                'style="margin-left:.5rem;font-size:1.5rem;font-weight:bold;color:#ef8d15;">' +
                '  </span>' +
                '</h1>',

            ratingHistoryTemplate = '' +
                '<h1 style="white-space:nowrap;padding-bottom:2rem;">' +
                '  <a href="/#/scores/current"><span style="padding-left:2rem;">Tippekonkurranse <%= year %></span></a>' +
                '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;poengtrend</span>' +
                '</h1>';

        return Marionette.ItemView.extend({
            template: function (scores) {
                return _.template(scoresTemplate, {
                    year: scores[0].year,
                    round: scores[0].round
                }, { variable: 'args' });
            }

            //)//,
            //initialize: function () {
            //    this.listenTo(this.collection, 'reset', this.render);
            //},
            //render: function () {
            //    if (this.collection.rankingsHistory) {
            //        this.$el.empty().append(this.ratingHistoryTemplate({
            //            year: this.collection.year
            //        }));
            //    } else {
            //        this.$el.empty().append(this.scoresTemplate({
            //            year: this.collection.at(0).get('year'),
            //            round: this.collection.at(0).get('round')
            //        }));
            //    }
            //    return this;
            //}
        });
    }
);
