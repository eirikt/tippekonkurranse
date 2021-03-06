/* global define:false */
define(
    ['jquery', 'underscore', 'backbone', 'marionette', 'app.models', 'app.result', 'backbone.bootstrap.views', 'app.soccer-table-views'],
    function ($, _, Backbone, Marionette, App, ParticipantScore, BootstrapViews, SoccerTableViews) {
        'use strict';

        var Model = Backbone.Model,

            Collection = Backbone.Collection.extend({
                model: Model
            }),

            PredictionsModel = Backbone.Model.extend({
                url: function () {
                    return [App.resource.predictions.baseUri, this.get(ParticipantScore.yearPropertyName), this.get(ParticipantScore.userIdPropertyName)].join('/');
                }
            }),

            BootstrapModalPredictionsView = Marionette.ItemView.extend({
                template: _.template('' +
                    '<div class="modal-dialog">' +
                    '  <div class="modal-content">' +
                    '    <div class="modal-header">' +
                    '      <button type="button" class="close" style="font-size:xx-large;font-weight:bold;" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '      <h4 class="modal-title" id="predictionsLabel"><strong><%= args.' + ParticipantScore.namePropertyName + ' %>s tippetips <%= args.' + ParticipantScore.yearIdPropertyName + ' %></strong></h4>' +
                    '    </div>' +
                    '    <div class="modal-body">' +
                    '      <table>' +
                    '        <tr>' +
                    '          <td>' +
                    '            <p style="margin-left:.8rem;">Eliteserien:<br/><strong><%= args.' + App.scoreModel.tabellPropertyName + ' %></strong></p>' +
                    '          </td>' +
                    '          <td style="vertical-align:top;padding-left:4rem;">' +
                    '            <p>Toppskårer:</p>' +
                    '            <p><strong><%= args.' + App.scoreModel.toppscorerPropertyName + ' %></strong></p>' +
                    '            <p style="margin-top:4rem;">Opprykk:</p>' +
                    '            <p><strong><%= args.' + App.scoreModel.opprykkPropertyName + ' %></strong></p>' +
                    '            <p style="margin-top:4rem;">Cupmester:</p>' +
                    '            <p><strong><%= args.' + App.scoreModel.cupPropertyName + ' %></strong></p>' +
                    '          </td>' +
                    '        </tr>' +
                    '      </table>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>',
                    { variable: 'args' }
                ),
                modelEvents: {
                    'change': 'render'
                },
                onBeforeRender: function () {
                    // Pretty user name presentation
                    this.model.set(ParticipantScore.namePropertyName, this.model.get(ParticipantScore.userIdPropertyName).unSnakify().toTitleCase(), { silent: true });

                    // Pretty tabell presentation
                    var prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get(App.scoreModel.tabellPropertyName),
                        emphasizeFormat: '3+0'
                    });
                    this.model.set(App.scoreModel.tabellPropertyName, prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty opprykk presentation
                    var prettyOpprykk = this.model.get(App.scoreModel.opprykkPropertyName);
                    prettyOpprykk = _.reduce(prettyOpprykk, function (result, team, index) {
                        return index > 0 ? result += ' og ' + team : result += team;
                    }, '');
                    this.model.set(App.scoreModel.opprykkPropertyName, prettyOpprykk, { silent: true });
                },
                onRender: function () {
                    $('#predictionsTable').append(this.template(this.model.toJSON()));
                }
            }),

            RankView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rank strong',
                template: _.template(
                    '<%= args.' + ParticipantScore.rankPresentationPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            NameView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'name strong',
                template: _.template(
                    '<%= args.' + ParticipantScore.namePropertyName + ' %>',
                    { variable: 'args' }),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            RankTrendView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rank-trend',
                template: _.template(
                    '<span class="tendency-arrow"></span>' +
                    '<small>&nbsp;<%= args.rankDiff %></small>',
                    { variable: 'args' }
                ),
                onBeforeRender: function () {
                    if (!this.model.get(ParticipantScore.previousRankPropertyName)) {
                        return this;
                    }
                    var upwardTrend = this.model.get(ParticipantScore.previousRankPropertyName) - this.model.get(ParticipantScore.rankPropertyName),
                        rankDiff = upwardTrend;

                    this.model.set('rankDiff', '');
                    if (rankDiff !== 0) {
                        if (rankDiff > 0) {
                            rankDiff = '+' + rankDiff;
                        }
                        this.model.set('rankDiff', rankDiff);
                    }
                },
                // TODO: Hmm, I don't quite see any complexity issue with a few ifs, JSHint ...
                onRender: function () {
                    if (!this.model.get(ParticipantScore.previousRankPropertyName)) {
                        return this;
                    }
                    // TODO: Adjust/Set this threshold based on round - the round should be included in the model provided
                    var plusThreshold = 3,
                        upwardTrend = this.model.get(ParticipantScore.previousRankPropertyName) - this.model.get(ParticipantScore.rankPropertyName),
                        downwardTrend = this.model.get(ParticipantScore.rankPropertyName) - this.model.get(ParticipantScore.previousRankPropertyName),
                        $tendency;

                    $tendency = this.$('span.tendency-arrow');

                    if (upwardTrend >= plusThreshold) {
                        $tendency.addClass('icon-up-plus');

                    } else if (upwardTrend > 0) {
                        $tendency.addClass('icon-up');

                    } else if (downwardTrend >= plusThreshold) {
                        $tendency.addClass('icon-down-plus');

                    } else if (downwardTrend > 0) {
                        $tendency.addClass('icon-down');
                    }
                    $tendency.removeClass('tendency-arrow');

                    this.template(this.model.toJSON());
                }
            }),

            RatingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating strong',
                template: _.template(
                    '<%= args.' + App.scoreModel.ratingPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            RatingTrendView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating-trend',
                template: _.template(
                    '<small><%= args.ratingDiff %></small>',
                    { variable: 'args' }
                ),
                onBeforeRender: function () {
                    if (!this.model.get(App.scoreModel.previousRatingPropertyName)) {
                        return this;
                    }
                    this.model.set('ratingDiff', '');
                    var ratingDiff = this.model.get(App.scoreModel.ratingPropertyName) - this.model.get(App.scoreModel.previousRatingPropertyName);
                    if (ratingDiff !== 0) {
                        if (ratingDiff > 0) {
                            ratingDiff = '+' + ratingDiff;
                        }
                        this.model.set('ratingDiff', '(' + ratingDiff + 'p)');
                    }
                },
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            PredictionView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'prediction',
                template: _.template(
                    '<button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable"><%= args.' + ParticipantScore.namePropertyName + ' %>s tips</button>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            TabellScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'tabell-score',
                template: _.template(
                    '<%= args.' + App.scoreModel.tabellPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            PallScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'pall-score',
                template: _.template(
                    '<%= args.' + App.scoreModel.pallPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            NedrykkScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'nedrykk-score',
                template: _.template(
                    '<%= args.' + App.scoreModel.nedrykkPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            ToppscorerScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'toppscorer-score',
                template: _.template(
                    '<%= args.' + App.scoreModel.toppscorerPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            OpprykkScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'opprykk-score',
                template: _.template(
                    '<%= args.' + App.scoreModel.opprykkPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            }),

            CupScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'cup-score',
                template: _.template(
                    '<%= args.' + App.scoreModel.cupPropertyName + ' %>',
                    { variable: 'args' }
                ),
                onRender: function () {
                    this.template(this.model.toJSON());
                }
            });


        return Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'participant current-scores scores-table-row',

            getChildView: function (model) {
                switch (model.get('columnType')) {
                    case 'rank':
                        return RankView;
                    case 'name':
                        return NameView;
                    case 'rankTrend':
                        return RankTrendView;
                    case 'rating':
                        return RatingView;
                    case 'ratingTrend':
                        return RatingTrendView;
                    case 'prediction':
                        return PredictionView;
                    case 'tabell':
                        return TabellScoreView;
                    case 'pall':
                        return PallScoreView;
                    case 'nedrykk':
                        return NedrykkScoreView;
                    case 'toppscorer':
                        return ToppscorerScoreView;
                    case 'opprykk':
                        return OpprykkScoreView;
                    case 'cup':
                        return CupScoreView;
                    default:
                        throw new Error('No participant row cell view declared for cell column #' + model.get('column'));
                }
            },
            bootstrapModalContainerView: null,
            predictionsModel: null,
            modalPredictionsView: null,
            events: {
                'click .prediction': function () {
                    this.bootstrapModalContainerView.reset();
                    this.predictionsModel.fetch();
                }
            },
            initialize: function () {
                this.bootstrapModalContainerView = new BootstrapViews.ModalContainerView({
                    parentSelector: 'body',
                    id: 'predictionsTable',
                    ariaLabelledBy: 'predictionsLabel'
                });
            },
            onBeforeRender: function (collectionView) {
                var year = collectionView.model.get(ParticipantScore.yearPropertyName);

                this.collection = new Collection();

                this.collection.add(new Model({
                        columnType: 'rank',
                        rank: collectionView.model.get(ParticipantScore.rankPropertyName),
                        // TODO: Move all rank presentation logic into RankView
                        rankPresentation: collectionView.model.get(ParticipantScore.rankPresentationPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'name',
                        name: collectionView.model.get(ParticipantScore.namePropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'rankTrend',
                        rank: collectionView.model.get(ParticipantScore.rankPropertyName),
                        previousRank: collectionView.model.get(ParticipantScore.previousRankPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'rating',
                        rating: collectionView.model.get(App.scoreModel.ratingPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'ratingTrend',
                        rating: collectionView.model.get(App.scoreModel.ratingPropertyName),
                        previousRating: collectionView.model.get(App.scoreModel.previousRatingPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'prediction',
                        name: collectionView.model.get(ParticipantScore.namePropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'tabell',
                        tabell: collectionView.model.get(App.scoreModel.tabellPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'pall',
                        pall: collectionView.model.get(App.scoreModel.pallPropertyName)
                    })
                );
                if (year === 2014) {
                    this.collection.add(new Model({
                            columnType: 'nedrykk',
                            nedrykk: collectionView.model.get(App.scoreModel.nedrykkPropertyName)
                        })
                    );
                }
                this.collection.add(new Model({
                        columnType: 'toppscorer',
                        toppscorer: collectionView.model.get(App.scoreModel.toppscorerPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'opprykk',
                        opprykk: collectionView.model.get(App.scoreModel.opprykkPropertyName)
                    })
                );
                this.collection.add(new Model({
                        columnType: 'cup',
                        cup: collectionView.model.get(App.scoreModel.cupPropertyName)
                    })
                );
            },
            onRender: function () {
                this.predictionsModel = new PredictionsModel({
                    userId: this.model.get('userId'),
                    year: this.model.get('year')
                });
                this.modalPredictionsView = new BootstrapModalPredictionsView({
                    el: $('#' + this.bootstrapModalContainerView.id),
                    model: this.predictionsModel
                });
            }
        });
    }
);
