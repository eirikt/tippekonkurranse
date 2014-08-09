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
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot.min',
        'jqplot.highlighter': '../bower_components/jqplot-bower/dist/plugins/jqplot.highlighter.min',
        'jqplot.cursor': '../bower_components/jqplot-bower/dist/plugins/jqplot.cursor.min',
        'jqplot.dateAxisRenderer': '../bower_components/jqplot-bower/dist/plugins/jqplot.dateAxisRenderer.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jqplot': {
            deps: ['jquery'],
            exports: 'jqplot'
        },
        'jqplot.highlighter': {
            deps: ['jquery', 'jqplot'],
            exports: 'jqplot.highlighter'
        },
        'jqplot.cursor': {
            deps: ['jquery', 'jqplot'],
            exports: 'jqplot.cursor'
        },
        'jqplot.dateAxisRenderer': {
            deps: ['jquery', 'jqplot'],
            exports: 'jqplot.dateAxisRenderer'
        }
    }
});

// Load and execute these
//require(['app']);
require(['app', 'jqplot']);
//require(['app', 'jqplot', 'jqplot.highlighter', 'jqplot.cursor', 'jqplot.dateAxisRenderer']);

// Listen to window errors: remedy for Heroku instances sleeping/warm-up
/* Heroku dyno timeout:
 Document was loaded from Application Cache with manifest http://tippekonkurranse.herokuapp.com/manifest.appcache tippekonkurranse.herokuapp.com/:1
 Application Cache Checking event tippekonkurranse.herokuapp.com/:1
 Uncaught Error: Load timeout for modules: app.router
 http://requirejs.org/docs/errors.html#timeout require.js:1
 makeError                                                           require.js:1
 n                                                                   require.js:1
 (anonymous function)                                                require.js:1
 Application Cache NoUpdate event tippekonkurranse.herokuapp.com/:1
 */
/* All Heroku dynos turned off:
 Document was loaded from Application Cache with manifest http://tippekonkurranse.herokuapp.com/manifest.appcache tippekonkurranse.herokuapp.com/:1
 Application Cache Checking event tippekonkurranse.herokuapp.com/:1
 Application Cache Error event: Manifest fetch failed (503) http://tippekonkurranse.herokuapp.com/manifest.appcache tippekonkurranse.herokuapp.com/:1
 GET http://tippekonkurranse.herokuapp.com/scripts/app.router.js 503 (Service Unavailable) require.js:1
 req.load require.js:1
 u.load require.js:1
 t.load require.js:1
 t.fetch require.js:1
 t.check require.js:1
 t.enable require.js:1
 u.enable require.js:1
 (anonymous function) require.js:1
 (anonymous function) require.js:1
 each require.js:1
 t.enable require.js:1
 t.init require.js:1
 o require.js:1
 u.completeLoad require.js:1
 u.onScriptLoad require.js:1
 Uncaught Error: Script error for: app.router
 http://requirejs.org/docs/errors.html#scripterror require.js:1
 makeError require.js:1
 u.onScriptError require.js:1
 */
/* Local server killed:
 Document was loaded from Application Cache with manifest http://localhost:5000/manifest.appcache localhost/:1
 Application Cache Checking event localhost/:1
 GET http://localhost:5000/scripts/app.router.js net::ERR_CONNECTION_REFUSED require.js:1903
 req.load require.js:1903
 context.load require.js:1647
 Module.load require.js:828
 Module.fetch require.js:818
 Module.check require.js:848
 Module.enable require.js:1151
 context.enable require.js:1519
 (anonymous function) require.js:1136
 (anonymous function) require.js:132
 each require.js:57
 Module.enable require.js:1098
 Module.init require.js:782
 callGetModule require.js:1178
 context.completeLoad require.js:1552
 context.onScriptLoad require.js:1679
 Error, message=Uncaught Error: Script error for: app.router
 http://requirejs.org/docs/errors.html#scripterror                              app.config.js:45
 Error, url=http://localhost:5000/bower_components/requirejs/require.js         app.config.js:46
 Error, lineNumber=141                                                          app.config.js:47
 Application Cache Error event: Manifest fetch failed (6) http://localhost:5000/manifest.appcache localhost/:1
 */
window.onerror = function (message, url, lineNumber) {
    "use strict";
    window.console.warn("Error: message=" + message);
    window.console.warn("Error: url=" + url);
    window.console.warn("Error: lineNumber=" + lineNumber);

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

    if (isHerokuServerStartingUp()) {
        if (window.localStorage) {
            remainingNumberOfReloads = window.localStorage.getItem(remainingNumberOfReloadsKey);
            remainingNumberOfReloadsTimestamp = window.localStorage.getItem(remainingNumberOfReloadsTimestampKey);

            if (!remainingNumberOfReloads) {
                remainingNumberOfReloads = initialNumberOfReloads;
                eligibleForReload = true;
            } else {
                // Relevant 'remainingNumberOfReloads' fetched from local store?
                if (remainingNumberOfReloadsTimestamp > Date.now() - millisecondsBeforeReload * 2) {
                    if (window.parseInt(remainingNumberOfReloads, 10) > 0) {
                        eligibleForReload = true;
                    }
                } else {
                    remainingNumberOfReloads = initialNumberOfReloads;
                    eligibleForReload = true;
                }
            }

            if (eligibleForReload) {
                window.setTimeout(function () {
                    remainingNumberOfReloads -= 1;
                    window.localStorage.setItem(remainingNumberOfReloadsKey, remainingNumberOfReloads);
                    window.localStorage.setItem(remainingNumberOfReloadsTimestampKey, Date.now());

                    window.location.reload();

                }, millisecondsBeforeReload);
                return true;
            }
        }
    }
    return false;
};
