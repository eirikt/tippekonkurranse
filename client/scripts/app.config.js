/* global require:false, appName:false, resource:false, scoreModel:false */
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
        'app.models': './app.models'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'jquery.bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },
        'app.models': {
            deps: ['underscore'],
            init: function () {
                'use strict';
                return {
                    appName: appName,
                    name: appName,

                    resource: resource,
                    scoreModel: scoreModel
                };
            }
        }
    }
});

// Load and start
require(['app']);
