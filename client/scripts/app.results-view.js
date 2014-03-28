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

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Svein Tore</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Jan Tore</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Oddgeir</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Eirik</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Rikard</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Einar</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Ole Erik</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Steinar</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Oddvar</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;">1</td>' +
                    '<td><strong>Hans Bernhard</strong></td>' +
                    '<td><i>data mottatt</i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '<td style="color:darkgray;text-align:center;"><i class="fa fa-check" style="color:green;"></i></td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;"></td>' +
                    '<td><strong>Geir</strong></td>' +
                    '<td><strong>n/a</strong></td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '<td style="color:darkgray;">data mangler</td>' +
                    '</tr>' +

                    '<tr>' +
                    '<td style="padding-left:2rem;"></td>' +
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
                    '<th style="padding-left:2rem;width:4rem;"></th>' +
                    '<th style="width:20rem;"></th>' +
                    '<th style="padding-right:3rem;"><strong></strong></th>' +
                    '<th style="text-align:center;color:darkgray;width:9rem;">Tabell</th>' +
                    '<th style="text-align:center;color:darkgray;width:9rem;">Pall</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Nedrykk</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Toppskårer</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Opprykk</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Cup</th>' +
                    '</tr></thead>' +

                    // All participant data here
                    '<tbody></tbody>' +

                    '</table>'
            ),
            initialize: function () {
                //this.pendingRender();
                this.listenTo(this.collection, "reset", this.render);
            },
            pendingRender: function () {
                this.$el.append(this.pendingTemplate());

                this.$el.find("tr.the-first td").wrapInner("<div class='hidden'></div>");
                this.$el.find("div.hidden").removeClass("hidden").addClass("my-transform");

                return this;
            },
            render: function () {
                var addParticipant = function ($el, participantResult, index) {
                        participantResult.set("nr", index + 1, { silent: true });
                        $el.append(new ParticipantScoreView({ model: participantResult.toJSON() }).render().el);
                    },
                    delayedAddParticipant = function (timeOutInMillis, $el, participantResult, index) {
                        var dfd = $.Deferred();
                        addParticipant($el, participantResult, index);
                        wait(timeOutInMillis).then(function () {
                            dfd.resolve();
                        });
                        return dfd.promise();
                    };

                this.$el.append(this.template());

                // Render all participant scores sequentially, one by one
                var delayedAddingOfParticipantInTableFuncs = [],
                    delayInMillis = 100,
                    $tbody = this.$("tbody"),
                    i,
                    sortedParticipant,
                    delayedParticipantFunc,
                    delayedAddingOfParticipantInTableFunc;

                for (i = 0; i < this.collection.length; i += 1) {
                    // Bind a function to an object, meaning that whenever the function is called, the value of this will be the object
                    delayedParticipantFunc = _.bind(delayedAddParticipant, this);

                    // Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
                    // You may pass _ in your list of arguments to specify an argument that should not be pre-filled, but left open to supply at call-time.
                    sortedParticipant = this.collection.at(i);
                    delayedParticipantFunc = _.partial(delayedParticipantFunc, delayInMillis, $tbody, sortedParticipant, i);

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
