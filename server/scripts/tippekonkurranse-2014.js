/* global root:false, require:false, exports:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external

// Module dependencies, local generic
    curry = require("./../../shared/scripts/fun").curry,

// Module dependencies, local application-specific
    tippekonkurranse = require("./tippekonkurranse"),
    predictions2014 = require("./tippekonkurranse-2014-user-predictions").predictions2014,

// TODO: Isolate this as 'tippekonkurranse-2014-rules.js'
// TODO: Promote this to a 'type'/'class', and move this to 'app.models.js' (like 'TippekonkurranseData')
    scoresStrategy2014 = {
        // 'exact' is permutation-like, 'present' is combination-like
        tabellScoresStrategy: {
            //target: 'tippeligatabell',
            //strategy: 'displacement',
            //number: 16,
            polarity: '+',
            weight: 1
        },
        pall1ScoreStrategy: {
            //target: 'tippeligatabell',
            //strategy: 'match',
            //number: 1,
            polarity: '-',
            weight: 1
        },
        pall2ScoreStrategy: {
            //target: 'tippeligatabell',
            //strategy: 'match',
            //number: 2,
            polarity: '-',
            weight: 1
        },
        pall3ScoreStrategy: {
            //target: 'tippeligatabell',
            //strategy: 'match',
            //number: 3,
            polarity: '-',
            weight: 1
        },
        pallBonusScoreStrategy: {
            //target: 'tippeligatabell',
            //strategy: 'match',
            //number: [ 1, 2, 3 ],
            polarity: '-',
            weight: 1
        },
        nedrykkScoreStrategy: {
            //target: 'tippeligatabell',
            //strategy: 'present',
            //number: [ 15, 16 ],
            polarity: '-',
            weight: 1
        },
        toppscorerScoreStrategy: {
            //target: 'toppscorer',
            //strategy: 'present',
            //number: 1,
            polarity: '-',
            weight: 1
        },
        opprykkScoreStrategy: {
            //target: 'adeccoligatabell',
            //strategy: 'present',
            //number: [ 1, 2 ],
            polarity: '-',
            weight: 1
        },
        cupScoreStrategy: {
            //target: 'cup',
            //strategy: 'present',
            //number: 1,
            polarity: '-',
            weight: 1
        }//,
        //ratingStrategy: {
        //    strategy: 'sum'
        //}
    },

// Module dependencies, local application-specific, curried/configured
    addTippekonkurranseScores2014 = exports.addTippekonkurranseScores2014 =
        curry(tippekonkurranse.addTippekonkurranseScoresRequestor, predictions2014, scoresStrategy2014),

    addPreviousMatchRoundRatingToEachParticipant2014 = exports.addPreviousMatchRoundRatingToEachParticipant2014 =
        curry(tippekonkurranse.addPreviousMatchRoundRatingToEachParticipantRequestor, predictions2014, scoresStrategy2014);
