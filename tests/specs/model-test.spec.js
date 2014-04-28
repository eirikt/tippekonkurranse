/* global define:false, describe:false, it:false */
/* jshint -W030 */

/* For WebStorm ...
 var chai = require('../bower_components/chai/chai'),
 expect = chai.expect;
 */

//var Sample = require('app/models').Sample;

define([
        'tests/bower_components/chai/chai',
        'tests/app/models'
    ],
    function (chai, models) {
        'use strict';

        var expect = chai.expect;

        describe('Models', function () {

            describe('Sample Model', function () {
                it('should default "urlRoot" property to "/api/samples"', function () {
                    expect(true).to.be.ok;
                    expect(true).to.be.true;
                    var sample = new models.Sample();
                    expect(sample.urlRoot).to.equal("/api/samples");
                });
            });
        });
    });
