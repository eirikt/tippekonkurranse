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

    define(['underscore'], function (_) {
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
                        model[propName] = args[index];
                    });

                    return model;
                }
            },


            _mutablePropertyWithDefaultValue = function (defaultValue) {
                return {
                    value: defaultValue,
                    writable: true,
                    enumerable: true,
                    configurable: false
                };
            },

            _immutablePropertyWithDefaultValue = function (defaultValue) {
                return {
                    value: defaultValue,
                    writable: false,
                    enumerable: true,
                    configurable: false
                };
            },


            TeamPlacement = function TeamPlacement(teamName, placement, numberOfMatchesPlayed) {
                if (!(this instanceof TeamPlacement)) {
                    return new TeamPlacement(teamName, placement, numberOfMatchesPlayed);
                }
                Object.defineProperty(this, 'name', _immutablePropertyWithDefaultValue(teamName));
                Object.defineProperty(this, 'no', _immutablePropertyWithDefaultValue(placement));
                Object.defineProperty(this, 'matches', _immutablePropertyWithDefaultValue(numberOfMatchesPlayed));
            },


            /* jshint -W071 */
            TippekonkurranseData = function TippekonkurranseData(updatedPropertyArray, options) {
                if (!(this instanceof TippekonkurranseData)) {
                    return new TippekonkurranseData(updatedPropertyArray, options);
                }
                var _isLiveData = 0,                       // Live or historic Tippeliga data

                    _tippeligaTable = 1,      // TODO: Document ...
                    _tippeligaTopScorer = 2,                               // TODO: Document ...
                    _adeccoligaTable = 3,    // TODO: Document ...
                    _remainingCupContenders = 4,                            // TODO: Document ...

                //_currentYear = 5,                                       // This year (not the requested year)
                //_year = 6,                                              // TODO: Document ...
                    _round = 5,                        // TODO: Document ...
                    _date = 6,                                              // TODO: Document ...
                    _currentRound = 7,                                      // The latest round (not the requested round)
                    _currentDate = 8,                                              // TODO: Document ...

                    _matchesCountGrouping = 9,                             // TODO: Document ...
                    _scores = 10,                     // Object with properties 'scores' and 'metadata'

                    useDefaultValues = !(updatedPropertyArray && _.isArray(updatedPropertyArray) && updatedPropertyArray.length > 0);

                // TODO: Argument cloning?

                // See: https://gist.github.com/nverinaud/4054348
                if (useDefaultValues) {
                    Object.defineProperty(this, 'isLive', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'tippeligaTable', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'tippeligaTopScorer', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'adeccoligaTable', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'remainingCupContenders', _mutablePropertyWithDefaultValue(null));
                    //Object.defineProperty(this, 'currentYear', _mutablePropertyWithDefaultValue(new Date().getFullYear()));
                    //Object.defineProperty(this, 'year', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'round', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'date', _mutablePropertyWithDefaultValue(new Date()));
                    Object.defineProperty(this, 'currentRound', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'currentDate', _mutablePropertyWithDefaultValue(new Date()));
                    Object.defineProperty(this, 'matchesCountGrouping', _mutablePropertyWithDefaultValue(null));
                    Object.defineProperty(this, 'scores', _mutablePropertyWithDefaultValue(null));

                } else {
                    Object.defineProperty(this, 'isLive', _mutablePropertyWithDefaultValue(updatedPropertyArray[_isLiveData]));
                    Object.defineProperty(this, 'tippeligaTable', _mutablePropertyWithDefaultValue(updatedPropertyArray[_tippeligaTable]));
                    Object.defineProperty(this, 'tippeligaTopScorer', _mutablePropertyWithDefaultValue(updatedPropertyArray[_tippeligaTopScorer]));
                    Object.defineProperty(this, 'adeccoligaTable', _mutablePropertyWithDefaultValue(updatedPropertyArray[_adeccoligaTable]));
                    Object.defineProperty(this, 'remainingCupContenders', _mutablePropertyWithDefaultValue(updatedPropertyArray[_remainingCupContenders]));
                    //Object.defineProperty(this, 'currentYear', _mutablePropertyWithDefaultValue(updatedPropertyArray[_currentYear]));
                    //Object.defineProperty(this, 'year', _mutablePropertyWithDefaultValue(updatedPropertyArray[_year]));
                    Object.defineProperty(this, 'round', _mutablePropertyWithDefaultValue(updatedPropertyArray[_round]));
                    Object.defineProperty(this, 'date', _mutablePropertyWithDefaultValue(updatedPropertyArray[_date]));
                    Object.defineProperty(this, 'currentRound', _mutablePropertyWithDefaultValue(updatedPropertyArray[_currentRound]));
                    Object.defineProperty(this, 'currentDate', _mutablePropertyWithDefaultValue(updatedPropertyArray[_currentDate]));
                    Object.defineProperty(this, 'matchesCountGrouping', _mutablePropertyWithDefaultValue(updatedPropertyArray[_matchesCountGrouping]));
                    Object.defineProperty(this, 'scores', _mutablePropertyWithDefaultValue(updatedPropertyArray[_scores]));
                }

                TippekonkurranseData.prototype.indexOfRound = _round;
                TippekonkurranseData.prototype.indexOfScores = _scores;

                TippekonkurranseData.prototype.getYear = function () {
                    return this.date.getFullYear();
                };

                TippekonkurranseData.prototype.toArray = function () {
                    return [
                        this.isLive,
                        this.tippeligaTable,
                        this.tippeligaTopScorer,
                        this.adeccoligaTable,
                        this.remainingCupContenders,
                        //this.currentYear,
                        //this.year,
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
