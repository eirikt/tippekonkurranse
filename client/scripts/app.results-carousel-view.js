/* global define:false */
define([
        'jquery', 'underscore', 'backbone'
    ],
    function ($, _, Backbone) {
        'use strict';

        return Backbone.View.extend({

            template: _.template(
                '<div id="scoresCarousel" class="x-large full-width-inline-list" style="margin-left:2rem;margin-top:1rem;"></div>'
            ),

            initialize: function () {
                this.listenTo(this.collection, 'reset', this.render);
            },

            _renderArrowLink: function (direction) {
                if (direction === 'left') {
                    if (this.round <= 1) {
                        return '<span class="icon-chevron-left"></span>';
                    } else {
                        return '<a href="/#/scores/' + this.year + '/' + (this.round - 1) + '" class="icon-chevron-left"></a>';
                    }
                } else {
                    if (this.round >= this.currentRound) {
                        return '<span class="icon-chevron-right" style="padding-left:1.3rem;"></span>';
                    } else {
                        return '<a href="/#/scores/' + this.year + '/' + (this.round + 1) + '" class="icon-chevron-right" style="padding-left:1.3rem;"></a>';
                    }
                }
            },

            _renderRoundLink: function (round) {
                if (round === this.round) {
                    return '<span style="padding-left:1.3rem;"><strong>' + round + '</strong></span>';

                } else if (round > this.currentRound) {
                    return '<span style="padding-left:1.3rem;color:#cccccc">' + round + '</span>';

                } else {
                    return '<a href="/#/scores/' + this.year + '/' + round + '" style="padding-left:1.3rem;">' + round + '</a>';
                }
            },

            render: function () {
                if (!this.year || !this.round) {
                    this.year = parseInt(this.collection.year, 10);
                    this.round = parseInt(this.collection.round, 10);
                    //this.date = this.collection.date;
                    this.currentYear = parseInt(this.collection.currentYear, 10);
                    this.currentRound = parseInt(this.collection.currentRound, 10);
                }

                this.$el.empty().append(this.template());
                this.$('#scoresCarousel').append(this._renderArrowLink('left'));
                for (var round = 1; round <= 30; round += 1) {
                    this.$('#scoresCarousel').append(this._renderRoundLink(round));
                }
                this.$('#scoresCarousel').append(this._renderArrowLink('right'));

                return this;
            }
        });
    }
);
