/* global define:false, wait:false, isTouchDevice:false */
/* jshint -W106 */

define([
        "jquery", "underscore", "backbone", "moment", "moment.nb",
        "app.models", "app.participant-score-view", "app.soccer-table-views",
        "backbone.fetch-local-copy", "utils"
    ],
    function ($, _, Backbone, Moment, Moment_nb, App, ParticipantScoreView, SoccerTableViews, BackboneFetchLocalCopy, Utils) {
        "use strict";

        var CurrentResults = Backbone.Model.extend({
            urlRoot: [App.resource.results.baseUri, App.resource.uri.element.current].join("/")
        });
        _.extend(CurrentResults.prototype, App.namedObject);
        _.extend(CurrentResults.prototype, BackboneFetchLocalCopy);

        var PrettyDateView = Backbone.View.extend({
                initialize: function () {
                    this.momentJsculture = this.model.culture || "en";
                    this.momentJsDateFormat = this.model.format || "Do MMMM YYYY";
                    Moment.lang(this.momentJsculture);
                    if (this.model instanceof Backbone.Model) {
                        this.model = this.model.toJSON();
                    }
                },
                render: function () {
                    //if (this.model.date) {
                    //    if (this.model.preamble) {
                    //        this.el = this.model.preamble + new Moment(this.model.date).format(this.momentJsDateFormat);
                    //    } else {
                    //        this.el = new Moment(this.model.date).format(this.momentJsDateFormat);
                    //    }
                    //} else {
                    this.el = new Moment().format(this.momentJsDateFormat);
                    //}
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
                        '            <p style="margin-top:2rem;">Fortsatt med i cupen:</p>' +
                        '            <p><strong><%= currentRemainingCupContenders %></strong></p>' +
                        '          </td>' +
                        '        </tr>' +
                        '      </table>' +
                        '    </div>' +
                        '  </div>' +
                        '</div>'
                ),
                initialize: function () {
                    this.listenTo(this.model, "change error", this.render);
                },
                render: function () {
                    // Always clone model before manipulating it/altering state
                    this.model = _.clone(this.model);

                    // Meta-data for offline
                    this.model.set("appName", this.model.name(), { silent: true });
                    this.model.set("uri", this.model.urlRoot, { silent: true });

                    // Pretty date presentation
                    var prettyDateView = new PrettyDateView({
                        model: {
                            //preamble: "Tippeligarunde " + this.model.get("currentRound") + "&nbsp;&nbsp;|&nbsp;&nbsp;",
                            date: this.model.get("currentDate"),
                            culture: "nb"
                        }
                    });
                    this.model.set("currentDate", prettyDateView.render().el, { silent: true });

                    // Pretty tabell presentation
                    var prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get("currentTippeligaTable"),
                        emphasizeFormat: "3+2"
                    });
                    this.model.set("currentTippeligaTable", prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty tabell presentation
                    prettyTabellView = new SoccerTableViews.SimpleTableView({
                        model: this.model.get("currentAdeccoligaTable"),
                        emphasizeFormat: "2+0"
                    });
                    this.model.set("currentAdeccoligaTable", prettyTabellView.render().$el.html(), { silent: true });

                    // Pretty toppskårer presentation
                    var cupContenders = this.model.get("currentTippeligaToppscorer");
                    cupContenders = _.reduce(cupContenders, function (result, toppscorer, index) {
                        return result += toppscorer + "<br/>";
                    }, "");
                    this.model.set("currentTippeligaToppscorer", cupContenders, { silent: true });

                    // Pretty cup presentation
                    //var cupContenders = this.model.get("currentRemainingCupContenders");
                    //cupContenders = _.reduce(cupContenders, function (result, team, index) {
                    //    //return index > 0 ? result += " og " + team : result += team;
                    //    //return result += team + "<br/>";
                    //}, "");
                    //this.model.set("currentRemainingCupContenders", cupContenders, { silent: true });
                    this.model.set("currentRemainingCupContenders", "Alle relevante ...", { silent: true });

                    this.$el.empty().append(this.template(this.model.toJSON()));

                    return this;
                }
            });


        return Backbone.View.extend({

            template: _.template('' +
                    '<table class="table table-condenced table-striped table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '  <th style="padding-left:2rem;width:3rem;"></th>' +
                    '  <th style="width:15rem;"></th>' +
                    '  <th style="width:5rem;"></th>' +
                    '  <th style="width:7rem;"></th>' +
                    '  <th class="current-results" style="padding-left:3rem;">' +
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

                    // All participant data here
                    '<tbody></tbody>' +

                    '</table>'
            ),

            currentResults: null,

            modalCurrentResultsView: null,

            initialize: function () {
                this.currentResults = new CurrentResults();
                this.modalCurrentResultsView = new ModalCurrentResultsView({
                    el: $("#currentResultsTable"),
                    model: this.currentResults
                });

                this.listenTo(this.collection, "reset", this.render);
            },

            render: function () {
                var self = this,
                    addParticipant = function ($el, participantScore) {
                        $el.append(new ParticipantScoreView({ model: participantScore.toJSON() }).render().el);
                    },
                    delayedAddParticipant = function (timeOutInMillis, $el, participantScore) {
                        var dfd = $.Deferred();
                        addParticipant($el, participantScore);
                        Utils.wait(timeOutInMillis).then(function () {
                            dfd.resolve();
                        });
                        return dfd.promise();
                    };

                this.$el.empty().append(this.template());
                if (Utils.isTouchDevice()) {
                    this.$("table").removeClass("table-hover");
                }

                // Configure modal results view
                this.$(".current-results").on("click", function () {
                    //self.currentResults.set("currentDate", null, { silent: true });
                    self.currentResults.fetch({ reset: true });
                });

                // Render all participant scores sequentially, one by one
                var delayedAddingOfParticipantInTableFuncs = [],
                    delayInMillis = 175,
                    $tbody = this.$("tbody"),
                    i,
                    sortedParticipant,
                    delayedParticipantFunc,
                    delayedAddingOfParticipantInTableFunc;

                for (i = 0; i < this.collection.length; i += 1) {
                    // Underscore: Bind a function to an object, meaning that whenever the function is called, the value of this will be the object
                    delayedParticipantFunc = _.bind(delayedAddParticipant, this);

                    // Underscore: Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
                    // You may pass _ in your list of arguments to specify an argument that should not be pre-filled, but left open to supply at call-time.
                    sortedParticipant = this.collection.at(i);
                    delayedParticipantFunc = _.partial(delayedParticipantFunc, delayInMillis, $tbody, sortedParticipant);

                    delayedAddingOfParticipantInTableFuncs.push(delayedParticipantFunc);
                }

                // Execute all these deferred functions sequentially
                delayedAddingOfParticipantInTableFunc = delayedAddingOfParticipantInTableFuncs[0]();
                for (i = 0; i < delayedAddingOfParticipantInTableFuncs.length; i += 1) {
                    delayedAddingOfParticipantInTableFunc =
                        delayedAddingOfParticipantInTableFunc.then(delayedAddingOfParticipantInTableFuncs[i + 1]);
                }

                return this;
            }
        });
    }
);
