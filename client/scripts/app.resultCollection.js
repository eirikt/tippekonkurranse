/* global define: false */
define(["underscore", "backbone", "app.result"],
    function (_, Backbone, ParticipantResult) {
        "use strict";

        return Backbone.Collection.extend({
            url: "/current-scores",
            model: ParticipantResult,
            comparator: ParticipantResult.sortByPoengsum,

            parse: function (response) {
                for (var participant in response) {
                    if (response.hasOwnProperty(participant)) {
                        var participantResult = new this.model(response[participant]);
                        participantResult.set(ParticipantResult.participantResultNamePropertyName, participantResult.printableName(participant), { silent: true });
                        participantResult.set(ParticipantResult.participantResultPoengsumPropertyName, participantResult.sum(), { silent: true });
                        this.add(participantResult, { silent: true });
                    }
                }
                this.trigger("reset");
            }
        });
    }
);
