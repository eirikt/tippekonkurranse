/* global define:false */
/* jshint -W106 */

define([
        "jquery", "underscore", "backbone",
        "comparators",
        "app.models", "app.result", "backbone.fetch-local-copy"
    ],
    function ($, _, Backbone, Comparators, App, ParticipantScore, BackboneFetchLocalCopy) {
        "use strict";

        /**
         * Ranking scheme is "standard competition ranking ('1224' ranking)".
         * => Equal sum/rating gives the same rank.
         * @see http://en.wikipedia.org/wiki/Ranking
         */
        var ParticipantScoreCollection = Backbone.Collection.extend({

            defaultBaseUri: App.resource.scores.baseUri,
            defaultResource: App.resource.uri.element.current,

            model: ParticipantScore,

            // Ascending rating comparator
            sortByRatingThenByName: Comparators.ascendingByBackboneProperty([
                App.scoreModel.ratingPropertyName,
                ParticipantScore.namePropertyName
            ]),

            // Ascending previous round rating comparator
            sortByPreviousRatingThenByName: Comparators.ascendingByBackboneProperty([
                App.scoreModel.previousRatingPropertyName,
                ParticipantScore.namePropertyName
            ]),

            initialYear: null,
            initialRound: null,
            year: null,
            round: null,
            currentYear: null,
            currentRound: null,

            initialize: function (models, options) {
                // Default comparator
                this.comparator = this.sortByRatingThenByName;

                if (options && options.initialYear) {
                    this.initialYear = options.initialYear;
                }
                if (options && options.initialRound) {
                    this.initialRound = options.initialRound;
                }
                if (options && options.year) {
                    this.year = options.year;
                }
                if (options && options.round) {
                    this.round = options.round;
                }
                if (options && options.currentYear) {
                    this.currentYear = options.currentYear;
                }
                if (options && options.currentRound) {
                    this.currentRound = options.currentRound;
                }
            },

            /** Set previous match round rank for participants (tendency tracking) */
            _setPreviousRank: function () {
                this.comparator = this.sortByPreviousRatingThenByName;
                this.sort();

                var previousRank = -1,
                    lastPreviousRating = -1;
                this.each(function (participant, index) {
                    var previousRating = participant.get(App.scoreModel.previousRatingPropertyName);
                    if (previousRating) {
                        if (previousRating > lastPreviousRating) {
                            lastPreviousRating = previousRating;
                            previousRank = (index + 1);
                        }
                        participant.set(ParticipantScore.previousRankPropertyName, previousRank, { silent: true });
                    }
                });

                this.comparator = this.sortByRatingThenByName;
                this.sort();
            },

            /** Set current match round rank (presentation) for participants */
            _setRank: function () {
                var rank = -1,
                    lastRating = -1;
                this.each(function (participant, index) {
                    participant.set(ParticipantScore.rankPresentationPropertyName, "", { silent: true });
                    var participantRating = participant.get(App.scoreModel.ratingPropertyName);
                    if (participantRating > lastRating) {
                        lastRating = participantRating;
                        rank = (index + 1);

                        // Just add some trophy icons instead of podium-place 1, 2, and 3
                        // TODO: Move rank attribute logic to a (very small) RatingView
                        switch (rank) {
                            case 1:
                                participant.set(ParticipantScore.rankPresentationPropertyName, "<span class='icon-trophy-gold'></span>", { silent: true });
                                break;
                            case 2:
                                participant.set(ParticipantScore.rankPresentationPropertyName, "<span class='icon-trophy-silver'></span>", { silent: true });
                                break;
                            case 3:
                                participant.set(ParticipantScore.rankPresentationPropertyName, "<span class='icon-trophy-bronze'></span>", { silent: true });
                                break;
                            default:
                                participant.set(ParticipantScore.rankPresentationPropertyName, rank + ".", { silent: true });
                                break;
                        }
                    }
                    participant.set(ParticipantScore.rankPropertyName, rank, { silent: true });
                });
            },

            url: function () {
                if (this.year && this.round) {
                    return [ this.defaultBaseUri, this.year, this.round ].join("/");
                }
                return [ this.defaultBaseUri, this.defaultResource ].join("/");
            },

            parse: function (response) {
                if (response === 404) {
                    //this.trigger('error', 404);
                    return this.models;
                }
                this.year = response.metadata.year;
                this.round = response.metadata.round;
                this.date = response.metadata.date;
                this.currentYear = response.metadata.currentYear;
                this.currentRound = response.metadata.currentRound;

                for (var participant in response.scores) {
                    if (response.scores.hasOwnProperty(participant)) {
                        var participantScore = new this.model(response.scores[ participant ]);
                        participantScore.set(ParticipantScore.userIdPropertyName, participant, { silent: true });
                        participantScore.set(ParticipantScore.namePropertyName, participant.unSnakify().toTitleCase(), { silent: true });
                        participantScore.set(ParticipantScore.yearPropertyName, response.metadata.year, { silent: true });
                        participantScore.set(ParticipantScore.roundPropertyName, response.metadata.round, { silent: true });

                        this.add(participantScore, { silent: true });
                    }
                }
                if (response.metadata.round > 1) {
                    this._setPreviousRank();
                }
                this._setRank();

                return this.models;
            }
        });

        _.extend(ParticipantScoreCollection.prototype, App.nameable);
        _.extend(ParticipantScoreCollection.prototype, BackboneFetchLocalCopy);

        return ParticipantScoreCollection;
    }
);
