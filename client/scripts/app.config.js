require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/lang/nb',
        'toastr': '../bower_components/toastr/toastr.min',
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot.min'
    },
    shim: {
        //'jquery': {
        //    deps: [],
        //    exports: 'jquery'
        //},
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        //'underscore': {
        //    deps: [],
        //    exports: 'underscore'
        //},
        //'backbone': {
        //    deps: ['jquery', 'underscore'],
        //    exports: 'backbone'
        //},
        'jqplot': {
            deps: ['jquery'],
            exports: 'jqplot'
        }
    }
});

// Load and execute these
require(['app', 'jqplot']);
