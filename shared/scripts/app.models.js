/* global define:false */
({ define: typeof define === 'function' ? define : function (A, F) {
    'use strict';
    module.exports = F.apply(null, A.map(require));
}}).

    define([], function () {
        'use strict';

        var _appName = 'Tippekonkurranse',

            _resource = {
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
                }
            },

            _scoreModel = {
                tabellPropertyName: 'tabell',
                pallPropertyName: 'pall',
                nedrykkPropertyName: 'nedrykk',
                toppscorerPropertyName: 'toppscorer',
                opprykkPropertyName: 'opprykk',
                cupPropertyName: 'cup',
                sumPropertyName: 'sum',

                // Creates and populates the ScoreModel with the given properties
                createObjectWith: function () {
                    var scoreModelPropertyNamesArray = [
                            _scoreModel.tabellPropertyName,
                            _scoreModel.pallPropertyName,
                            _scoreModel.nedrykkPropertyName,
                            _scoreModel.toppscorerPropertyName,
                            _scoreModel.opprykkPropertyName,
                            _scoreModel.cupPropertyName,
                            _scoreModel.sumPropertyName
                        ],
                        args,
                        model = {};

                    if (arguments.length > 0) {
                        // _.toArray() this is ...
                        args = Array.prototype.slice.call(arguments);
                    } else {
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
            resource: _resource,
            scoreModel: _scoreModel
        };
    }
);
