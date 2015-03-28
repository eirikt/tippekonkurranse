/* global define:false */
/* jshint -W106 */
define([ 'jquery', 'underscore', 'backbone', 'marionette', 'bootstrap', 'moment', 'moment.nb',
        'backbone.fetch-local-copy', 'client-utils', 'backbone.bootstrap.views',
        'app.models', 'app.scores-header-row-view', 'app.pre-season-participant-row-view', 'app.soccer-table-views' ],

    function ($, _, Backbone, Marionette, Bootstrap, Moment, Moment_nb, BackboneFetchLocalCopy, utils, BootstrapViews, App, HeaderRowView, ParticipantRowView, SoccerTableViews) {

        'use strict';

        var CurrentResults = Backbone.Model.extend({
            url: function () {
                if (this.get('year') && this.get('round')) {
                    return [ App.resource.results.baseUri, this.get('year'), this.get('round') ].join('/');
                }
                return [ App.resource.results.baseUri, App.resource.uri.element.current ].join('/');
            }
        });
        _.extend(CurrentResults.prototype, App.nameable);
        _.extend(CurrentResults.prototype, BackboneFetchLocalCopy);


        var PrettyDateView = Marionette.ItemView.extend({
                render: function () {
                    this.momentJsculture = this.model.culture || 'en';
                    this.momentJsDateFormat = this.model.format || 'Do MMMM YYYY';
                    Moment.locale(this.momentJsculture);
                    return new Moment(this.model.date).format(this.momentJsDateFormat);
                }
            }),


            ModalCurrentResultsView = Marionette.ItemView.extend({
                template: _.template('' +
                    '<div class="modal-dialog">' +
                    '  <div class="modal-content">' +
                    '    <div class="modal-header">' +
                    '      <button type="button" class="close" style="font-size:xx-large;font-weight:bold;" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '      <span class="modal-title" style="font-size:large;" id="currentResultsLabel"><strong>Gjeldende fotballresultater</strong>&nbsp;&nbsp;|&nbsp;&nbsp;<%= currentDate %></span>' +
                    '    </div>' +
                    '    <div class="modal-body">' +
                    '      <p>' +
                    '        <span id="offlineCurrentResultsNotification" class="hidden" data-appname="<%= appName %>" data-uri="<%= uri %>" data-urititle="Disse fotballresultatene er hentet" style="color:#d20000;font-weight:bold;"></span>' +
                    '      </p>' +
                    '      <table style="width:100%">' +
                    '        <tr>' +
                    '          <td style="width:33%;vertical-align:top;">' +
                    '            <p style="margin-left:.8rem">Tippeliga:</p>' +
                    '            <p><strong><%= currentTippeligaTable %></strong></p>' +
                    '          </td>' +
                    '          <td style="width:33%;vertical-align:top;">' +
                    '            <p style="margin-left:.8rem">Adeccoliga:</p>' +
                    '            <p><strong><%= currentAdeccoligaTable %></strong></p>' +
                    '          </td>' +
                    '          <td style="width:33%;vertical-align:top;">' +
                    '            <p>Toppskårer:</p>' +
                    '            <p><strong><%= currentTippeligaToppscorer %></strong></p>' +
                    '            <p style="margin-top:2rem;">Fortsatt med i cupen:</p>' +
                    '            <p><strong><%= currentRemainingCupContenders %></strong></p>' +
                    '          </td>' +
                    '        </tr>' +
                    '      </table>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
                ),
                modelEvents: {
                    'change': 'render',
                    'error': 'render'
                },
                onBeforeRender: function () {
                    var prettyDateView,
                        prettyTabellView,
                        toppscorer,
                        cupContenders;

                    // Always clone model before manipulating it/altering state
                    this.model.clone();

                    // Meta-data for offline
                    this.model.set('appName', this.model.name(), { silent: true });
                    this.model.set('uri', this.model.urlRoot, { silent: true });

                    // Pretty date presentation
                    prettyDateView = new PrettyDateView({
                        model: {
                            //preamble: 'Tippeligarunde ' + this.model.get('currentRound') + '&nbsp;&nbsp;|&nbsp;&nbsp;',
                            date: this.model.get('currentDate'),
                            culture: 'nb'
                        }
                    });
                    this.model.set('currentDate', prettyDateView.render(), { silent: true });

                    // Pretty tabell presentation
                    prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get('currentTippeligaTable'),
                        emphasizeFormat: '3+0'
                    });
                    this.model.set('currentTippeligaTable', prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty tabell presentation
                    prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get('currentAdeccoligaTable'),
                        emphasizeFormat: '2+0'
                    });
                    this.model.set('currentAdeccoligaTable', prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty toppscorer presentation
                    toppscorer = this.model.get('currentTippeligaToppscorer');
                    toppscorer = _.reduce(toppscorer, function (result, toppscorer, index) {
                        return result += toppscorer + '<br/>';
                    }, '');
                    this.model.set('currentTippeligaToppscorer', toppscorer, { silent: true });

                    // Pretty cup presentation
                    cupContenders = this.model.get('currentRemainingCupContenders');
                    cupContenders = _.reduce(cupContenders, function (result, team, index) {
                        //return index > 0 ? result += ' og ' + team : result += team;
                        return result += team + '<br/>';
                    }, '');
                    this.model.set('currentRemainingCupContenders', cupContenders, { silent: true });
                },
                onRender: function () {
                    $('#currentResultsTable').append(this.template(this.model.toJSON()));
                }
            });


        return Marionette.CollectionView.extend({
            tagName: 'div',
            className: 'participants scores-table',
            getChildView: function (model) {
                if (model.has('rating')) {
                    return ParticipantRowView;
                }
                return HeaderRowView;
            },

            events: {
                'click .current-results': function () {
                    this.bootstrapModalContainerView.reset();
                    this.currentResults.fetch();
                }
            },

            currentResults: null,

            bootstrapModalContainerView: null,
            modalCurrentResultsView: null,

            onRender: function (collectionView) {
                console.log('"pre-season-table-view:onRender"');
                this.currentResults = new CurrentResults({
                    year: collectionView.model.get('year'),
                    round: collectionView.model.get('round')
                });
                this.bootstrapModalContainerView = new BootstrapViews.ModalContainerView({
                    parentSelector: 'body',
                    id: 'currentResultsTable',
                    ariaLabelledBy: 'currentResultsLabel'
                });
                this.modalCurrentResultsView = new ModalCurrentResultsView({
                    model: this.currentResults
                });
            }
        });
    }
);
