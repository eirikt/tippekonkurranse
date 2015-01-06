/* global define:false, alert:false */

define([ 'jquery', 'underscore', 'backbone', 'marionette', 'bootstrap', 'backbone.bootstrap.views', 'app.models', 'app.result', 'app.soccer-table-views' ],
    function ($, _, Backbone, Marionette, Bootstrap, BootstrapViews, App, ParticipantScore, SoccerTableViews) {
        'use strict';

        var PredictionsModel = Backbone.Model.extend({
            url: function () {
                return [ App.resource.predictions.baseUri, this.get(ParticipantScore.yearPropertyName), this.get(ParticipantScore.userIdPropertyName) ].join('/');
            }
        });

        /*
         var BootstrapModalPredictionsView = Backbone.View.extend({
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

         $('#predictionsTable').append(this.template(this.model.toJSON()));

         return this;
         }
         });
         */
        var BootstrapModalPredictionsView = Marionette.ItemView.extend({
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
            // called on initialize and after attachBuffer is called
            initRenderBuffer: function () {
                console.log('"BootstrapModalPredictionsView:INITRENDERBUFFER"');
            },

            onBeforeRender: function (childView) {
                console.log('"BootstrapModalPredictionsView:onBeforeRender"');

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

                $('#predictionsTable').append(this.template(this.model.toJSON()));

                return this;
            },
            onRender: function (childView) {
                console.log('"BootstrapModalPredictionsView:onRender"');
            },
            onShow: function () {
                console.log('"BootstrapModalPredictionsView:onShow"');
            },
            onDomRefresh: function () {
                console.log('"BootstrapModalPredictionsView:onDomRefresh"');
            },
            onBeforeAddChild: function () {
                console.log('"BootstrapModalPredictionsView:onBeforeAddChild"');
            },
            onAddChild: function (childView) {
                console.log('"BootstrapModalPredictionsView:onAddChild"');
            },
            onBeforeRemoveChild: function () {
                console.log('"BootstrapModalPredictionsView:onBeforeRemoveChild"');
            },
            onRemoveChild: function () {
                console.log('"BootstrapModalPredictionsView:onRemoveChild"');
            },
            onBeforeDestroy: function () {
                console.log('"BootstrapModalPredictionsView:onBeforeDestroy"');
            },
            onDestroy: function () {
                console.log('"BootstrapModalPredictionsView:onDestroy"');
            }
        });

        return Marionette.ItemView.extend({
            tagName: 'tr',
            template: function (model) {
                return _.template('' +
                    '<td style="padding-left:2rem;text-align:right;">' +
                    '  <span style="font-weight:bold;font-size:larger;"><%= args.' + ParticipantScore.rankPresentationPropertyName + ' %></span>' +
                    '</td>' +
                    '<td>' +
                    '  <span style="font-weight:bold;font-size:larger;white-space:nowrap;"><%= args.' + ParticipantScore.namePropertyName + ' %></span>' +
                    '</td>' +
                    '<td class="rank-tendency"></td>' +
                    '<td style="width:3rem;"></td>' +
                    '<td>' +
                    '  <span style="white-space:nowrap;">' +
                    '    <span style="font-weight:bold;font-size:larger;margin-right:.3rem;"><%= args.' + App.scoreModel.ratingPropertyName + '%></span>' +
                    '    <span class="rating-tendency"></span>' +
                    '  </span>' +
                    '</td>' +
                    '<td class="prediction">' +
                    '  <button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable"><%= args.' + ParticipantScore.namePropertyName + ' %>s tips</button>' +
                    '</td>' +
                    '<td style="color:darkgray;text-align:center;"><%= args.' + App.scoreModel.tabellPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= args.' + App.scoreModel.pallPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= args.' + App.scoreModel.nedrykkPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= args.' + App.scoreModel.toppscorerPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= args.' + App.scoreModel.opprykkPropertyName + ' %></td>' +
                    '<td style="color:darkgray;text-align:center;"><%= args.' + App.scoreModel.cupPropertyName + ' %></td>',

                    model, { variable: 'args' });
            },
            predictionsModel: null,
            bootstrapModalContainerView: null,
            modalPredictionsView: null,
            events: {
                "click .prediction": function () {
                    // TODO: Fix ASAP
                    //this.bootstrapModalContainerView.reset();
                    //$('#predictionsTable').empty().remove();

                    //$('body').append(this.bootstrapModalContainerView.el);
                    //this.predictionsModel.fetch({ reset: true });

                    alert("Coming back soon ...");
                }
            },
            onRender: function () {
                console.log('"participant-rating-view:onRender" (userId: ' + this.model.get('userId') + ' year: ' + this.model.get('year') + ")");

                this.bootstrapModalContainerView = new BootstrapViews.ModalContainerView({
                    parentSelector: 'body',
                    id: 'predictionsTable',
                    ariaLabelledBy: 'predictionsLabel'
                });

                this.predictionsModel = new PredictionsModel({
                    userId: this.model.get('userId'),
                    year: this.model.get('year')
                });
                this.modalPredictionsView = new BootstrapModalPredictionsView({
                    el: $('#predictionsTable'),
                    model: this.predictionsModel
                });
            }
        });
    }
);
