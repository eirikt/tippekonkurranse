/* global mocha:false, define:false */
require.config({
    baseUrl: '/',
    paths: {
        jquery: 'client/bower_components/jquery/dist/jquery.min'
    },
    shim: {
        'jquery': {
            jquery: '$'
        }
    }
});

require([
        'specs/model-test.spec.js',
        'specs/client-global-functions.spec.js'
    ],
    function () {
        "use strict";
        (window.mochaPhantomJS || mocha).run();
    }
);
