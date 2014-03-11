/* global require: false */
require.config({
    paths: {
        'jquery': './vendor/jquery.min'//,
        //'jquery.bootstrap': './vendor/bootstrap.min'
    }//,
    //shim: {
    //    'jquery.bootstrap': {
    //        deps: ['jquery'],
    //        exports: 'Bootstrap'
    //    }
    //}
});

// Load and start
require(['app'], function () {
});
