/* global mocha:false, define:false, appName:false, resource:false, scoreModel:false */

require.config({
    baseUrl: '/',
    paths: {
        jquery: 'build/bower_components/jquery/dist/jquery.min',
        underscore: 'build/bower_components/underscore/underscore',
        backbone: 'build/bower_components/backbone/backbone',
        moment: 'build/bower_components/moment/min/moment.min',
        toastr: 'build/bower_components/toastr/toastr.min',

        chai: 'node_modules/chai/chai',
        sinon: 'node_modules/sinon/pkg/sinon',

        // Adding shared app libs as well ...
        'app.models': 'build/scripts/app.models',

        // Adding app libs as well ...
        'app.result': 'build/scripts/app.result',
        'app.result-collection': 'build/scripts/app.result-collection',
        'backbone.fetch-local-copy': 'build/scripts/backbone.fetch-local-copy',
        'utils': 'build/scripts/utils'
    },
    shim: {
        //    'jquery': {
        //        exports: '$'
        //    },
        //    'underscore': {
        //        exports: '_'
        //    },
        //    'backbone': {
        //        exports: 'Backbone'
        //    },

        //    'chai': {
        //        exports: 'Chai'
        //    },
        'sinon': {
            exports: 'sinon'
        },

        // My 'dual CommonJS/AMD' libs attempt must be shimmed
        'app.models': {
            deps: ['underscore'],
            init: function () {
                'use strict';
                return {
                    //        appName: appName,
                    name: appName,
                    //        namedObject: {
                    //            name: function () {
                    //                return appName;
                    //            }
                    //        },

                    resource: resource,
                    scoreModel: scoreModel
                };
            }
        }
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
