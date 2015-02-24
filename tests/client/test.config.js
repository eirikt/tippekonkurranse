/* global mocha:false */
require.config({
    baseUrl: '.',
    nodeRequire: require,
    paths: {
        'jquery': '../../build/bower_components/jquery/dist/jquery',
        'bootstrap': '../../build/bower_components/bootstrap/dist/js/bootstrap',
        'underscore': '../../build/bower_components/underscore/underscore',
        'backbone': '../../build/bower_components/backbone/backbone',
        'marionette': '../../build/bower_components/marionette/lib/backbone.marionette',
        'moment': '../../build/bower_components/moment/moment',
        'moment.nb': '../../build/bower_components/moment/locale/nb',
        'toastr': '../../build/bower_components/toastr/toastr',

        'chai': '../../node_modules/chai/chai',
        'sinon': '../../node_modules/sinon/lib/sinon',

        // Shared util libs
        'fun': '../../build/scripts/fun',
        'string-extensions': '../../build/scripts/string-extensions',
        'utils': '../../build/scripts/utils',
        'comparators': '../../build/scripts/comparators',

        // Shared app libs
        'app.models': '../../build/scripts/app.models',

        // Client-side-only util libs
        'backbone.fetch-local-copy': '../../build/scripts/backbone.fetch-local-copy',
        'backbone.bootstrap.views': '../../build/scripts/backbone.bootstrap.views',
        'client-utils': '../../build/scripts/client-utils',

        // Client-side-only app libs (Controller/Router)
        'app.controller': '../../build/scripts/app.controller',

        // Client-side-only app libs (Models)
        'app.result': '../../build/scripts/app.result',

        // Client-side-only app libs (Collections)
        'app.result-collection': '../../build/scripts/app.result-collection',
        'app.rating-history-collection': '../../build/scripts/app.rating-history-collection',

        // Client-side-only app libs (Views)
        'app.header-view': '../../build/scripts/app.header-view',
        'app.navigator-view': '../../build/scripts/app.navigator-view',
        'app.pre-season-participant-row-view': '../../build/scripts/app.pre-season-participant-row-view',
        'app.pre-season-table-view': '../../build/scripts/app.pre-season-table-view',
        'app.rating-history-view': '../../build/scripts/app.rating-history-view',
        'app.scores-header-row-view': '../../build/scripts/app.scores-header-row-view',
        'app.scores-participant-row-view': '../../build/scripts/app.scores-participant-row-view',
        'app.scores-table-view': '../../build/scripts/app.scores-table-view',
        'app.soccer-table-views': '../../build/scripts/app.soccer-table-views'
    }
});

require([
        'specs/test.spec.js'//,
        //'specs/string-extensions.amd.spec.js',
        //'specs/utils.amd.spec.js',
        //'specs/comparators.amd.spec.js',

        //'specs/client-utils.spec.js',

        //'specs/app.scores-collection.spec.js',
        //'specs/app.rating-history-collection.spec.js',
        //'specs/app.rating-view.spec.js'
    ],

    function () {
        'use strict';

        var runner = (window.mochaPhantomJS || mocha).run(),
            failedTests = [];

        runner.on('end', function () {
            window.mochaResults = runner.stats;
            window.mochaResults.reports = failedTests;
        });

        runner.on('fail', function (test, err) {
            failedTests.push({
                name: test.title,
                result: false,
                message: err.message,
                stack: err.stack,
                titles: function (test) {
                    var titles = [];
                    while (test.parent.title) {
                        titles.push(test.parent.title);
                        test = test.parent;
                    }
                    return titles.reverse();
                }
            });
        });
    }
);
