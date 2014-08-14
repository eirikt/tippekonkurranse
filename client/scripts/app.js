/* global define:false */
/* jshint -W031 */
define([
        'jquery', 'underscore', 'backbone', 'bootstrap', 'toastr',
        'backbone.fetch-local-copy', 'app.router'],

    function ($, _, Backbone, Bootstrap, toastr, BackboneFetchLocalCopy, AppRouter) {
        'use strict';

        // Toastr.js config (=> http://codeseven.github.io/toastr/demo.html)
        toastr.options = {
            "positionClass": 'toast-top-full-width',
            "timeOut": 6000
        };

        // Application starting point (when DOM is ready ...)
        $(document).ready(function () {
            console.log('DOM ready! Starting ...');

            new AppRouter();

            Backbone.history.start({
                pushState: false,
                hashChange: true,
                root: '/'
            });

            BackboneFetchLocalCopy.listenToServerConnectionDropouts([
                '#offlineScoresNotification',
                '#offlineCurrentResultsNotification'
            ]);
        });
    }
);
