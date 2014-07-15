/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    curry = require("curry"),

// Module dependencies, local generic

// Module dependencies, local application-specific
    tippekonkurranse = require("./tippekonkurranse.js"),
    predictions2014 = require("./user-predictions-2014.js").predictions2014,

// Module dependencies, local application-specific, curried/configured
    addTippekonkurranseScores2014 = exports.addTippekonkurranseScores2014 =
        curry(tippekonkurranse.addTippekonkurranseScoresRequestor)(predictions2014),

    addPreviousMatchRoundRatingToEachParticipant2014 = exports.addPreviousMatchRoundRatingToEachParticipant2014 =
        curry(tippekonkurranse.addPreviousMatchRoundRatingToEachParticipantRequestor)(predictions2014);
