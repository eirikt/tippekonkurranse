/* global mocha:false */
require.config({
    baseUrl: '.',
    nodeRequire: require,
    paths: {
        'jquery': '../../build/bower_components/jquery/dist/jquery',
        'underscore': '../../build/bower_components/underscore/underscore',
        'backbone': '../../build/bower_components/backbone/backbone',
        'moment': '../../build/bower_components/moment/moment',
        'moment.nb': '../../build/bower_components/moment/locale/nb',
        'toastr': '../../build/bower_components/toastr/toastr',

        chai: '../../node_modules/chai/chai',
        sinon: '../../node_modules/sinon/lib/sinon',
        //fakeServer: '../../node_modules/sinon/pkg/sinon/util/fake_server',

        // Shared util libs
        fun: '../../build/scripts/fun',
        'string-extensions': '../../build/scripts/string-extensions',
        comparators: '../../build/scripts/comparators',

        // Shared app libs
        'app.models': '../../build/scripts/app.models',

        // Client-side-only util libs
        utils: '../../build/scripts/utils',
        'backbone.fetch-local-copy': '../../build/scripts/backbone.fetch-local-copy',

        // Client-side-only app libs (Router)
        'app.router': '../../build/scripts/app.router',

        // Client-side-only app libs (Models)
        'app.result': '../../build/scripts/app.result',

        // Client-side-only app libs (Collections)
        'app.result-collection': '../../build/scripts/app.result-collection',
        'app.rating-history-collection': '../../build/scripts/app.rating-history-collection',

        // Client-side-only app libs (Views)
        'app.header-view': '../../build/scripts/app.header-view',
        'app.participant-score-view': '../../build/scripts/app.participant-score-view',
        'app.rating-history-view': '../../build/scripts/app.rating-history-view',
        'app.results-view': '../../build/scripts/app.results-view',
        'app.soccer-table-views': '../../build/scripts/app.soccer-table-views'
    },
    shim: {
        'sinon': {
            deps: [],
            exports: 'sinon'
        }//,
        //'fakeServer': {
        //    deps: ['sinon'],
        //    exports: 'fakeServer'
        //}
    }
});

require([
        'specs/test.spec.js',
        'specs/string-extensions.amd.spec.js',
        'specs/comparators.amd.spec.js',

        'specs/utils.spec.js',

        'specs/app.scores-collection.spec.js',
        'specs/app.rating-history-collection.spec.js',
        'specs/app.rating-view.spec.js'
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
