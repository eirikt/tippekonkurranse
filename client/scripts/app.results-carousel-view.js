// TODO: Rename to 'app.round-navigator-view.js'
/* global define:false */
define(
    [ 'jquery', 'underscore', 'backbone', 'marionette' ],
    function ($, _, Backbone, Marionette) {
        'use strict';

        var Round = Backbone.Model,

            RoundCollection = Backbone.Collection.extend({
                model: Round
            }),

            RightChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function () {
                    return _.template('<span class="icon-chevron-right"></span>');
                }
            }),

            SelectableRightChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<a href="/#/scores/<%= args.year %>/<%= args.round %>"><span class="icon-chevron-right"></span></a>',
                        { year: model.year, round: model.round },
                        { variable: 'args' }
                    );
                }
            }),

            LeftChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function () {
                    return _.template('<span class="icon-chevron-left"></span>');
                }
            }),

            SelectableLeftChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<a href="/#/scores/<%= args.year %>/<%= args.round %>"><span class="icon-chevron-left"></span></a>',
                        { year: model.year, round: model.round },
                        { variable: 'args' }
                    );
                }
            }),

            SelectableRoundView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<a href="/#/scores/<%= args.year %>/<%= args.round %>"><%= args.round %></a>',
                        { year: model.year, round: model.round },
                        { variable: 'args' }
                    );
                }
            }),

            SelectedRoundView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<strong><%= args.round %></strong>',
                        { round: model.round },
                        { variable: 'args' }
                    );
                }
            }),

            RoundView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<span style="color:#cccccc"><%= args.round %></span>',
                        { round: model.round },
                        { variable: 'args' }
                    );
                }
            });

        return Marionette.CompositeView.extend({
            template: _.identity,
            className: 'x-large full-width-inline-list',

            // TODO: I don't quite see the complexity trouble with a few ifs ...
            getChildView: function (round) {
                if (round.get('isLeftChevron')) {
                    return round.get('isLink') ? SelectableLeftChevronView : LeftChevronView;
                }
                if (round.get('isRightChevron')) {
                    return round.get('isLink') ? SelectableRightChevronView : RightChevronView;
                }
                if (round.get('isSelectedRound')) {
                    return SelectedRoundView;
                }
                if (round.get('isSelectableRound')) {
                    return SelectableRoundView;
                }
                return RoundView;
            },

            onBeforeRender: function () {
                var roundCounter = 1;

                this.year = parseInt(this.model.year, 10);
                this.selectedRound = parseInt(this.model.round, 10);
                this.currentYear = parseInt(this.model.currentYear, 10);
                this.currentRound = parseInt(this.model.currentRound, 10);

                this.collection = new RoundCollection();

                this.collection.add(new Round({
                        isLeftChevron: true,
                        isLink: this.selectedRound > 1,
                        year: this.year,
                        round: this.selectedRound - 1
                    })
                );
                for (; roundCounter <= 30; roundCounter += 1) {
                    this.collection.add(new Round({
                            isSelectedRound: roundCounter === this.selectedRound,
                            isSelectableRound: roundCounter <= this.currentRound,
                            year: this.year,
                            round: roundCounter
                        })
                    );
                }
                this.collection.add(new Round({
                        isRightChevron: true,
                        isLink: this.selectedRound < 30 && this.selectedRound < this.currentRound,
                        year: this.year,
                        round: this.selectedRound + 1
                    })
                );
            }
        });
    }
);
