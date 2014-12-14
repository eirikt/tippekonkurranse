// TODO: Rename to 'app.scores-table-view.js' or 'app.rankings-view.js' or 'app.standings-view.js' or 'app.ratings-table-view.js'
/* global define:false, wait:false, isTouchDevice:false */
/* jshint -W106 */
define([
        'jquery', 'underscore', 'backbone', 'marionette', 'bootstrap', 'backbone.bootstrap.views', 'moment', 'moment.nb',
        'app.models', 'app.result', 'app.participant-score-view', 'app.soccer-table-views',
        'backbone.fetch-local-copy' ],
    function ($, _, Backbone, Marionette, Bootstrap, BootstrapViews, Moment, Moment_nb, App, ParticipantScore, ParticipantScoreView, SoccerTableViews, BackboneFetchLocalCopy) {
        'use strict';

        var CurrentResults = Backbone.Model.extend({
            urlRoot: [ App.resource.results.baseUri, App.resource.uri.element.current ].join('/')
        });
        _.extend(CurrentResults.prototype, App.nameable);
        _.extend(CurrentResults.prototype, BackboneFetchLocalCopy);

        var PrettyDateView = Backbone.View.extend({
                initialize: function () {
                    this.momentJsculture = this.model.culture || 'en';
                    this.momentJsDateFormat = this.model.format || 'Do MMMM YYYY';
                    Moment.lang(this.momentJsculture);
                    if (this.model instanceof Backbone.Model) {
                        this.model = this.model.toJSON();
                    }
                },
                render: function () {
                    this.el = new Moment().format(this.momentJsDateFormat);
                    return this;
                }
            }),

            ModalCurrentResultsView = Backbone.View.extend({
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
                        //'            <p style="margin-top:2rem;">Fortsatt med i cupen:</p>' +
                    '            <p style="margin-top:2rem;">Cupvinner 2014:</p>' +
                    '            <p><strong><%= currentRemainingCupContenders %></strong></p>' +
                    '          </td>' +
                    '        </tr>' +
                    '      </table>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
                ),
                initialize: function () {
                    this.listenTo(this.model, 'change error', this.render);
                },
                render: function () {
                    // Always clone model before manipulating it/altering state
                    this.model.clone();

                    // Meta-data for offline
                    this.model.set('appName', this.model.name(), { silent: true });
                    this.model.set('uri', this.model.urlRoot, { silent: true });

                    // Pretty date presentation
                    var prettyDateView = new PrettyDateView({
                        model: {
                            //preamble: 'Tippeligarunde ' + this.model.get('currentRound') + '&nbsp;&nbsp;|&nbsp;&nbsp;',
                            date: this.model.get('currentDate'),
                            culture: 'nb'
                        }
                    });
                    this.model.set('currentDate', prettyDateView.render().el, { silent: true });

                    // Pretty tabell presentation
                    var prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get('currentTippeligaTable'),
                        emphasizeFormat: '3+2'
                    });
                    this.model.set('currentTippeligaTable', prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty tabell presentation
                    prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get('currentAdeccoligaTable'),
                        emphasizeFormat: '2+0'
                    });
                    this.model.set('currentAdeccoligaTable', prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty toppscorer presentation
                    var toppscorer = this.model.get('currentTippeligaToppscorer');
                    toppscorer = _.reduce(toppscorer, function (result, toppscorer, index) {
                        return result += toppscorer + '<br/>';
                    }, '');
                    this.model.set('currentTippeligaToppscorer', toppscorer, { silent: true });

                    // Pretty cup presentation
                    var cupContenders = this.model.get('currentRemainingCupContenders');
                    cupContenders = _.reduce(cupContenders, function (result, team, index) {
                        //return index > 0 ? result += ' og ' + team : result += team;
                        return result += team + '<br/>';
                    }, '');
                    this.model.set('currentRemainingCupContenders', cupContenders, { silent: true });

                    $('#currentResultsTable').append(this.template(this.model.toJSON()));

                    return this;
                }
            });

        var RankTrendView = Marionette.ItemView.extend({
            tagName: 'span',
            template: _.template(
                '<span class="tendency-arrow"></span>' +
                '<small>&nbsp;<%= args.rankDiff %></small>', null, { variable: 'args' }),

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
            // TODO: I don't quite see the complexity trouble with a few ifs ...
            onRender: function () {
                if (!this.model.get(ParticipantScore.previousRankPropertyName)) {
                    return this;
                }
                var plusThreshold = 2,
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
            }
        });


        var RatingTrendView = Marionette.ItemView.extend({
            tagName: 'span',
            template: _.template('<small><%= args.ratingDiff %></small>', null, { variable: 'args' }),
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
            }
        });


        return Marionette.CompositeView.extend({
            tagName: 'table',
            className: 'table table-condensed table-striped table-hover',
            template: function (model) {
                return _.template('' +
                    '<thead>' +
                    '<tr>' +
                    '  <th style="padding-left:2rem;width:3rem;"></th>' +
                    '  <th style="width:14rem;"></th>' +
                    '  <th style="width:8rem;"></th>' +
                    '  <th class="rating-history" colspan="2">' +
                    '    <a href="/#/ratinghistory/<%= args.year %>/<%= args.round %>" type="button" class="btn btn-sm btn-success">' +
                    '      <span style="margin-right:1rem;" class="icon-line-chart"></span>Trend' +
                    '    </a>' +
                    '  </th>' +
                    '  <th class="current-results">' +
                    '    <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#currentResultsTable">Gjeldende resultater</button>' +
                    '  </th>' +
                    '  <th style="text-align:center;color:darkgray;width:8rem;">Tabell</th>' +
                    '  <th style="text-align:center;color:darkgray;width:8rem;">Pall</th>' +
                    '  <th style="text-align:center;color:darkgray;width:9rem;">Nedrykk</th>' +
                    '  <th style="text-align:center;color:darkgray;width:9rem;">Toppsk.</th>' +
                    '  <th style="text-align:center;color:darkgray;width:9rem;">Opprykk</th>' +
                    '  <th style="text-align:center;color:darkgray;width:9rem;">Cup</th>' +
                    '</tr>' +
                    '</thead>' +

                        // All participant data goes here:
                    '<tbody></tbody>',

                    model, { variable: 'args' });
            },
            childViewContainer: 'tbody',
            childView: ParticipantScoreView,

            events: {
                'click .current-results': function () {
                    this.bootstrapModalContainerView.reset();
                    this.currentResults.fetch();
                }
            },

            currentResults: null,

            bootstrapModalContainerView: null,
            modalCurrentResultsView: null,

            // called on initialize and after attachBuffer is called
            initRenderBuffer: function () {
                console.log('"rating-table-view:INITRENDERBUFFER"');
                this.elBuffer = document.createDocumentFragment();
            },

            // The default implementation:
            attachHtml: function (collectionView, childView, index) {
                console.log('"rating-table-view:attachHtml"');
                if (collectionView.isBuffering) {
                    // buffering happens on reset events and initial renders
                    // in order to reduce the number of inserts into the
                    // document, which are expensive.
                    collectionView.elBuffer.appendChild(childView.el);
                    console.log('"rating-table-view:ATTACHHTML-BUFFERING"');
                } else {
                    // If we've already rendered the main collection, just
                    // append the new children directly into the element.
                    collectionView.$el.append(childView.el);
                    console.log('"rating-table-view:ATTACHHTML-NOBUFFERING"');
                }
            },

            // Called after all children have been appended into the elBuffer
            attachBuffer: function (collectionView, buffer) {
                console.log('"rating-table-view:ATTACHBUFFER"');
                collectionView.$el.append(buffer);
            },

            onBeforeRender: function (childView) {
                console.log('"rating-table-view:onBeforeRender"');
                this.model.set('year', childView.collection.year);
                this.model.set('round', childView.collection.round);
            },
            onRender: function (childView) {
                console.log('"rating-table-view:onRender"');
                this.currentResults = new CurrentResults();
                this.bootstrapModalContainerView = new BootstrapViews.ModalContainerView({
                    parentSelector: 'body',
                    id: 'currentResultsTable',
                    ariaLabelledBy: 'currentResultsLabel'
                });
                this.modalCurrentResultsView = new ModalCurrentResultsView({
                    model: this.currentResults
                });
            },
            onShow: function () {
                console.log('"rating-table-view:onShow"');
            },
            onDomRefresh: function () {
                console.log('"rating-table-view:onDomRefresh"');
            },
            onBeforeAddChild: function () {
                console.log('"rating-table-view:onBeforeAddChild"');
            },
            onAddChild: function (childView) {
                console.log('"rating-table-view:onAddChild"');

                // Add rating tendency marker
                //childView.$('.rank-tendency').append(new RankTrendView({ model: childView.model }).render().el);
                new RankTrendView({ el: childView.$('.rank-tendency'), model: childView.model }).render();

                // Add sum tendency marker
                //childView.$('.rating-tendency').append(new RatingTrendView({ model: childView.model }).render().el);
                new RatingTrendView({ el: childView.$('.rating-tendency'), model: childView.model }).render();
            },
            onBeforeRemoveChild: function () {
                console.log('"rating-table-view:onBeforeRemoveChild"');
            },
            onRemoveChild: function () {
                console.log('"rating-table-view:onRemoveChild"');
            },
            onBeforeDestroy: function () {
                console.log('"rating-table-view:onBeforeDestroy"');
            },
            onDestroy: function () {
                console.log('"rating-table-view:onDestroy"');
            }
        });
    }
);
