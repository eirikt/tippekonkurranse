/* jshint -W031 */

window.console.log('app.config.js');

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
    baseUrl: '1.3.2/scripts',

    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'marionette': '../bower_components/marionette/lib/backbone.marionette.min',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/locale/nb',
        'toastr': '../bower_components/toastr/toastr.min',
        'jquery.countdown': '../bower_components/jquery.countdown/dist/jquery.countdown',
        'jquery.bootstrap.switch': '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min',
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot'
        // TODO: Make the jqplot cursor work ...
        //'jqplot.highlighter': '../bower_components/jqplot-bower/dist/plugins/jqplot.highlighter.min',
        //'jqplot.cursor': '../bower_components/jqplot-bower/dist/plugins/jqplot.cursor.min',
        //'jqplot.dateAxisRenderer': '../bower_components/jqplot-bower/dist/plugins/jqplot.dateAxisRenderer.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: '$'
        },
        jqplot: {
            deps: ['jquery'],
            exports: '$'
        },
        'jquery.bootstrap.switch': {
            deps: ['jquery', 'bootstrap'],
            exports: '$'
        },
        enforceDefine: true
    },
    config: {
        moment: {
            noGlobal: true
        }
    }
});


require(['underscore', 'jquery', 'backbone', 'marionette', 'toastr', 'jqplot', 'jquery.countdown', 'jquery.bootstrap.switch', 'backbone.bootstrap.views', 'backbone.fetch-local-copy', 'app', 'app.controller'],
    function (_, $, Backbone, Marionette, Toastr, $jqplot, $countdown, $bootstrapSwitch, BootstrapViews, BackboneFetchLocalCopy, app, clientSideRequestHandler) {
        'use strict';

        window.console.log('app.config.js :: Application configuration and start ...');

        /*
         console.log('Checking AppCache status ...');
         var appCache = window.applicationCache;

         if (appCache) {
         switch (appCache.status) {
         case appCache.UNCACHED: // UNCACHED == 0
         console.log('UNCACHED');
         break;
         case appCache.IDLE: // IDLE == 1
         console.log('IDLE');
         break;
         case appCache.CHECKING: // CHECKING == 2
         console.log('CHECKING');
         break;
         case appCache.DOWNLOADING: // DOWNLOADING == 3
         console.log('DOWNLOADING');
         break;
         case appCache.UPDATEREADY:  // UPDATEREADY == 4
         console.log('UPDATEREADY');
         break;
         case appCache.OBSOLETE: // OBSOLETE == 5
         console.log('OBSOLETE');
         break;
         default:
         console.log('UKNOWN CACHE STATUS');
         break;
         }
         }
         */

        // Toastr.js config (=> http://codeseven.github.io/toastr/demo.html)
        Toastr.options = {
            'positionClass': 'toast-top-full-width',
            'timeOut': 6000
        };

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

        $(document).ready(function () {
            console.log('DOM ready!');

            BackboneFetchLocalCopy.listenToServerConnectionDropouts([
                '#offlineScoresNotification',
                '#offlineCurrentResultsNotification'
            ]);

            // Strict AppCache updateready modal window
            var appCache = window.applicationCache,
                ReloadNotificationView,
                bootstrapModalContainerView,
                reloadNotificationView;

            if (appCache && appCache.status === appCache.UPDATEREADY) {
                bootstrapModalContainerView = new BootstrapViews.ModalContainerView({
                    parentSelector: 'body',
                    id: 'reloadNotification',
                    ariaLabelledBy: 'reloadNotificationLabel'
                });
                bootstrapModalContainerView.attach();

                ReloadNotificationView = Marionette.ItemView.extend({
                    template: _.template('' +
                    '<div class="modal-dialog" style="width:400px;text-align:center;margin-top:200px">' +
                    '  <div class="modal-content">' +
                    '    <div class="modal-header">' +
                    '      <h4 id="reloadNotificationLabel" class="modal-title">' +
                    '        En ny versjon av Tippekonkurranse er klar ...' +
                    '      </h4>' +
                    '    </div>' +
                    '    <div class="modal-footer" style="text-align:center;">' +
                    '      <button id="reload" type="button" class="btn btn-default" data-dismiss="modal">OK, greit!</button>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'),

                    onRender: function () {
                        var self = this;
                        this.$el.modal({ keyboard: false })
                            .on('click', '#reload', function () {
                                window.location.reload();
                            })
                            .on('shown.bs.modal', function () {
                                self.$('button').focus();
                            }
                        );
                    }
                });

                reloadNotificationView = new ReloadNotificationView({
                    el: $('#' + bootstrapModalContainerView.id)
                });
                reloadNotificationView.render();
            }
            // /Strict AppCache updateready modal window
        });
    }
)
;


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
