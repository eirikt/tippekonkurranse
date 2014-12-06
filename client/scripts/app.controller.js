/* global define:false */
define(
    [ 'app' ],
    function (App) {
        'use strict';
        return {
            showCurrentScores: function () {
                console.log('showCurrentScores()');
                App.execute('getTippekonkurranseScores');
            },
            showScores: function (year, round) {
                console.log('showScores(' + year + ', ' + round + ')');
                App.execute('getTippekonkurranseScores', year, round);
                /*
                 var results = new CurrentScoresCollection({
                 year: year,
                 round: round
                 }),
                 headerView = new HeaderView({
                 el: 'header',
                 collection: results
                 }),
                 resultsView = new CurrentScoresView({
                 el: '#content1',
                 collection: results
                 }),
                 roundCarouselView = new RoundCarouselView({
                 el: '#content2',
                 collection: results
                 });

                 results.fetch({ reset: true });

                 $('header').removeClass('hidden');
                 $('#ratingHistory').empty().css({ height: 0 });
                 $('#splashscreen').remove();
                 */
            },
            showRatingHistory: function (year, round) {
                console.log('showRatingHistory(' + year + ', ' + round + ')');
                App.execute('getTippekonkurranseScoresHistory', year, round);
                /*
                 var results = new HistoricScoresCollection({
                 year: year,
                 round: round
                 }),
                 headerView = new HeaderView({
                 el: 'header',
                 collection: results
                 }),
                 ratingHistoryView = new RatingHistoryView({
                 el: '#ratingHistory',
                 collection: results,
                 year: parseInt(year, 10),
                 round: parseInt(round, 10)
                 });

                 results.fetch({ reset: true });

                 $('header').removeClass('hidden');
                 $('#ratingHistory').removeClass('hidden');
                 $('#content1').empty();
                 $('#content2').empty();
                 $('#splashscreen').remove();
                 $('footer').removeClass('hidden');
                 */
            }
        };
    }
);
