/* global define:false */

define([ 'jquery', 'underscore', 'backbone', 'marionette', 'bootstrap', 'backbone.bootstrap.views', 'app.models', 'app.result', 'app.soccer-table-views' ],
    function ($, _, Backbone, Marionette, Bootstrap, BootstrapViews, App, ParticipantScore, SoccerTableViews) {
        'use strict';

        var PredictionsModel = Backbone.Model.extend({
            url: function () {
                return [ App.resource.predictions.baseUri, this.get(ParticipantScore.yearPropertyName), this.get(ParticipantScore.userIdPropertyName) ].join('/');
            }
        });

        var BootstrapModalPredictionsView = Marionette.ItemView.extend({
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
            modelEvents: {
                'change': 'render'
            },
            onBeforeRender: function () {
                // Pretty user name presentation
                this.model.set(ParticipantScore.namePropertyName, this.model.get(ParticipantScore.userIdPropertyName).unSnakify().toTitleCase(), { silent: true });

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
            },
            onRender: function () {
                $('#predictionsTable').append(this.template(this.model.toJSON()));
            }
        });

        return Marionette.ItemView.extend({
            tagName: 'tr',
            className: 'participant current-scores',
            template: function (model) {
                return _.template('' +
                    '<td style="padding-left:2rem;">' +
                    '  <div class="rank strong"><%= args.' + ParticipantScore.rankPresentationPropertyName + ' %></div>' +
                    '</td>' +
                    '<td>' +
                    '  <div class="strong" style="white-space:nowrap;"><%= args.' + ParticipantScore.namePropertyName + ' %></div>' +
                    '</td>' +
                    '<td><div class="rank-tendency"></div></td>' +
                    '<td style="width:3rem;"><div></div></td>' +
                    '<td>' +
                    '  <div>' +
                    '    <span style="white-space:nowrap;">' +
                    '      <span class="strong" style="margin-right:.3rem;"><%= args.' + App.scoreModel.ratingPropertyName + '%></span>' +
                    '      <span class="rating-tendency"></span>' +
                    '    </span>' +
                    '  </div>' +
                    '</td>' +
                    '<td class="prediction">' +
                    '  <button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable"><%= args.' + ParticipantScore.namePropertyName + ' %>s tips</button>' +
                    '</td>' +
                    '<td style="color:darkgray;text-align:center;"><div><%= args.' + App.scoreModel.tabellPropertyName + ' %></div></td>' +
                    '<td style="color:darkgray;text-align:center;"><div><%= args.' + App.scoreModel.pallPropertyName + ' %></div></td>' +
                    '<td style="color:darkgray;text-align:center;"><div><%= args.' + App.scoreModel.nedrykkPropertyName + ' %></div></td>' +
                    '<td style="color:darkgray;text-align:center;"><div><%= args.' + App.scoreModel.toppscorerPropertyName + ' %></div></td>' +
                    '<td style="color:darkgray;text-align:center;"><div><%= args.' + App.scoreModel.opprykkPropertyName + ' %></div></td>' +
                    '<td style="color:darkgray;text-align:center;"><div><%= args.' + App.scoreModel.cupPropertyName + ' %></div></td>',

                    model, { variable: 'args' });
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
