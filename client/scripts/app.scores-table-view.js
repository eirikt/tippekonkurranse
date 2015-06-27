/* global define:false */
/* jshint -W106 */
define([ 'jquery', 'underscore', 'backbone', 'marionette', 'bootstrap', 'moment', 'moment.nb',
        'backbone.fetch-local-copy', 'client-utils', 'backbone.bootstrap.views',
        'app.models', 'app.scores-header-row-view', 'app.scores-participant-row-view', 'app.soccer-table-views' ],
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
            //return Marionette.CompositeView.extend({
            tagName: 'div',
            className: 'participants scores-table',
            /*
             template: function (model) {
             return _.template('' +
             '<thead>' +
             '<tr>' +
             '  <th style="width:4rem;"><div style="width:4rem;"></div></th>' +
             '  <th style="width:14rem;"><div></div></th>' +
             '  <th style="width:8rem;"><div></div></th>' +
             '  <th class="rating-history" colspan="2">' +
             '    <div>' +
             '      <a href="/#/ratinghistory/<%= args.year %>/<%= args.round %>" type="button" class="btn btn-sm btn-success">' +
             '        <span style="margin-right:1rem;" class="icon-line-chart"></span>Trend' +
             '      </a>' +
             '    </div>' +
             '  </th>' +
             '  <th class="current-results">' +
             '    <div>' +
             '      <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#currentResultsTable">Gjeldende resultater</button>' +
             '    </div>' +
             '  </th>' +
             '  <th style="text-align:center;color:darkgray;width:8rem;"><div>Tabell</div></th>' +
             '  <th style="text-align:center;color:darkgray;width:8rem;"><div>Pall</div></th>' +
             '  <th style="text-align:center;color:darkgray;width:9rem;"><div>Nedrykk</div></th>' +
             '  <th style="text-align:center;color:darkgray;width:9rem;"><div>Toppsk.</div></th>' +
             '  <th style="text-align:center;color:darkgray;width:9rem;"><div>Opprykk</div></th>' +
             '  <th style="text-align:center;color:darkgray;width:9rem;"><div>Cup</div></th>' +
             '</tr>' +
             '</thead>' +

             '<tbody></tbody>',

             { variable: 'args' }, model);
             },
             childViewContainer: 'tbody',
             */
            //childView: ParticipantRowView,
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

            /*
             // The default implementation:
             attachHtml: function (collectionView, childView, index) {
             if (collectionView.isBuffering) {
             // buffering happens on reset events and initial renders
             // in order to reduce the number of inserts into the
             // document, which are expensive.
             collectionView.elBuffer.appendChild(childView.el);
             }
             else {
             // If we've already rendered the main collection, just
             // append the new children directly into the element.
             collectionView.$el.append(childView.el);
             }
             },

             // Called after all children have been appended into the elBuffer
             attachBuffer: function (collectionView, buffer) {
             collectionView.$el.append(buffer);
             },

             // called on initialize and after attachBuffer is called
             initRenderBuffer: function () {
             this.elBuffer = document.createDocumentFragment();
             }
             */

            /*
             // No buffering! Rather animations ...
             initRenderBuffer: function () {
             console.log('"scores-table-view:initRenderBuffer (NO BUFFERING)"');
             },
             // Called after all children have been appended into the elBuffer
             attachBuffer: function(collectionView, buffer) {
             console.log('"scores-table-view:attachBuffer (NO BUFFERING)"');
             //collectionView.$el.append(buffer);
             },
             // Special handling of child views
             // NB! 'index' argument cannot be used ... probably due to special re-rendering of last collection in 'app.js'
             attachHtml: function (collectionView, childView, index) {
             console.log('"scores-table-view:attachHtml"');
             var self = this,
             //participantContainer = collectionView.$(collectionView.childViewContainer).first(),
             isRelocatingParticipants = function () {
             //return self.isBuffering === false && self.children.length === 13;
             //return self.collection.length === 14;
             return true;
             };
             if (isRelocatingParticipants()) {
             childView.$el.removeClass('outdated-scores').addClass('outdated-to-current-fadein').addClass('current-scores');
             var $lastCurrent = collectionView.$('.current-scores');
             if ($lastCurrent.length === 0) {
             // The collection is always sorted (by rating then name) - always put the first participant on top
             //childView.$el.prependTo(participantContainer);
             childView.$el.prependTo(collectionView.$el);
             } else {
             childView.$el.insertAfter($lastCurrent.last());
             }

             } else {
             // The collection is always sorted (by rating, then name) - if populating from scratch, just append the participants to the view container
             if (!this.isBuffering) {
             // Meaning NOT just re-rendering previous collection in a 'outdated'/blurry ('.outdated-scores') fashion ...
             childView.$el.addClass('blank-to-current-fadein');
             }
             //childView.$el.appendTo(participantContainer);
             childView.$el.appendTo(collectionView.$el);
             }
             },
             */
            onBeforeRender: function () {
                console.log('"scores-table-view:onBeforeRender"');
            },
            onBeforeAddChild: function (childView) {
                console.log('"scores-table-view:onBeforeAddChild"');

                //// The collection is always sorted - by rating, then name
                //childView.$el.css("order", childView._index);
                ////childView.$el.css("order", childView.model.get("rank"));
            },
            onAddChild: function (childView) {
                console.log('"scores-table-view:onAddChild"');
                /*
                 // Add rank tendency marker
                 //new RankTrendView({ el: childView.$('.rank-tendency'), model: childView.model }).render();

                 // Add rating tendency marker
                 //new RatingTrendView({ el: childView.$('.rating-tendency'), model: childView.model }).render();
                 */
            },
            onBeforeRemoveChild: function (childView) {
                console.log('"scores-table-view:onBeforeRemoveChild"');
            },
            onRemoveChild: function (childView) {
                console.log('"scores-table-view:onRemoveChild"');
            },
            onRender: function (collectionView) {
                console.log('"scores-table-view:onRender"');
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

                // Add header row
                // Works, but it feels hacky and smells of memory leaking ...
                //collectionView.$el.prepend(new HeaderRowView({ model: this.model }).render().el);
            },
            onShow: function (collectionView) {
                console.log('"scores-table-view:onShow"');
                /*
                 var participants = collectionView.$el.find('.participant'),
                 gold = collectionView.$el.find('.icon-trophy-gold'),
                 silver = collectionView.$el.find('.icon-trophy-silver'),
                 bronze = collectionView.$el.find('.icon-trophy-bronze'),
                 rank = collectionView.$el.find('.rank');

                 participants.removeClass('current-scores').addClass('outdated-scores');
                 gold.removeClass('icon-trophy-gold');
                 silver.removeClass('icon-trophy-silver');
                 bronze.removeClass('icon-trophy-bronze');
                 rank.empty();
                 */
            },
            onDomRefresh: function (collectionView) {
                console.log('"scores-table-view:onDomRefresh"');
            },
            onBeforeDestroy: function () {
                console.log('"scores-table-view:onBeforeDestroy"');
            },
            onDestroy: function () {
                console.log('"scores-table-view:onDestroy"');
            }
        });
    }
);
