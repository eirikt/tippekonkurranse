/* global define: false */
define(["jquery", "underscore", "backbone", "app.participant-score-view"],
    function ($, _, Backbone, ParticipantScoreView) {
        "use strict";

        return Backbone.View.extend({
            pendingTemplate: _.template('' +
                '<table class="table table-condenced table-striped table-hover">' +
                '<thead><tr>' +
                '<th style="padding-left:2rem;"></th>' +
                '<th></th>' +
                '<th style="padding-right:3rem;"><strong></strong></th>' +
                '<th style="color:darkgray;width:9rem;">Tabell</th>' +
                '<th style="color:darkgray;width:9rem;">Pall</th>' +
                '<th style="color:darkgray;width:10rem;">Cup</th>' +
                '<th style="color:darkgray;width:10rem;">Toppskårer</th>' +
                '<th style="color:darkgray;width:10rem;">Opprykk</th>' +
                '<th style="color:darkgray;width:10rem;">Nedrykk</th>' +
                '</tr></thead>' +
                '<tbody>' +
                /*
                Einar
                2	Eirik
                3	Geir
                4	Hans Bernhard
                    5	Jan Tore
                6	Oddgeir
                7	Oddvar
                8	Ole Erik
                    9	Rikard
                    10	Sveinar
                    12	Tore
                    13	Trond
                    */
                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Einar</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Eirik</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Geir</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Hans Bernhard</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Jan Tore</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Oddgeir</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Oddvar</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Ole Erik</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Rikard</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Sveinar</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Tore</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '<tr><td style="padding-left:2rem;">1</td>' +
                '<td><strong>Trond</strong></td>' +
                '<td><strong>n/a</strong></td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '<td style="color:darkgray;">data mangler</td>' +
                '</tr>' +

                '</tbody>' +
                '</table>'
            ),
            template: _.template('' +
                '<table class="table table-condenced table-striped table-hover">' +
                '<thead><tr>' +
                '<th style="padding-left:2rem;"></th>' +
                '<th></th>' +
                '<th style="padding-right:3rem;"><strong></strong></th>' +
                '<th style="color:darkgray;width:9rem;">Tabell</th>' +
                '<th style="color:darkgray;width:9rem;">Pall</th>' +
                '<th style="color:darkgray;width:10rem;">Cup</th>' +
                '<th style="color:darkgray;width:10rem;">Toppskårer</th>' +
                '<th style="color:darkgray;width:10rem;">Opprykk</th>' +
                '<th style="color:darkgray;width:10rem;">Nedrykk</th>' +
                '</tr></thead>' +
                '<tbody></tbody>' +
                '</table>'
            ),
            initialize: function () {
                //this.listenTo(this.collection, "reset", this.render);
                this.pendingRender();
            },
            pendingRender: function () {
                var self = this;
                this.$el.append(this.pendingTemplate());
                return this;
            },
            render: function () {
                var self = this;
                this.$el.append(this.template());

                // TODO: replace with sequential appending with delay ...
                // See: http://blog.mediumequalsmessage.com/promise-deferred-objects-in-javascript-pt2-practical-use
                this.collection.each(function (participantResult, zeroBasedIndex) {

                    // TODO: proper calculation of score sorted numbers
                    participantResult.set("nr", 1, { silent: true });
                    //participantResult.set("nr", zeroBasedIndex + 1, { silent: true });

                    self.$("tbody").append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                });

                /* TODO: Starting point ...
                 var participantResult = self.collection.at(0);
                 participantResult.set("nr", 1, { silent: true });
                 self.$("tbody").append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                 setTimeout(function () {
                 participantResult = self.collection.at(1);
                 participantResult.set("nr", 1, { silent: true });
                 self.$("tbody").append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                 setTimeout(function () {
                 participantResult = self.collection.at(2);
                 participantResult.set("nr", 1, { silent: true });
                 self.$("tbody").append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                 setTimeout(function () {
                 participantResult = self.collection.at(3);
                 participantResult.set("nr", 1, { silent: true });
                 self.$("tbody").append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                 setTimeout(function () {
                 participantResult = self.collection.at(4);
                 participantResult.set("nr", 1, { silent: true });
                 self.$("tbody").append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                 }, 1000);
                 }, 1000);
                 }, 1000);
                 }, 1000);
                 */

                return this;
            }
        });
    }
);
