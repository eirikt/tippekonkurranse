/* global define:false */

define(['jquery', 'underscore', 'backbone', 'app.models', 'app.result', 'app.soccer-table-views'],
    function ($, _, Backbone, App, ParticipantScore, SoccerTableViews) {
        'use strict';

        var RankTrendView = Backbone.View.extend({
            tagName: 'span',
            template: _.template('' +
                    '<span class="tendency-arrow"></span>' +
                    '<small>&nbsp;<%= rankDiff %></small>'
            ),
            // TODO: reduce cyclic complexity (from 8 to 5)
            render: function () {
                if (!this.model[ParticipantScore.previousRankPropertyName]) {
                    return this;
                }
                var plusThreshold = 2,
                    upwardTrend = this.model[ParticipantScore.previousRankPropertyName] - this.model[ParticipantScore.rankPropertyName],
                    downwardTrend = this.model[ParticipantScore.rankPropertyName] - this.model[ParticipantScore.previousRankPropertyName],
                    rankDiff = upwardTrend,
                    $tendency;

                this.model.rankDiff = '';
                if (rankDiff !== 0) {
                    if (rankDiff > 0) {
                        rankDiff = '+' + rankDiff;
                    }
                    this.model.rankDiff = rankDiff;
                }

                this.$el.append(this.template(this.model));
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

                return this;
            }
        });


        var RatingTrendView = Backbone.View.extend({
            tagName: 'span',
            template: _.template('<small><%= ratingDiff %></small>'),
            render: function () {
                if (!this.model[App.scoreModel.previousRatingPropertyName]) {
                    return this;
                }
                var ratingDiff = this.model[App.scoreModel.ratingPropertyName] - this.model[App.scoreModel.previousRatingPropertyName];
                this.model.ratingDiff = '';
                if (ratingDiff !== 0) {
                    if (ratingDiff > 0) {
                        ratingDiff = '+' + ratingDiff;
                    }
                    this.model.ratingDiff = '(' + ratingDiff + 'p)';
                }
                this.$el.append(this.template(this.model));
                return this;
            }
        });


        var PredictionsModel = Backbone.Model.extend({
            url: function () {
                return [App.resource.predictions.baseUri, this.get(ParticipantScore.yearPropertyName), this.get(ParticipantScore.userIdPropertyName)].join('/');
            }
        });


        var ModalPredictionsTableView = Backbone.View.extend({
            template: _.template('' +
                    '<div class="modal-dialog">' +
                    '  <div class="modal-content">' +
                    '    <div class="modal-header">' +
                    '      <button type="button" class="close" style="font-size:xx-large;font-weight:bold;" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '      <h4 class="modal-title" id="predictionsLabel"><strong><%= ' + ParticipantScore.userIdPropertyName + ' %>s tippetips <%= ' + ParticipantScore.yearIdPropertyName + ' %></strong></h4>' +
                    '    </div>' +
                    '    <div class="modal-body">' +
                    '      <table>' +
                    '        <tr>' +
                    '          <td>' +
                    '            <p style="margin-left:.8rem;">Tippeliga:<br/><strong><%= ' + App.scoreModel.tabellPropertyName + ' %></strong></p>' +
                    '          </td>' +
                    '          <td style="vertical-align:top;padding-left:4rem;">' +
                    '            <p>Toppskårer:</p>' +
                    '            <p><strong><%= ' + App.scoreModel.toppscorerPropertyName + ' %></strong></p>' +
                    '            <p style="margin-top:4rem;">Opprykk:</p>' +
                    '            <p><strong><%= ' + App.scoreModel.opprykkPropertyName + ' %></strong></p>' +
                    '            <p style="margin-top:4rem;">Cupmester:</p>' +
                    '            <p><strong><%= ' + App.scoreModel.cupPropertyName + ' %></strong></p>' +
                    '          </td>' +
                    '        </tr>' +
                    '      </table>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
            ),
            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
            },
            render: function () {
                // Pretty user name presentation
                this.model.set(ParticipantScore.userIdPropertyName, this.model.get(ParticipantScore.userIdPropertyName).unSnakify().toTitleCase(), { silent: true });

                // Pretty tabell presentation
                var prettyTabellView = new SoccerTableViews.SimpleTableView({
                    model: this.model.get(App.scoreModel.tabellPropertyName),
                    emphasizeFormat: '3+2'
                });
                this.model.set(App.scoreModel.tabellPropertyName, prettyTabellView.render().$el.html(), { silent: true });

                // Pretty opprykk presentation
                var prettyOpprykk = this.model.get(App.scoreModel.opprykkPropertyName);
                prettyOpprykk = _.reduce(prettyOpprykk, function (result, team, index) {
                    return index > 0 ? result += ' og ' + team : result += team;
                }, '');
                this.model.set(App.scoreModel.opprykkPropertyName, prettyOpprykk, { silent: true });

                this.$el.empty().append(this.template(this.model.toJSON()));
                return this;
            }
        });


        return Backbone.View.extend({
            tagName: 'tr',

            template: _.template('' +
                    '<td style="padding-left:2rem;text-align:right;"><span style="font-weight:bold;font-size:larger;"><%= ' + ParticipantScore.rankPresentationPropertyName + ' %></span></td>' +
                    '<td><span style="font-weight:bold;font-size:larger;"><%= ' + ParticipantScore.namePropertyName + ' %></span></td>' +
                    '<td class="rank-tendency"></td>' +
                    '<td style="width:3rem;"></td>' +
                    '<td>' +
                    '  <span style="white-space:nowrap;">' +
                    '    <span style="font-weight:bold;font-size:larger;margin-right:.3rem;"><%= ' + App.scoreModel.ratingPropertyName + ' %></span>' +
                    '    <span class="rating-tendency"></span>' +
                    '  </span>' +
                    '</td>' +
                    '<td class="prediction">' +
                    '  <button type="button" class="btn btn-sm btn-primary" data-id="<%= ' + ParticipantScore.userIdPropertyName + ' %>" data-toggle="modal" data-target="#predictionsTable"><%= ' + ParticipantScore.namePropertyName + ' %>s tips</button>' +
                    '</td>' +
                    '<td style="color:darkgray;text-align:center;"><%= ' + App.scoreModel.tabellPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= ' + App.scoreModel.pallPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= ' + App.scoreModel.nedrykkPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= ' + App.scoreModel.toppscorerPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= ' + App.scoreModel.opprykkPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= ' + App.scoreModel.cupPropertyName + ' %></td>'
            ),

            //events: {
            //    "click .current-results": function () {
            //        //self.currentResults.set("currentDate", null, { silent: true });
            //        this.currentResults.fetch({ reset: true });
            //    }
            //},
            events: {
                "click .prediction": function () {
                    this.predictionsModel.fetch({ reset: true });
                }
            },

            predictionsModel: null,

            modalPredictionsView: null,

            initialize: function () {
                this.predictionsModel = new PredictionsModel({ userId: this.model.userId, year: this.model.year });
                this.modalPredictionsView = new ModalPredictionsTableView({
                    el: $('#predictionsTable'),
                    model: this.predictionsModel
                });
            },

            render: function () {
                var self = this;

                this.$el.append(this.template(this.model));

                // Add rating tendency marker
                this.$('.rank-tendency').append(new RankTrendView({ model: this.model }).render().el);

                // Add sum tendency marker
                this.$('.rating-tendency').append(new RatingTrendView({ model: this.model }).render().el);

                // Configure modal predictions view
                //this.$('.prediction').on('click', function () {
                //    self.predictionsModel.fetch({ reset: true });
                //});

                // Smoothly fades in content (default jQuery functionality) (OK)
                this.$el.find('td').wrapInner($('<div>'));
                this.$el.find('div').fadeIn('slow');

                // TODO: with CSS3 animations please ...
                // See: http://easings.net/nb
                //this.$el.find('td').wrapInner('<div class="hidden"></div>');
                //this.$el.find('div').removeClass('hidden').addClass('my-slide-in-effect');

                return this;
            }
        });
    }
);
