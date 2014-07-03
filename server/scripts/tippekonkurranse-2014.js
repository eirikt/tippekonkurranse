/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
//__ = require("underscore"),
    curry = require("curry"),

// Module dependencies, local generic
//utils = require("./utils.js"),
//RQ = require("./vendor/rq.js").RQ,
//go = utils.rqGo,
//comparators = require("./../../shared/scripts/comparators.js"),

// Module dependencies, local application-specific
//dbSchema = require("./db-schema.js"),
//norwegianSoccerLeagueService = require("./norwegian-soccer-service.js"),
//appModels = require("./../../shared/scripts/app.models.js"),
    tippekonkurranse = require("./tippekonkurranse.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,

// Module dependencies, local application-specific, curried/configured
    addTippekonkurranseScores2014 = exports.addTippekonkurranseScores2014 =
        curry(tippekonkurranse.addTippekonkurranseScoresRequestion)(predictions2014),

    addPreviousMatchRoundRatingToEachParticipant2014 = exports.addPreviousMatchRoundRatingToEachParticipant2014 =
        curry(tippekonkurranse.addPreviousMatchRoundRatingToEachParticipantRequestion)(predictions2014);
