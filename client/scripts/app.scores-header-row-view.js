/* global define:false */
define(
    ['jquery', 'underscore', 'backbone', 'marionette', 'app.models', 'app.result'],
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
                            '<span>Pall</span>',
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
                switch (model.get("columnType")) {
                    case "rank":
                        return RankHeadingView;
                    case "name":
                        return NameHeadingView;
                    case "rankTrend":
                        return RankTrendHeadingView;
                    case "rating":
                        return RatingHeadingView;
                    case "ratingTrend":
                        return RatingTrendHeadingView;
                    case "prediction":
                        return PredictionHeadingView;
                    case "tabell":
                        return TabellScoreHeadingView;
                    case "pall":
                        return PallScoreHeadingView;
                    case "nedrykk":
                        return NedrykkScoreHeadingView;
                    case "toppscorer":
                        return ToppscorerScoreHeadingView;
                    case "opprykk":
                        return OpprykkScoreHeadingView;
                    case "cup":
                        return CupScoreHeadingView;
                    default:
                        throw new Error("No heading row cell view declared for cell column #" + model.get("column"));
                }
            },

            onBeforeRender: function (collectionView) {
                var year = collectionView.model.get(ParticipantScore.yearPropertyName),
                    round = collectionView.model.get(ParticipantScore.roundPropertyName),
                    hideContent = collectionView.model.get("hasNoData");

                this.collection = new Collection();

                this.collection.add(new Model({
                        columnType: "rank"
                    })
                );
                this.collection.add(new Model({
                        columnType: "name"
                    })
                );
                this.collection.add(new Model({
                        columnType: "rankTrend"
                    })
                );
                this.collection.add(new Model({
                        columnType: "rating",
                        year: year,
                        round: round,
                        hideContent: hideContent
                    })
                );
                this.collection.add(new Model({
                        columnType: "ratingTrend"
                    })
                );
                this.collection.add(new Model({
                        columnType: "prediction"
                    })
                );
                this.collection.add(new Model({
                        columnType: "tabell",
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        columnType: "pall",
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                if (year === 2014) {
                    this.collection.add(new Model({
                            columnType: "nedrykk",
                            hideContent: collectionView.model.get("hasNoData")
                        })
                    );
                }
                this.collection.add(new Model({
                        columnType: "toppscorer",
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        columnType: "opprykk",
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
                this.collection.add(new Model({
                        columnType: "cup",
                        hideContent: collectionView.model.get("hasNoData")
                    })
                );
            }
        });
    }
);
