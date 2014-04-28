/* global define:false, describe:false, it:false */
/* jshint -W030 */

/* For WebStorm ... */
//var chai = require('../bower_components/chai/chai'),
//    expect = chai.expect,
//    sinon = require('../bower_components/sinon/lib/sinon');//,
//utils = require('../../client/scripts/utils');


define([
        'tests/bower_components/chai/chai',
        '../client/scripts/utils'
    ],
    function (chai, utils) {
        'use strict';

        var expect = chai.expect,

            isTouchDeviceUserAgentString = utils.isTouchDeviceUserAgentString,
            isTouchDevice = utils.isTouchDevice;

        describe("global function isTouchDeviceUserAgentString", function () {

            describe("isTouchDeviceUserAgentString", function () {
                it("should exist", function () {
                    //define('../../client/scripts/utils', function(jjj){
                    //expect(root.isTouchDeviceUserAgentString).to.exist;
                    //expect(jjj.isTouchDeviceUserAgentString).to.exist;
                    //expect(utils.isTouchDeviceUserAgentString).to.exist;
                    expect(isTouchDeviceUserAgentString).to.exist;
                    //});
                });
            });

            describe("isTouchDevice", function () {
                it("should exist", function () {
                    //expect(root.isTouchDevice).to.exist;
                    //expect(root.isTouchDevice).to.exist;
                    expect(isTouchDevice).to.exist;
                });

                //it("should identify iPad 4 as touch device", function () {
                //    var iPad4UserAgent = '';
                //    expect(root.isTouchDeviceUserAgentString(iPad4UserAgent)).to.be.true;
                //});
            });
        });
    });

