/* global define:false */
define([ 'app' ], function (App) {
    'use strict';
    return {
        showCurrentScores: function () {
            //console.log('showCurrentScores()');
            App.execute('getTippekonkurranseScores');
        },
        showScores: function (year, round) {
            //console.log('showScores(' + year + ', ' + round + ')');
            App.execute('getTippekonkurranseScores', year, round);
        },
        showRatingHistory: function (year, round) {
            //console.log('showRatingHistory(' + year + ', ' + round + ')');
            App.execute('getTippekonkurranseScoresHistory', year, round);
        }
    };
});
