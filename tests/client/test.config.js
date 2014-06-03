/* global mocha:false */

require.config({
    baseUrl: '/',
    paths: {
        jquery: 'build/bower_components/jquery/dist/jquery.min',
        underscore: 'build/bower_components/underscore/underscore',
        backbone: 'build/bower_components/backbone/backbone',
        moment: 'build/bower_components/moment/min/moment.min',
        toastr: 'build/bower_components/toastr/toastr.min',

        chai: 'node_modules/chai/chai',
        sinon: 'node_modules/sinon/lib/sinon',

        // Shared util libs
        'fun': 'build/scripts/fun',
        'comparators': 'build/scripts/comparators',

        // Shared app libs
        'app.models': 'build/scripts/app.models',

        // Client-side only util libs
        'utils': 'build/scripts/utils',
        'backbone.fetch-local-copy': 'build/scripts/backbone.fetch-local-copy',

        // Client-side only app libs
        'app.result': 'build/scripts/app.result',
        'app.result-collection': 'build/scripts/app.result-collection'
    }
});

require([
        'specs/test.spec.js',
        'specs/client-global-functions.spec.js',
        'specs/app.scores-collection.spec.js'
    ],
    function () {
        'use strict';
        (window.mochaPhantomJS || mocha).run();
    }
);
