// TODO: Promote this to a 'type'/'class', and move this to 'app.models.js' (like 'TippekonkurranseData')
var _rules2014 = exports.rules = {
    year: 2014,
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
};
