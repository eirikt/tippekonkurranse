/* globals define:false */

/* For WebStorm ...
 var define = require('../bower_components/requirejs/require');
*/

define([
        'client/bower_components/jquery/dist/jquery.min',
        'client/bower_components/underscore/underscore',
        'client/bower_components/backbone/backbone'
    ],
    function ($, _, Backbone) {
        "use strict";

        var models = {};

        models.Sample = Backbone.Model.extend({
            urlRoot: '/api/samples'
        });

        return models;
    }
);
