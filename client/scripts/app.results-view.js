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
                    '<th style="text-align:center;color:darkgray;width:9rem;">Tabell</th>' +
                    '<th style="text-align:center;color:darkgray;width:9rem;">Pall</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Cup</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Toppskårer</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Opprykk</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Nedrykk</th>' +
                    '</tr></thead>' +
                    '<tbody>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Trond</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Einar</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Eirik</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Geir</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Hans Bernhard</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Jan Tore</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Oddgeir</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Oddvar</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Ole Erik</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Rikard</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Sveinar</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr><td style="padding-left:2rem;"></td>' +
                    '<td><strong>Tore</strong></td>' +
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
                    '<th style="padding-left:2rem;width:4rem;""></th>' +
                    '<th style="width:20rem;""></th>' +
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
                this.$el.append(this.pendingTemplate());
                return this;
            },
            render: function () {
                var self = this,
                    wait = function (ms) {
                        var deferred = $.Deferred();
                        setTimeout(deferred.resolve, ms);
                        return deferred.promise();
                    },
                    addParticipant = function ($el, participantResult) {
                        participantResult.set("nr", 1, { silent: true });
                        $el.append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                    },
                    delayedAddParticipant = function (timeOutInMillis, $el, participantResult) {
                        var dfd = $.Deferred();
                        wait(timeOutInMillis).then(function () {
                            addParticipant($el, participantResult);
                            dfd.resolve();
                        });
                        return dfd.promise();
                    },
                    $tbody = null,
                    delayInMillis = 100,
                    delayedAddingOfParticipantInTable = [],
                    i = 0;

                this.$el.append(this.template());
                $tbody = this.$("tbody");

                for (; i < self.collection.length; i += 1) {
                    delayedAddingOfParticipantInTable.push(_.bind(delayedAddParticipant, this, delayInMillis, $tbody, self.collection.at(i)));
                }

                // TODO: make this dynamic as well
                delayedAddingOfParticipantInTable[0]()
                    .then(delayedAddingOfParticipantInTable[1])
                    .then(delayedAddingOfParticipantInTable[2])
                    .then(delayedAddingOfParticipantInTable[3])
                    .then(delayedAddingOfParticipantInTable[4])
                    .then(delayedAddingOfParticipantInTable[5])
                    .then(delayedAddingOfParticipantInTable[6])
                    .then(delayedAddingOfParticipantInTable[7])
                    .then(delayedAddingOfParticipantInTable[8])
                    .then(delayedAddingOfParticipantInTable[9])
                    .then(delayedAddingOfParticipantInTable[10])
                    .then(delayedAddingOfParticipantInTable[11])
                    .then(delayedAddingOfParticipantInTable[12]);

                return this;
            }
        });
    }
);
