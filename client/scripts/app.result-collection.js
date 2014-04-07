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
                        participantResult.set(ParticipantResult.participantRatingNumberPropertyName, "", { silent: true });
                        participantResult.set(ParticipantResult.participantNamePropertyName, participantResult.printableName(participant), { silent: true });
                        participantResult.set(ParticipantResult.participantPoengsumPropertyName, participantResult.sum(), { silent: true });

                        this.add(participantResult, { silent: true });
                    }
                }
                // Set rating number for participants
                var rating = 1,
                    lastSum = 0;
                this.each(function (participant) {
                    if (participant.get(ParticipantResult.participantPoengsumPropertyName) > lastSum) {
                        participant.set(ParticipantResult.participantRatingNumberPropertyName, rating + ".", { silent: true });
                        lastSum = participant.get(ParticipantResult.participantPoengsumPropertyName);
                        rating += 1;
                    }
                });
                this.trigger("reset");
            }
        });
    }
);
