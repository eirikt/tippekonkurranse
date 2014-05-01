/* global mocha:false, define:false */
require.config({
    baseUrl: '/',
    paths: {
        jquery: 'client/bower_components/jquery/dist/jquery.min',
        chai: '../../node_modules/chai/chai',
        sinon: '../../node_modules/sinon/pkg/sinon'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'chai': {
            exports: 'chai'
        },
        'sinon': {
            exports: 'sinon'
        }
    }
});

require([
        'specs/test.spec.js',
        'specs/client-global-functions.spec.js'
    ],
    function () {
        "use strict";
        (window.mochaPhantomJS || mocha).run();
    }
);
