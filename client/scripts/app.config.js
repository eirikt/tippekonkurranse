/* global require:false */
require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery.bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/lang/nb',
        'toastr': '../bower_components/toastr/toastr.min',

        // Shared lib files must be copied in during build step ('copy')
        'app.models.scoreModel': './app.models'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'jquery.bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        'app.models.scoreModel': {
            deps: ['underscore'],
            exports: 'scoreModel'
        }
    }
});

// Load and start
require(['app']);
