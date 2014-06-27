/* global define:false */

// Boilerplate for CommonJS and AMD support (no RequireJS shimming required)
// => https://blog.codecentric.de/en/2014/02/cross-platform-javascript/
// => http://www.2ality.com/2011/11/module-gap.html
({ define: typeof define === 'function' ? define : function (A, F) {
    'use strict';
    module.exports = F.apply(null, A.map(require));
}}).

    define([], function () {
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
                    uri: '/api/ratinghistory/:year'
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
                        // Default 0 for all properties
                        args = scoreModelPropertyNamesArray.map(function () {
                            return 0;
                        });
                    }

                    scoreModelPropertyNamesArray.forEach(function (propName, index) {
                        model[propName] = args[index];
                    });

                    return model;
                }
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
            scoreModel: _scoreModel
        };
    }
);
