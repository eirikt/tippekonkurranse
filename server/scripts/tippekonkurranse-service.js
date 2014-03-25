/* global require: false, exports: false */

// Module dependencies, external
var _ = require("underscore"),
    promise = require("promised-io/promise"),
    all = promise.all,

// Module dependencies, local
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
    sharedModels = require("./../../shared/scripts/app.models.js");


var _getTableScore = function (predictedPlacing, actualPlacing) {
        "use strict";
        return Math.abs(predictedPlacing - actualPlacing);
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

                    participantObj = predictions2014[participant];

                if (participantObj) {

                    // Tabell
                    _.each(participantObj.tabell, function (team, index) {
                        var predictedTeamPlacing = index + 1,
                            actualTeamPlacing = currentTippeligaTable[team].no;

                        tabellScore += _getTableScore(predictedTeamPlacing, actualTeamPlacing);
                        //console.log(participant + "." + team + " done ...");
                    });

                    // TODO: ...
                    // Pall

                    // TODO: ...
                    // Nedrykk

                    // TODO: ...
                    // Opprykk

                    // TODO: ...
                    // Toppscorer

                    // TODO: ...
                    // Cup

                }
                currentStanding[participant] =
                    sharedModels.ScoreModel.properties(tabellScore, pallScore, cupScore, toppscorerScore, opprykkScore, nedrykkScore);
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
