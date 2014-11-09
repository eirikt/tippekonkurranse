/* global define:false */
/* jshint -W031 */
define([
        'jquery', 'underscore', 'backbone', 'toastr',
        'backbone.fetch-local-copy', 'app.router'],

    function ($, _, Backbone, toastr, BackboneFetchLocalCopy, AppRouter) {
        'use strict';

        $(document).ready(function () {
            console.log('DOM ready! Application starting ...');

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
