/* global require:false, exports:false */

// Module dependencies, external
var _ = require("underscore"),
    promise = require("promised-io/promise"),
    all = promise.all,

// Module dependencies, local
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    sharedModels = require("./../../shared/scripts/app.models.js");


var _getTableScore = function (predictedTeamPlacing, actualTeamPlacing) {
        "use strict";
        return Math.abs(predictedTeamPlacing - actualTeamPlacing);
    },

    _getPallScore = function (predictedPlacing, actualPlacing) {
        "use strict";
        var pallScore = 0;
        if (predictedPlacing === 1 && predictedPlacing === actualPlacing) {
            pallScore += -1;
        }
        if (predictedPlacing === 2 && predictedPlacing === actualPlacing) {
            pallScore += -1;
        }
        if (predictedPlacing === 3 && predictedPlacing === actualPlacing) {
            pallScore += -1;
        }
        if (pallScore === 3) {
            pallScore += -1;
        }
        return pallScore;
    },

    _getNedrykkScore = function (predictedPlacing, actualPlacing) {
        "use strict";
        var nedrykkHits = 0;
        if (predictedPlacing === 15 && (predictedPlacing === actualPlacing || actualPlacing === 16)) {
            nedrykkHits += 1;
        }
        if (predictedPlacing === 16 && (predictedPlacing === actualPlacing || actualPlacing === 15)) {
            nedrykkHits += 1;
        }
        return (nedrykkHits > 1) ? -1 : 0;
    },

    _updateScores = function (currentTippeligaTable, currentAdeccoligaTable, currentTippeligaTopscorer, currentRemainingCupContenders) {
        "use strict";

        var currentStanding = {};
        for (var participant in predictions2014) {
            if (predictions2014.hasOwnProperty(participant)) {
                var tabellScore = 0,
                    pallScore = 0,
                    nedrykkScore = 0,
                    opprykkScore = 0,
                    toppscorerScore = 0,
                    cupScore = 0,

                    nedrykkHits = 0,
                    opprykkHits = 0,

                    participantObj = predictions2014[participant];

                if (participantObj) {
                    nedrykkHits = 0;
                    opprykkHits = 0;

                    _.each(participantObj.tabell, function (team, index) {
                        var predictedTeamPlacing = index + 1,
                            actualTeamPlacing = currentTippeligaTable[team].no;

                        // Tabell
                        tabellScore += _getTableScore(predictedTeamPlacing, actualTeamPlacing);

                        // Pall
                        //pallScore += _getPallScore(predictedTeamPlacing, actualTeamPlacing);
                        if (predictedTeamPlacing === 1 && predictedTeamPlacing === actualTeamPlacing) {
                            pallScore += -1;
                        }
                        if (predictedTeamPlacing === 2 && predictedTeamPlacing === actualTeamPlacing) {
                            pallScore += -1;
                        }
                        if (predictedTeamPlacing === 3 && predictedTeamPlacing === actualTeamPlacing) {
                            pallScore += -1;
                        }
                        if (pallScore === 3) {
                            pallScore += -1;
                        }

                        // Nedrykk
                        //nedrykkScore += _getNedrykkScore(predictedTeamPlacing, actualTeamPlacing);
                        if (predictedTeamPlacing === 15 && (predictedTeamPlacing === actualTeamPlacing || actualTeamPlacing === 16)) {
                            nedrykkHits += 1;
                        }
                        if (predictedTeamPlacing === 16 && (predictedTeamPlacing === actualTeamPlacing || actualTeamPlacing === 15)) {
                            nedrykkHits += 1;
                        }
                        //return (nedrykkHits > 1) ? -1 : 0;
                        //nedrykkScore = (nedrykkHits > 1) ? -1 : 0;
                        if (nedrykkHits === 2) {
                            nedrykkScore = -1;
                        }

                        console.log(participant + "." + team + " tabell calculations done ...");
                    });

                    // Toppscorer
                    _.each(participantObj.toppscorer, function (toppscorer, index) {
                        if (index === 0 && _.contains(currentTippeligaTopscorer, toppscorer)) {
                            toppscorerScore = -1;
                        }
                    });

                    // TODO: When Adeccoliga starts
                    // Opprykk

                    // Cup
                    _.each(participantObj.cup, function (team, index) {
                        if (index === 0 && _.contains(currentRemainingCupContenders, team)) {
                            cupScore = -1;
                        }
                    });
                }
                currentStanding[participant] =
                    sharedModels.ScoreModel.properties(tabellScore, pallScore, nedrykkScore, toppscorerScore, opprykkScore, cupScore);
            }
        }
        return currentStanding;
    },


    _calculateCurrentScore = exports.calculateCurrentScore = function (req, resp) {
        "use strict";
        all(norwegianSoccerLeagueService.getCurrentTippeligaTable(),
            norwegianSoccerLeagueService.getCurrentAdeccoligaTable(),
            norwegianSoccerLeagueService.getCurrentTippeligaToppscorer(),
            norwegianSoccerLeagueService.getCurrentRemainingCupContenders()).then(
            function (resultArray) {
                var currentTippeligaTable = resultArray[0],
                    currentAdeccoligaTable = resultArray[1],
                    currentTippeligaTopscorer = resultArray[2],
                    currentRemainingCupContenders = resultArray[3],

                    currentStanding = _updateScores(currentTippeligaTable, currentAdeccoligaTable, currentTippeligaTopscorer, currentRemainingCupContenders);

                resp.send(JSON.stringify(currentStanding));
            }
        );
    };
