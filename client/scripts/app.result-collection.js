/* global define:false */
/* jshint -W106 */

define(["underscore", "backbone", "comparators", "app.models", "app.result", "backbone.fetch-local-copy"],
    function (_, Backbone, Comparators, App, ParticipantScore, BackboneFetchLocalCopy) {
        "use strict";

        var ParticipantScoreCollection = Backbone.Collection.extend({

            defaultBaseUri: App.resource.scores.baseUri,
            defaultResource: App.resource.uri.element.current,

            model: ParticipantScore,

            // Ascending sum comparator
            sortBySum: _.partial(Comparators.ascendingBackboneComparator,
                [App.scoreModel.sumPropertyName, ParticipantScore.namePropertyName]),

            // Ascending previous sum comparator
            sortByPreviousSum: _.partial(Comparators.ascendingBackboneComparator,
                [ParticipantScore.previousSumPropertyName, ParticipantScore.namePropertyName]),

            year: null,
            round: null,

            initialize: function (options) {
                // Default comparator
                this.comparator = this.sortBySum;

                if (options && options.year) {
                    this.year = options.year;
                }
                if (options && options.round) {
                    this.round = options.round;
                }
            },

            /** Set previous match round rating number for participants (tendency tracking) */
            _setPreviousRating: function () {
                this.comparator = this.sortByPreviousSum;
                this.sort();

                var previousRating = 1,
                    previousLastSum = 0;
                this.each(function (participant, index) {
                    var previousSum = participant.get(ParticipantScore.previousSumPropertyName);
                    if (previousSum > previousLastSum) {
                        previousLastSum = previousSum;
                        previousRating = (index + 1);
                    }
                    participant.set(ParticipantScore.previousRatingNumberPropertyName, previousRating, { silent: true });
                });

                this.comparator = this.sortBySum;
                this.sort();
            },

            /** Set current match round rating for participants */
            _setRating: function () {
                var rating = 1, // Equal sum gives the same rating
                    lastSum = 0;
                this.each(function (participant, index) {
                    participant.set(ParticipantScore.ratingPropertyName, "", { silent: true });

                    var participantSum = participant.get(App.scoreModel.sumPropertyName);
                    if (participantSum > lastSum) {
                        lastSum = participantSum;
                        rating = (index + 1);

                        // Just add some trophy icons instead of podium-place 1, 2, and 3
                        // TODO: Move rating property logic to a (very small) RatingView
                        switch (rating) {
                            case 1:
                                participant.set(ParticipantScore.ratingPropertyName, "<span class='icon-trophy-gold'></span>", { silent: true });
                                break;
                            case 2:
                                participant.set(ParticipantScore.ratingPropertyName, "<span class='icon-trophy-silver'></span>", { silent: true });
                                break;
                            case 3:
                                participant.set(ParticipantScore.ratingPropertyName, "<span class='icon-trophy-bronze'></span>", { silent: true });
                                break;
                            default:
                                participant.set(ParticipantScore.ratingPropertyName, rating + ".", { silent: true });
                                break;
                        }
                    }
                    participant.set(ParticipantScore.ratingNumberPropertyName, rating, { silent: true });
                });
            },

            url: function () {
                if (this.year && this.round) {
                    return [this.defaultBaseUri, this.year, this.round].join("/");
                }
                return [this.defaultBaseUri, this.defaultResource].join("/");
            },

            parse: function (response) {
                for (var participant in response.scores) {
                    if (response.scores.hasOwnProperty(participant)) {
                        var participantScore = new this.model(response.scores[participant]);
                        participantScore.set(ParticipantScore.userIdPropertyName, participant, { silent: true });
                        participantScore.set(ParticipantScore.namePropertyName, this.model.printableName(participant), { silent: true });
                        participantScore.set(ParticipantScore.yearPropertyName, response.metadata.year, { silent: true });
                        participantScore.set(ParticipantScore.roundPropertyName, response.metadata.round, { silent: true });

                        this.add(participantScore, { silent: true });
                    }
                }
                if (response.metadata.round > 1) {
                    this._setPreviousRating();
                }
                this._setRating();

                return this.models;
            }
        });

        _.extend(ParticipantScoreCollection.prototype, App.nameable);
        _.extend(ParticipantScoreCollection.prototype, BackboneFetchLocalCopy);

        return ParticipantScoreCollection;
    }
);
