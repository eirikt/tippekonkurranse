/* global define:false */
define(
    [ 'jquery', 'underscore', 'backbone', 'marionette', 'app.models', 'app.result' ],
    function ($, _, Backbone, Marionette, App, ParticipantScore) {
        'use strict';

        var Model = Backbone.Model,

            Collection = Backbone.Collection.extend({
                model: Model
            }),

            RankHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rank',
                template: _.identity
            }),

            NameHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'name',
                template: _.identity
            }),

            RankTrendHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rank-trend',
                template: _.identity
            }),

            RatingHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating',
                template: function (model) {
                    // TODO: Make a conditional _.template func
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<div>' +
                            '  <a href="/#/ratinghistory/<%= args.year %>/<%= args.round %>" type="button" class="btn btn-sm btn-success">' +
                            '    <span style="margin-right:1rem;" class="icon-line-chart"></span>Trend' +
                            '  </a>' +
                            '</div>',
                            model, { variable: 'args' });
                    }
                }
            }),

            RatingTrendHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating-trend',
                template: _.identity
            }),

            PredictionHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'prediction current-results',
                template: function (model) {
                    return _.template(
                        '<button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#currentResultsTable">Gjeldende resultater</button>',
                        model, { variable: 'args' });
                }
            }),

            TabellScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'tabell-score scores-table-header-row',
                template: function (model) {
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Tabell</span>',
                            model, { variable: 'args' });
                    }
                }
            }),

            PallScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'pall-score scores-table-header-row',
                template: function (model) {
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Opprykk</span>',
                            model, { variable: 'args' });
                    }
                }
            }),

            NedrykkScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'nedrykk-score scores-table-header-row',
                template: function (model) {
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Nedrykk</span>',
                            model, { variable: 'args' });
                    }
                }
            }),

            ToppscorerScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'toppscorer-score scores-table-header-row',
                template: function (model) {
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Toppsk.</span>',
                            model, { variable: 'args' });
                    }
                }
            }),

            OpprykkScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'opprykk-score scores-table-header-row',
                template: function (model) {
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Opprykk</span>',
                            model, { variable: 'args' });
                    }
                }
            }),

            CupScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'cup-score scores-table-header-row',
                template: function (model) {
                    if (model.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Cup</span>',
                            model, { variable: 'args' });
                    }
                }
            });


        return Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'participant current-scores scores-table-row',

            getChildView: function (model) {
                switch (model.get("column")) {
                    case 1:
                        return RankHeadingView;
                    case 2:
                        return NameHeadingView;
                    case 3:
                        return RankTrendHeadingView;
                    case 4:
                        return RatingHeadingView;
                    case 5:
                        return RatingTrendHeadingView;
                    case 6:
                        return PredictionHeadingView;
                    case 7:
                        return TabellScoreHeadingView;
                    case 8:
                        return PallScoreHeadingView;
                    case 9:
                        return NedrykkScoreHeadingView;
                    case 10:
                        return ToppscorerScoreHeadingView;
                    case 11:
                        return OpprykkScoreHeadingView;
                    case 12:
                        return CupScoreHeadingView;
                    default:
                        throw new Error("No heading row cell view declared for cell column #" + model.get("column"));
                }
            },

            onBeforeRender: function (collectionView) {
                this.collection = new Collection();

                // Match round navigation
                this.collection.add(new Model({
                        column: 1
                    })
                );
                this.collection.add(new Model({
                        column: 2
                    })
                );
                this.collection.add(new Model({
                        column: 3
                    })
                );
                this.collection.add(new Model({
                        column: 4,
                        year: collectionView.model.get(ParticipantScore.yearPropertyName),
                        round: collectionView.model.get(ParticipantScore.roundPropertyName),
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        column: 5
                    })
                );
                this.collection.add(new Model({
                        column: 6
                    })
                );
                this.collection.add(new Model({
                        column: 7,
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        column: 8,
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        column: 9,
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        column: 10,
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        column: 11,
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        column: 12,
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
            }
        });
    }
);
