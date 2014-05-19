/* global define: false */
define(["underscore", "backbone", "app.models.scoreModel", "app.result", "backbone.offline"],
    function (_, Backbone, ScoreModel, ParticipantResult, BackboneOffline) {
        "use strict";

        return Backbone.Collection.extend({
            defaultBaseUri: "/api/scores",
            defaultResource: "current",

            model: ParticipantResult,
            comparator: ParticipantResult.sortBySum,
            // TODO
            //model: ParticipantScore,
            //comparator: ParticipantScore.sortBySum,

            year: null,
            round: null,

            initialize: function (options) {
                if (options && options.year) {
                    this.year = options.year;
                }
                if (options && options.round) {
                    this.round = options.round;
                }
            },

            /** Set current match round rating number and placing for participants */
            _setRatingAndPlacing: function () {
                var rating = 0, // Equal sum gives the same rating
                    lastSum = 0;
                this.each(function (participant) {
                        if (participant.get(ScoreModel.sum) > lastSum) {
                            rating += 1;
                        }
                        // Just add some trophy icons instead of podium-place 1, 2, and 3
                        // TODO: Move rating property logic to some (very small) RatingView
                        switch (rating) {
                            case 1:
                                participant.set(ParticipantResult.participantRatingPropertyName, "<span class='icon-trophy-gold'></span>", { silent: true });
                                break;
                            case 2:
                                participant.set(ParticipantResult.participantRatingPropertyName, "<span class='icon-trophy-silver'></span>", { silent: true });
                                break;
                            case 3:
                                participant.set(ParticipantResult.participantRatingPropertyName, "<span class='icon-trophy-bronze'></span>", { silent: true });
                                break;
                            default:
                                if (participant.get(ScoreModel.sum) > lastSum) {
                                    participant.set(ParticipantResult.participantRatingPropertyName, rating + ".", { silent: true });
                                }
                                break;
                        }
                        lastSum = participant.get(ScoreModel.sum);
                        participant.set(ParticipantResult.participantHiddenRatingPropertyName, rating, { silent: true });
                    }
                );
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
                        previousLastSum = participant.get(ParticipantResult.participantPreviousSumPropertyName);
                    } else {
                        participant.set(ParticipantResult.participantPreviousRatingPropertyName, previousRating, { silent: true });
                    }
                });
                this.comparator = ParticipantResult.sortBySum;
                this.sort();
            },

            url: function () {
                if (this.year && this.round) {
                    return [this.defaultBaseUri, this.year, this.round].join("/");
                }
                return [this.defaultBaseUri, this.defaultResource].join("/");
            },

            fetch: function () {
                return BackboneOffline.localStorageFetch.call(this, { appName: "Tippekonkurranse" });
            },

            parse: function (response) {
                for (var participant in response.scores) {
                    if (response.scores.hasOwnProperty(participant)) {
                        var participantScore = new this.model(response.scores[participant]);
                        participantScore.set(ParticipantResult.participantRatingPropertyName, "", { silent: true });
                        participantScore.set("userId", participant, { silent: true });
                        participantScore.set(ParticipantResult.participantNamePropertyName, this.model.printableName(participant), { silent: true });
                        participantScore.set(ParticipantResult.participantYearPropertyName, response.metadata.year, { silent: true });
                        participantScore.set(ParticipantResult.participantRoundPropertyName, response.metadata.round, { silent: true });

                        this.add(participantScore, { silent: true });
                    }
                }
                this._setRatingAndPlacing();
                this._setPreviousRatingAndPlacing();
            }
        });
    }
);
