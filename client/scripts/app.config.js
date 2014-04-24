/* global require: false */
require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery.bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'moment': '../bower_components/moment/min/moment.min',

        // Lib file must be copied in during build step ('grunt run')
        'app.models.scoreModel': './app.models'
        //'app.models.scoreModel': '../../shared/scripts/app.models' // Dev setting
    },
    shim: {
        'jquery': {
            deps: [],
            exports: 'jquery'
        },
        'jquery.bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        'underscore': {
            deps: [],
            exports: '_'
        },
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        'moment': {
            deps: [],
            exports: 'Moment'
        },
        'app.models.scoreModel': {
            deps: ['underscore'],
            exports: 'scoreModel'
        }
    }
});

// Load and start
require(['app'], function () {
});
