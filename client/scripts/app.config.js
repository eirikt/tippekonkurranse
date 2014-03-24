/* global require: false */
require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'jquery.bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',

        'moment': '../bower_components/moment/min/moment.min',

        // Lib file must be copied in during build step ('grunt run')
        'app.models.ScoreModel': './app.models'
        //'app.models.ScoreModel': '../../shared/scripts/app.models' // Dev setting
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
        'app.models.ScoreModel': {
            exports: 'ScoreModel'
        }
    }
});

// Load and start
require(['app'], function () {
});
