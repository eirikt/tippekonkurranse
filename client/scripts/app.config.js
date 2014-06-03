require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'jquery.bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'moment': '../bower_components/moment/min/moment.min',
        'moment.nb': '../bower_components/moment/lang/nb',
        'toastr': '../bower_components/toastr/toastr.min'
    }
});

// Load and start
require(['app']);
