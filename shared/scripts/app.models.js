/* global define:false */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({
    define: typeof define === 'function' ? define : function (A, F) {
        'use strict';
        module.exports = F.apply(null, A.map(require));
    }
}).

    define([ 'underscore', './utils' ], function (__, utils) {
        'use strict';

        var _appName = 'Tippekonkurranse',

            _resources = {
                uri: {
                    element: {
                        current: 'current'
                    }
                },
                predictions: {
                    baseUri: '/api/predictions',
                    uri: '/api/predictions/:year/:userId'
                },
                results: {
                    baseUri: '/api/results',
                    uri: '/api/results/:year/:round'
                },
                scores: {
                    baseUri: '/api/scores',
                    uri: '/api/scores/:year/:round'
                },
                ratingHistory: {
                    baseUri: '/api/ratinghistory',
                    uri: '/api/ratinghistory/:year/:round'
                }
            },

        // TODO: Are we missing the 'tippeligaStandingsModel'/'tippeligaRankingsModel'?

        // TODO: Consider renaming it to 'ratingModel'/'scoresAndRatingModel'
        // TODO: Promote this to a 'type'/'class', like 'TippekonkurranseData'
            _scoreModel = {
                tabellPropertyName: 'tabell',
                pallPropertyName: 'pall',
                nedrykkPropertyName: 'nedrykk',
                toppscorerPropertyName: 'toppscorer',
                opprykkPropertyName: 'opprykk',
                cupPropertyName: 'cup',
                ratingPropertyName: 'rating',
                previousRatingPropertyName: 'previousRating',

                // Creates and populates the ScoreModel with the given properties
                createObjectWith: function () {
                    var scoreModelPropertyNamesArray = [
                            _scoreModel.tabellPropertyName,
                            _scoreModel.pallPropertyName,
                            _scoreModel.nedrykkPropertyName,
                            _scoreModel.toppscorerPropertyName,
                            _scoreModel.opprykkPropertyName,
                            _scoreModel.cupPropertyName,
                            _scoreModel.ratingPropertyName,
                            _scoreModel.previousRatingPropertyName
                        ],
                        args,
                        model = {};

                    if (arguments.length > 0) {
                        // _.toArray() this is ...
                        args = Array.prototype.slice.call(arguments);
                    } else {
                        // Default is 0 for all properties
                        args = scoreModelPropertyNamesArray.map(function () {
                            return 0;
                        });
                    }

                    scoreModelPropertyNamesArray.forEach(function (propName, index) {
                        model[ propName ] = args[ index ];
                    });

                    return model;
                }
            },


            TeamPlacement = function TeamPlacement(teamName, placement, numberOfMatchesPlayed) {
                if (!(this instanceof TeamPlacement)) {
                    return new TeamPlacement(teamName, placement, numberOfMatchesPlayed);
                }
                Object.defineProperty(this, 'name', utils.immutablePropertyWithDefaultValue(teamName));
                Object.defineProperty(this, 'no', utils.immutablePropertyWithDefaultValue(placement));
                Object.defineProperty(this, 'matches', utils.immutablePropertyWithDefaultValue(numberOfMatchesPlayed));

                Object.seal(this);
            },


        /* jshint -W071 */
            TippekonkurranseData = function TippekonkurranseData(updatedPropertyArray, options) {
                if (!(this instanceof TippekonkurranseData)) {
                    return new TippekonkurranseData(updatedPropertyArray, options);
                }
                var _isLiveData = 0,                // Live or historic Tippeliga data

                    _tippeligaTable = 1,            // The Tippeliga table, on the format defined by TeamPlacement function
                    _tippeligaTopScorer = 2,        // The Tippeliga top scorer, array of strings
                    _adeccoligaTable = 3,           // The Adeccoliga table, on the format defined by TeamPlacement function
                    _remainingCupContenders = 4,    // The remaining cup contenders, array of strings

                // If _isLiveData === true, then requested and current are the same
                    _round = 5,                     // The requested round (may or may not be the latest round)
                    _date = 6,                      // The date of the requested round
                    _currentRound = 7,              // The latest round (may or may not be the requested round)
                    _currentDate = 8,               // The date of the latest round

                    _matchesCountGrouping = 9,      // TODO: Document ...
                    _scores = 10,                   // "View model" object with properties 'scores' and 'metadata' (properties being complex objects)

                    useDefaultValues = !(updatedPropertyArray && __.isArray(updatedPropertyArray) && updatedPropertyArray.length > 0);

                // TODO: Argument cloning?

                // See: https://gist.github.com/nverinaud/4054348
                if (useDefaultValues) {
                    Object.defineProperty(this, 'isLive', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'tippeligaTable', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'tippeligaTopScorer', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'adeccoligaTable', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'remainingCupContenders', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'round', utils.mutablePropertyWithDefaultValue(0));
                    Object.defineProperty(this, 'date', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'currentRound', utils.mutablePropertyWithDefaultValue(0));
                    Object.defineProperty(this, 'currentDate', utils.mutablePropertyWithDefaultValue(new Date()));
                    Object.defineProperty(this, 'matchesCountGrouping', utils.mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'scores', utils.mutablePropertyWithDefaultValue(null));

                } else {
                    Object.defineProperty(this, 'isLive', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _isLiveData ]));
                    Object.defineProperty(this, 'tippeligaTable', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _tippeligaTable ]));
                    Object.defineProperty(this, 'tippeligaTopScorer', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _tippeligaTopScorer ]));
                    Object.defineProperty(this, 'adeccoligaTable', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _adeccoligaTable ]));
                    Object.defineProperty(this, 'remainingCupContenders', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _remainingCupContenders ]));
                    Object.defineProperty(this, 'round', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _round ]));
                    Object.defineProperty(this, 'date', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _date ]));
                    Object.defineProperty(this, 'currentRound', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _currentRound ]));
                    Object.defineProperty(this, 'currentDate', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _currentDate ]));
                    Object.defineProperty(this, 'matchesCountGrouping', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _matchesCountGrouping ]));
                    Object.defineProperty(this, 'scores', utils.mutablePropertyWithDefaultValue(updatedPropertyArray[ _scores ]));
                }

                TippekonkurranseData.prototype.indexOfRound = _round;

                TippekonkurranseData.prototype.indexOfScores = _scores;

                TippekonkurranseData.prototype.getYear = function () {
                    if (this.date) {
                        return this.date.getFullYear();
                    }
                    throw new Error("Property 'date' is missing for " + this.toArray());
                };

                TippekonkurranseData.prototype.toArray = function () {
                    return [
                        this.isLive,
                        this.tippeligaTable,
                        this.tippeligaTopScorer,
                        this.adeccoligaTable,
                        this.remainingCupContenders,
                        this.round,
                        this.date,
                        this.currentRound,
                        this.currentDate,
                        this.matchesCountGrouping,
                        this.scores
                    ];
                };

                Object.seal(this);
            };


        // This is the code you would normally have inside define() or add to module.exports
        return {
            nameable: {
                name: function () {
                    return _appName;
                }
            },
            name: _appName,
            resource: _resources,
            resources: _resources,
            scoreModel: _scoreModel,

            TeamPlacement: TeamPlacement,
            TippekonkurranseData: TippekonkurranseData
        };
    }
);
