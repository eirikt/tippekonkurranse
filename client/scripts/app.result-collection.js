/* global define: false */
define(["underscore", "backbone", "app.models.scoreModel", "app.result"],
    function (_, Backbone, ScoreModel, ParticipantResult) {
        "use strict";

        return Backbone.Collection.extend({
            url: "/current-scores",
            model: ParticipantResult,
            comparator: ParticipantResult.sortBySum,

            /** Set current match round rating number and placing for participants */
            _setRatingAndPlacing: function () {
                var rating = 0,       // Equal sum gives the same rating
                    //placing = 0,    // Each table row get a new placing number (disregarding the sum in the preceding table row)
                    lastSum = 0;
                this.each(function (participant) {
                    if (participant.get(ScoreModel.sum) > lastSum) {
                        participant.set(ParticipantResult.participantRatingPropertyName, (rating += 1) + ".", { silent: true });
                        lastSum = participant.get(ScoreModel.sum);
                    }
                    participant.set(ParticipantResult.participantHiddenRatingPropertyName, rating, { silent: true });
                });
            },

            /** Set previous match round rating number and placing for participants (tendency tracking) */
            _setPreviousRatingAndPlacing: function () {
                var previousRating = 0,
                    previousLastSum = 0;
                this.comparator = ParticipantResult.sortByPreviousSum;
                this.sort();
                this.each(function (participant) {
                    if (participant.get(ParticipantResult.participantPreviousSumPropertyName) > previousLastSum) {
                        participant.set(ParticipantResult.participantPreviousRatingPropertyName, (previousRating += 1), { silent: true });
                        previousLastSum = participant.get(ScoreModel.sum);
                    }
                });
                this.comparator = ParticipantResult.sortBySum;
                this.sort();
            },

            parse: function (response) {
                for (var participant in response.scores) {
                    if (response.scores.hasOwnProperty(participant)) {
                        var participantResult = new this.model(response.scores[participant]);
                        participantResult.set(ParticipantResult.participantRatingPropertyName, "", { silent: true });
                        participantResult.set(ParticipantResult.participantNamePropertyName, participantResult.printableName(participant), { silent: true });
                        participantResult.set(ParticipantResult.participantYearPropertyName, response.metadata.year, { silent: true });
                        participantResult.set(ParticipantResult.participantRoundPropertyName, response.metadata.round, { silent: true });

                        this.add(participantResult, { silent: true });
                    }
                }
                this._setRatingAndPlacing();
                this._setPreviousRatingAndPlacing();
                this.trigger("reset");
            }
        });
    }
);
