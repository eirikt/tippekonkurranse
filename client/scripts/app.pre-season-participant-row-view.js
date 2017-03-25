/* global define:false */
/* jshint -W014 */
define(
    [
        'jquery', 'underscore', 'backbone', 'marionette', 'moment',
        'app.models', 'app.result', 'backbone.bootstrap.views', 'app.soccer-table-views'
    ],
    function ($, _, Backbone, Marionette, Moment, App, ParticipantScore, BootstrapViews, SoccerTableViews) {
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
                    '      <h4 class="modal-title" id="predictionsLabel"><strong><%= ' + ParticipantScore.namePropertyName + ' %>s tippetips <%= ' + ParticipantScore.yearIdPropertyName + ' %></strong></h4>' +
                    '    </div>' +
                    '    <div class="modal-body">' +
                    '      <table>' +
                    '        <tr>' +
                    '          <td>' +
                    '            <p style="margin-left:.8rem;">Eliteserien:<br/><strong><%= ' + App.scoreModel.tabellPropertyName + ' %></strong></p>' +
                    '          </td>' +
                    '          <td style="vertical-align:top;padding-left:4rem;">' +
                    '            <p>Toppskårer:</p>' +
                        //'            <p><strong><%= ' + App.scoreModel.toppscorerPropertyName + ' %></strong></p>' +
                    '            <p style="margin-top:4rem;">Opprykk:</p>' +
                    '            <p><strong><%= ' + App.scoreModel.opprykkPropertyName + ' %></strong></p>' +
                    '            <p style="margin-top:4rem;">Cupmester:</p>' +
                        //'            <p><strong><%= ' + App.scoreModel.cupPropertyName + ' %></strong></p>' +
                    '          </td>' +
                    '        </tr>' +
                    '      </table>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
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
                    this.$('#predictionsTable').append(this.template(this.model.toJSON()));
                }
            }),

            RankView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rank strong',
                template: _.identity
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
                template: _.identity
            }),

            RatingView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating strong',
                template: _.identity
            }),

            RatingTrendView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'rating-trend',
                template: _.identity
            }),

            PredictionView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'prediction',
                template: function (model) {
                    if (model.hasPredictions) {
                        //return _.template(
                        //    '<button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable"><%= args.' + ParticipantScore.namePropertyName + ' %>s tips</button>',
                        //    { variable: 'args' }, model
                        //);
                        return "<span class='icon-check' style='padding-left:6rem;'></span>";

                    } else {
                        var eliteserieSeasonStartDate = window.app.model.get("currentEliteserieSeasonStartDate"),
                            eliteserieSeasonHasStarted = window.app.model.get("currentEliteserieSeasonHasStarted");

                        return eliteserieSeasonHasStarted
                            ? "<span style='color:red;padding-left:6rem;'>Tippetips ikke mottatt! Eliteserien startet " + new Moment(eliteserieSeasonStartDate).fromNow() + "!!</span>"
                            : "<span style='padding-left:6rem;'>Årets tippetips ikke mottatt ennå";
                    }
                }
            }),

            TabellScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'tabell-score',
                template: _.identity
            }),

            PallScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'pall-score',
                template: _.identity
            }),

            NedrykkScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'nedrykk-score',
                template: _.identity
            }),

            ToppscorerScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'toppscorer-score',
                template: _.identity
            }),

            OpprykkScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'opprykk-score',
                template: _.identity
            }),

            CupScoreView = Marionette.ItemView.extend({
                tagName: 'div',
                className: 'cup-score',
                template: _.identity
            });


        return Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'participant current-scores scores-table-row',

            getChildView: function (model) {
                switch (model.get("column")) {
                    case 1:
                        return RankView;
                    case 2:
                        return NameView;
                    case 3:
                        return RankTrendView;
                    case 4:
                        return RatingView;
                    case 5:
                        return RatingTrendView;
                    case 6:
                        return PredictionView;
                    case 7:
                        return TabellScoreView;
                    case 8:
                        return PallScoreView;
                    case 9:
                        return NedrykkScoreView;
                    case 10:
                        return ToppscorerScoreView;
                    case 11:
                        return OpprykkScoreView;
                    case 12:
                        return CupScoreView;
                    default:
                        throw new Error("No participant row cell view declared for cell column #" + model.get("column"));
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
                this.collection = new Collection();

                // Match round navigation
                this.collection.add(new Model({
                        column: 1,
                        rank: collectionView.model.get(ParticipantScore.rankPropertyName),
                        // TODO: Move all rank presentation logic into RankView
                        rankPresentation: collectionView.model.get(ParticipantScore.rankPresentationPropertyName)
                    })
                );
                this.collection.add(new Model({
                        column: 2,
                        name: collectionView.model.get(ParticipantScore.namePropertyName)
                    })
                );
                /*
                 this.collection.add(new Model({
                 column: 3,
                 rank: collectionView.model.get(ParticipantScore.rankPropertyName),
                 previousRank: collectionView.model.get(ParticipantScore.previousRankPropertyName)
                 })
                 );
                 this.collection.add(new Model({
                 column: 4,
                 rating: collectionView.model.get(App.scoreModel.ratingPropertyName)
                 })
                 );
                 this.collection.add(new Model({
                 column: 5,
                 rating: collectionView.model.get(App.scoreModel.ratingPropertyName),
                 previousRating: collectionView.model.get(App.scoreModel.previousRatingPropertyName)
                 })
                 );
                 */
                this.collection.add(new Model({
                        column: 6,
                        name: collectionView.model.get(ParticipantScore.namePropertyName),
                        hasPredictions: collectionView.model.get("hasPredictions")
                    })
                );
                /*
                 this.collection.add(new Model({
                 column: 7,
                 tabell: collectionView.model.get(App.scoreModel.tabellPropertyName)
                 })
                 );
                 this.collection.add(new Model({
                 column: 8,
                 pall: collectionView.model.get(App.scoreModel.pallPropertyName)
                 })
                 );
                 */
                this.collection.add(new Model({
                        column: 9,
                        nedrykk: collectionView.model.get(App.scoreModel.nedrykkPropertyName)
                    })
                );
                this.collection.add(new Model({
                        column: 10,
                        toppscorer: collectionView.model.get(App.scoreModel.toppscorerPropertyName)
                    })
                );
                this.collection.add(new Model({
                        column: 11,
                        opprykk: collectionView.model.get(App.scoreModel.opprykkPropertyName)
                    })
                );
                this.collection.add(new Model({
                        column: 12,
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
