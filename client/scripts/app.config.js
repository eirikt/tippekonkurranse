/* global require: false */
require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'jquery.bootstrap': '../bower_components/bootstrap/dist/js/bootstrap'
    },
    shim: {
        'jquery.bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        }
    }
});

// Load and start
require(['app'], function () {
});
