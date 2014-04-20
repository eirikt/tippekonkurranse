/* global define:false, wait:false */
define(["jquery", "underscore", "backbone", "app.participant-score-view"],
    function ($, _, Backbone, ParticipantScoreView) {
        "use strict";

        return Backbone.View.extend({
            template: _.template('' +
                    //'<table class="table table-condenced table-striped table-hover table-bordered">' +
                    '<table class="table table-condenced table-striped table-hover">' +
                    '<thead><tr>' +
                    '<th style="padding-left:2rem;width:3rem;"></th>' +
                    '<th style="width:12rem;"></th>' +
                    '<th style="width:3rem;"></th>' +
                    '<th style="width:3rem;"></th>' +
                    '<th></th>' +
                    '<th style="text-align:center;color:darkgray;width:9rem;">Tabell</th>' +
                    '<th style="text-align:center;color:darkgray;width:9rem;">Pall</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Nedrykk</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Toppsk.</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Opprykk</th>' +
                    '<th style="text-align:center;color:darkgray;width:10rem;">Cup</th>' +
                    '</tr></thead>' +

                    // All participant data here
                    '<tbody></tbody>' +

                    '</table>'
            ),
            initialize: function () {
                this.listenTo(this.collection, "reset", this.render);
            },
            render: function () {
                var addParticipant = function ($el, participantResult, index) {
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
                    // Underscore: Bind a function to an object, meaning that whenever the function is called, the value of this will be the object
                    delayedParticipantFunc = _.bind(delayedAddParticipant, this);

                    // Underscore: Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
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
