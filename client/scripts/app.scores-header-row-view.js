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

        // Switch with 'RatingTrendHeadingView' for UI reasons
            RatingHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating-trend',
                template: _.identity
            }),

        // Switch with 'RatingHeadingView' for UI reasons
            RatingTrendHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating',
                template: function (serializedModel) {
                    // TODO: Make a conditional _.template func !!
                    if (serializedModel.hideContent) {
                        return '';

                    } else if (serializedModel.isEnabled) {
                        return _.template(
                            '<div>' +
                            '  <a href="/#/ratinghistory/<%= args.year %>/<%= args.round %>" type="button" class="btn btn-sm btn-success">' +
                            '    <span style="margin-right:1rem;" class="icon-line-chart"></span>Trend' +
                            '  </a>' +
                            '</div>',
                            { variable: 'args' })(serializedModel);

                    } else {
                        return _.template(
                            '<div>' +
                            '  <a href="/#/ratinghistory/<%= args.year %>/<%= args.round %>" type="button" class="btn btn-sm btn-success" disabled=true>' +
                            '    <span style="margin-right:1rem;" class="icon-line-chart"></span>Trend' +
                            '  </a>' +
                            '</div>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            }),

            PredictionHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'prediction-header current-results',
                template: _.template(
                    '<button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#currentResultsTable">Gjeldende resultater</button>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            TabellScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'tabell-score scores-table-header-row',
                template: function (serializedModel) {
                    if (serializedModel.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Tabell</span>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            }),

            PallScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'pall-score scores-table-header-row',
                template: function (serializedModel) {
                    if (serializedModel.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Pall</span>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            }),

            NedrykkScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'nedrykk-score scores-table-header-row',
                template: function (serializedModel) {
                    if (serializedModel.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Nedrykk</span>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            }),

            ToppscorerScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'toppscorer-score scores-table-header-row',
                template: function (serializedModel) {
                    if (serializedModel.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Toppsk.</span>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            }),

            OpprykkScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'opprykk-score scores-table-header-row',
                template: function (serializedModel) {
                    if (serializedModel.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Opprykk</span>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            }),

            CupScoreHeadingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'cup-score scores-table-header-row',
                template: function (serializedModel) {
                    if (serializedModel.hideContent) {
                        return '';

                    } else {
                        return _.template(
                            '<span>Cup</span>',
                            { variable: 'args' })(serializedModel);
                    }
                }
            });


        return Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'participant current-scores scores-table-row',

            getChildView: function (model) {
                switch (model.get('columnType')) {
                    case 'rank':
                        return RankHeadingView;
                    case 'name':
                        return NameHeadingView;
                    case 'rankTrend':
                        return RankTrendHeadingView;
                    case 'rating':
                        // Switch with 'ratingTrend' for UI reasons
                        return RatingTrendHeadingView;
                    case 'ratingTrend':
                        // Switch with 'rating' for UI reasons
                        return RatingHeadingView;
                    case 'prediction':
                        return PredictionHeadingView;
                    case 'tabell':
                        return TabellScoreHeadingView;
                    case 'pall':
                        return PallScoreHeadingView;
                    case 'nedrykk':
                        return NedrykkScoreHeadingView;
                    case 'toppscorer':
                        return ToppscorerScoreHeadingView;
                    case 'opprykk':
                        return OpprykkScoreHeadingView;
                    case 'cup':
                        return CupScoreHeadingView;
                    default:
                        throw new Error('No heading row cell view declared for cell column #' + model.get('column'));
                }
            },

            onBeforeRender: function (collectionView) {
                var isHistoricDataAvailable = collectionView.model.get('isHistoricDataAvailable'),
                    year = collectionView.model.get(ParticipantScore.yearPropertyName),
                    round = collectionView.model.get(ParticipantScore.roundPropertyName),
                    hideContent = collectionView.model.get('hasNoData');

                this.collection = new Collection();

                this.collection.add(new Model({
                        columnType: 'rank'
                    })
                );
                this.collection.add(new Model({
                        columnType: 'name'
                    })
                );
                this.collection.add(new Model({
                        columnType: 'rankTrend'
                    })
                );
                this.collection.add(new Model({
                        columnType: 'rating',
                        isEnabled: isHistoricDataAvailable,
                        year: year,
                        round: round,
                        hideContent: hideContent
                    })
                );
                this.collection.add(new Model({
                        columnType: 'ratingTrend'
                    })
                );
                this.collection.add(new Model({
                        columnType: 'prediction'
                    })
                );
                this.collection.add(new Model({
                        columnType: 'tabell',
                        hideContent: collectionView.model.get('hasNoData')
                    })
                );
                this.collection.add(new Model({
                        columnType: 'pall',
                        hideContent: collectionView.model.get('hasNoData')
                    })
                );
                if (year === 2014) {
                    this.collection.add(new Model({
                            columnType: 'nedrykk',
                            hideContent: collectionView.model.get('hasNoData')
                        })
                    );
                }
                this.collection.add(new Model({
                        columnType: 'toppscorer',
                        hideContent: collectionView.model.get('hasNoData')
                    })
                );
                this.collection.add(new Model({
                        columnType: 'opprykk',
                        hideContent: collectionView.model.get('hasNoData')
                    })
                );
                this.collection.add(new Model({
                        columnType: 'cup',
                        hideContent: collectionView.model.get('hasNoData')
                    })
                );
            }
        });
    }
);
