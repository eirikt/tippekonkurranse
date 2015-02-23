/* jshint -W031 */
require.config({

    // RequireJS HTTP Cache issue:

    // Development solution : Use Chrome and e.g. https://chrome.google.com/webstore/detail/cppjkneekbjaeellbfkmgnhonkkjfpdn
    // RequireJS 'hack' for forcing fetching a new version each request, works poorly with Chrome breakpoints though ...
    //urlArgs: 'bust=' +  (new Date()).getTime(),

    // Production solution  : http://stackoverflow.com/questions/8315088/prevent-requirejs-from-caching-required-scripts
    //    ...not the approved answer, but below using 'baseUrl': https://groups.google.com/forum/#!msg/requirejs/3E9dP_BSQoY/36ut2Gtko7cJ
    // Implemented in this application

    // Development ('grunt [run|deploy:development]' and IDE execution):
    //baseUrl: 'scripts',
    // Standard:
    baseUrl: '1.3.0-alpha.10/scripts',

    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'marionette': '../bower_components/marionette/lib/backbone.marionette.min',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/locale/nb',
        'toastr': '../bower_components/toastr/toastr.min',
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot',
        'jquery.countdown': '../bower_components/jquery.countdown/dist/jquery.countdown.min'
        // TODO: Make the jqplot cursor work ...
        //'jqplot.highlighter': '../bower_components/jqplot-bower/dist/plugins/jqplot.highlighter.min',
        //'jqplot.cursor': '../bower_components/jqplot-bower/dist/plugins/jqplot.cursor.min',
        //'jqplot.dateAxisRenderer': '../bower_components/jqplot-bower/dist/plugins/jqplot.dateAxisRenderer.min'
    },
    config: {
        moment: {
            noGlobal: true
        }
    }
});


// Application configuration
require([ 'jquery', 'toastr', 'jquery.countdown' ],
    function ($, Toastr, $countdown) {
        'use strict';

        // Toastr.js config (=> http://codeseven.github.io/toastr/demo.html)
        Toastr.options = {
            'positionClass': 'toast-top-full-width',
            'timeOut': 6000
        };

        /*
         $(document).ready(function () {
         console.log('DOM ready!');

         $('#animTest').on('click', function () {
         //alert("click!");
         var partipipant2 = $(".participant").get(1);
         //$(partipipant2).addClass('two-to-five');
         $(partipipant2).animate({
         //width: "70%",
         //opacity: 0.4,
         //marginLeft: "0.6in",
         //fontSize: "3em",
         //borderWidth: "10px",
         //"-webkit-order": 5,
         order: 5
         }, "slow");
         //$(partipipant2).css("-webkit-order", 5);
         //$(partipipant2).css("order", 5);
         });
         });
         */
    }
);


// Application start
require([ 'jqplot', 'backbone', 'marionette', 'app', 'app.controller', 'backbone.fetch-local-copy' ],
    function (jqplot, Backbone, Marionette, app, clientSideRequestHandler, BackboneFetchLocalCopy) {
        'use strict';

        app.start();

        new Marionette.AppRouter({
            appRoutes: {
                'scores/current': 'showCurrentScores',
                'scores/:year/:round': 'showScores',
                'ratinghistory/:year/:round': 'showRatingHistory'
            },
            controller: clientSideRequestHandler
        });

        Backbone.history.start({
            pushState: false,
            hashChange: true,
            root: '/'
        });

        BackboneFetchLocalCopy.listenToServerConnectionDropouts([
            '#offlineScoresNotification',
            '#offlineCurrentResultsNotification'
        ]);
    }
);


// Listen to window errors: remedy for Heroku instances sleeping/warm-up
// TODO: Revisit ...
/* jshint -W073 */
/*
 window.onerror = function (message, url, lineNumber) {
 "use strict";
 var initialNumberOfReloads = 1,
 millisecondsBeforeReload = 3000,
 isHerokuServerStartingUp = function () {
 // TODO: A bit safer, please ...
 return true;
 },
 remainingNumberOfReloadsKey = "Tippekonkurranse/remainingnumberofreloads",
 remainingNumberOfReloadsTimestampKey = "Tippekonkurranse/remainingnumberofreloads:timestamp",
 remainingNumberOfReloads,
 remainingNumberOfReloadsTimestamp,
 eligibleForReload = false;

 window.console.warn("Error: message=" + message);
 window.console.warn("Error: url=" + url);
 window.console.warn("Error: lineNumber=" + lineNumber);

 if (isHerokuServerStartingUp()) {
 if (window.localStorage) {
 remainingNumberOfReloads = window.localStorage.getItem(remainingNumberOfReloadsKey);
 remainingNumberOfReloadsTimestamp = window.localStorage.getItem(remainingNumberOfReloadsTimestampKey);

 if (!remainingNumberOfReloads) {
 remainingNumberOfReloads = initialNumberOfReloads;
 eligibleForReload = true;
 } else {
 // Relevant 'remainingNumberOfReloads' fetched from local store?
 if (remainingNumberOfReloadsTimestamp > Date.now() - (2 * millisecondsBeforeReload)) {
 if (window.parseInt(remainingNumberOfReloads, 10) > 0) {
 eligibleForReload = true;
 }
 } else {
 remainingNumberOfReloads = initialNumberOfReloads;
 eligibleForReload = true;
 }
 }

 if (eligibleForReload) {
 window.console.debug(remainingNumberOfReloads + " more reload attempt ...");
 remainingNumberOfReloads -= 1;
 window.localStorage.setItem(remainingNumberOfReloadsKey, remainingNumberOfReloads);
 window.localStorage.setItem(remainingNumberOfReloadsTimestampKey, Date.now());

 window.setTimeout(function () {
 window.location.reload();
 }, millisecondsBeforeReload);

 return true;

 } else {
 window.console.debug("No more reload attempts for now ...");
 }
 }
 }
 return false;
 };
 */
