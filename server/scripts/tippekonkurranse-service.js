/* global require: false, console: false, __dirname: false */

// Module dependencies, external
var _ = require("underscore"),
    promise = require("promised-io/promise"),
    all = promise.all,

// Module dependencies, local
    predictions2014 = require("./user-predictions-2014.js").predictions2014,
    norwegianSoccerLeagueService = require("./norwegian-soccer-service.js");


var _getTableScore = function (predictedPlacing, actualPlacing) {
        "use strict";
        return Math.abs(predictedPlacing - actualPlacing);
    },


    _updateTableScores = function (currentTippeligaTable, currentAdeccoligaTable) {
        "use strict";
        var currentStanding = {};
        for (var participant in predictions2014) {
            if (predictions2014.hasOwnProperty(participant)) {
                var tabellScore = 0,
                    participantObj = predictions2014[participant];
                if (participantObj) {
                    _.each(participantObj.tabell, function (team, index) {
                        var predictedTeamPlacing = index + 1,
                            actualTeamPlacing = currentTippeligaTable[team].no;

                        tabellScore += _getTableScore(predictedTeamPlacing, actualTeamPlacing);
                    });
                }
            }
            currentStanding[participant] = { tabell: tabellScore };
        }
        return currentStanding
    },


    _calculateCurrentScore = exports.calculateCurrentScore = function (req, resp) {
        "use strict";
        all(norwegianSoccerLeagueService.getCurrentTippeligaTable(),
            norwegianSoccerLeagueService.getCurrentAdeccoligaTable()).then(
            function (resultArray) {
                var currentTippeligaTable = resultArray[0],
                    currentAdeccoligaTable = resultArray[1],
                    currentStanding = _updateTableScores(currentTippeligaTable, currentAdeccoligaTable);

                console.log(currentTippeligaTable);
                console.log(currentAdeccoligaTable);
                resp.send(JSON.stringify(currentStanding));
            }
        )
    };
