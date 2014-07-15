require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/lang/nb',
        'toastr': '../bower_components/toastr/toastr.min',
        'jqplot': '../bower_components/jqplot-bower/dist/jquery.jqplot.min',
        'jqplot.highlighter': '../bower_components/jqplot-bower/dist/plugins/jqplot.highlighter.min',
        'jqplot.cursor': '../bower_components/jqplot-bower/dist/plugins/jqplot.cursor.min',
        'jqplot.dateAxisRenderer': '../bower_components/jqplot-bower/dist/plugins/jqplot.dateAxisRenderer.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jqplot': {
            deps: ['jquery'],
            exports: 'jqplot'
        },
        'jqplot.highlighter': {
            deps: ['jquery', 'jqplot'],
            exports: 'jqplot.highlighter'
        },
        'jqplot.cursor': {
            deps: ['jquery', 'jqplot'],
            exports: 'jqplot.cursor'
        },
        'jqplot.dateAxisRenderer': {
            deps: ['jquery', 'jqplot'],
            exports: 'jqplot.dateAxisRenderer'
        }
    }
});

// Load and execute these
//require(['app']);
require(['app', 'jqplot']);
//require(['app', 'jqplot', 'jqplot.highlighter', 'jqplot.cursor', 'jqplot.dateAxisRenderer']);
