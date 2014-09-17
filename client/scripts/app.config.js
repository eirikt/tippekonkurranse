/* global window:false */
require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/locale/nb',
        'toastr': '../bower_components/toastr/toastr.min',
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot.min'//,
        //'jqplot.highlighter': '../bower_components/jqplot-bower/dist/plugins/jqplot.highlighter.min',
        //'jqplot.cursor': '../bower_components/jqplot-bower/dist/plugins/jqplot.cursor.min',
        //'jqplot.dateAxisRenderer': '../bower_components/jqplot-bower/dist/plugins/jqplot.dateAxisRenderer.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jqplot': {
            deps: ['jquery'],
            exports: 'jqplot'
        }//,
        //'jqplot.highlighter': {
        //    deps: ['jquery', 'jqplot'],
        //    exports: 'jqplot.highlighter'
        //},
        //'jqplot.cursor': {
        //    deps: ['jquery', 'jqplot'],
        //    exports: 'jqplot.cursor'
        //},
        //'jqplot.dateAxisRenderer': {
        //    deps: ['jquery', 'jqplot'],
        //    exports: 'jqplot.dateAxisRenderer'
        //}
    }
});

// Load and execute these
require(['app', 'jqplot']);
//require(['app', 'jqplot', 'jqplot.highlighter', 'jqplot.cursor', 'jqplot.dateAxisRenderer']);

// Listen to window errors: remedy for Heroku instances sleeping/warm-up
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
