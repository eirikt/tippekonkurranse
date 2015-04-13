/* global define:false */
define(
    ['jquery', 'underscore', 'backbone', 'marionette'],
    function ($, _, Backbone, Marionette) {
        'use strict';

        var Model = Backbone.Model,

            Collection = Backbone.Collection.extend({
                model: Model
            }),

            RightChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function () {
                    return _.template('<span class="icon-chevron-right"></span>');
                }
            }),

            EnabledRightChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    if (model.isFuture) {
                        return _.template(
                            '<a href="/#/scores/current"><span class="icon-chevron-right"></span></a>',
                            model, { variable: 'args' }
                        );
                    } else {
                        return _.template(
                            '<a href="/#/scores/<%= args.year %>/<%= args.round %>"><span class="icon-chevron-right"></span></a>',
                            model, { variable: 'args' }
                        );
                    }
                }
            }),

            LeftChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function () {
                    return _.template('<span class="icon-chevron-left"></span>');
                }
            }),

            EnabledLeftChevronView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<a href="/#/scores/<%= args.year %>/<%= args.round %>"><span class="icon-chevron-left"></span></a>',
                        model, { variable: 'args' }
                    );
                }
            }),

            EnabledView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    if (model.isFuture) {
                        return _.template(
                            '<a href="/#/scores/current"><%= args.index %></a>',
                            model, { variable: 'args' }
                        );
                    } else {
                        return _.template(
                            '<a href="/#/scores/<%= args.year %>/<%= args.round %>"><%= args.index %></a>',
                            model, { variable: 'args' }
                        );
                    }
                }
            }),

            ActiveView = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<strong><%= args.index %></strong>',
                        model, { variable: 'args' }
                    );
                }
            }),

            View = Marionette.ItemView.extend({
                tagName: 'span',
                template: function (model) {
                    return _.template(
                        '<span style="color:#cccccc"><%= args.index %></span>',
                        model, { variable: 'args' }
                    );
                }
            });

        return Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'x-large full-width-inline-list',
            template: _.identity,

            // TODO: Hmm, I don't quite see any complexity issue with a few ifs, JSHint ...
            getChildView: function (roundOrYear) {
                if (roundOrYear.get('isLeftChevron')) {
                    return roundOrYear.get('isEnabled') ? EnabledLeftChevronView : LeftChevronView;
                }
                if (roundOrYear.get('isRightChevron')) {
                    return roundOrYear.get('isEnabled') ? EnabledRightChevronView : RightChevronView;
                }
                if (roundOrYear.get('isActive')) {
                    return ActiveView;
                }
                if (roundOrYear.get('isEnabled')) {
                    return EnabledView;
                }
                return View;
            },

            onBeforeRender: function () {
                var counter;

                this.numberOfRounds = this.model.get('numberOfRounds');

                this.initialYear = this.model.get('initialYear');
                this.initialRound = this.model.get('initialRound');
                this.activeYear = this.model.get('year');
                this.activeRound = this.model.get('round');
                this.currentYear = this.model.get('currentYear');
                this.currentRound = this.model.get('currentRound');

                this.collection = new Collection();

                if (this.model.get('isSeason')) {

                    // Seasonal navigation
                    this.collection.add(new Model({
                        isSeason: true,
                        isLeftChevron: true,
                        isActive: null, // N/A
                        isEnabled: this.activeYear > this.initialYear,
                        year: this.activeYear - 1,
                        round: this.numberOfRounds,
                        index: null     // N/A,
                    }));
                    for (counter = this.initialYear; counter <= this.currentYear; counter += 1) {
                        this.collection.add(new Model({
                            isSeason: true,
                            isActive: counter === this.activeYear,
                            isFuture: this.model.isFutureRound({ year: counter }),
                            isEnabled: counter !== this.activeYear,
                            year: counter,
                            round: this.numberOfRounds, // Default for previous season, at least
                            index: counter
                        }));
                    }
                    this.collection.add(new Model({
                        isSeason: true,
                        isRightChevron: true,
                        isActive: null, // N/A
                        isFuture: this.model.isFutureRound({ year: this.activeYear + 1 }),
                        isEnabled: this.activeYear < this.currentYear,
                        year: this.activeYear + 1,
                        round: this.numberOfRounds,
                        index: null     // N/A
                    }));

                } else {

                    // Match round navigation
                    this.collection.add(new Model({
                            isLeftChevron: true,
                            isActive: null, // N/A
                            isEnabled: this.activeRound > 1,
                            year: this.activeYear,
                            round: this.activeRound - 1,
                            index: null     // N/A
                        })
                    );
                    for (counter = 1; counter <= this.numberOfRounds; counter += 1) {
                        this.collection.add(new Model({
                                isActive: counter === this.activeRound,
                                isEnabled: !this.model.isFutureRound({ round: counter }),
                                year: this.activeYear,
                                round: counter,
                                index: counter
                            })
                        );
                    }
                    this.collection.add(new Model({
                            isRightChevron: true,
                            isActive: null, // N/A
                            isEnabled: this.activeRound >= 1 && this.activeRound < 30 && (this.activeYear < this.currentYear || this.activeRound < this.currentRound),
                            year: this.activeYear,
                            round: this.activeRound + 1,
                            index: null     // N/A
                        })
                    );
                }
            }
        });
    }
);
