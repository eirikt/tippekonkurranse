/* global require: false */
require.config({
    paths: {
        'jquery': './../bower_components/jquery/dist/jquery.min',
        'jquery.bootstrap': './../bower_components/bootstrap/dist/js/bootstrap.min'
    },
    shim: {
        'jquery.bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        }
    }
});

// Load and start
require(['app'], function () {});
