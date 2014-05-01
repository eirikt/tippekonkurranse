/* global define:false, describe:false, it:false */
/* jshint -W030 */

define(['chai', '../../build/scripts/utils'],
    function (chai, utils) {
        'use strict';

        var expect = chai.expect,

            isTouchDeviceUserAgentString = utils.isTouchDeviceUserAgentString,
            isTouchDevice = utils.isTouchDevice;

        describe("global function isTouchDeviceUserAgentString", function () {

            describe("isTouchDeviceUserAgentString", function () {
                it("should exist", function () {
                    expect(isTouchDeviceUserAgentString).to.exist;
                });

                it("should not identify touch device as default", function () {
                    expect(isTouchDeviceUserAgentString()).to.be.false;
                });

                it("should not identify touch device as default", function () {
                    expect(isTouchDeviceUserAgentString(null)).to.be.false;
                });

                it("should not identify touch device as default", function () {
                    expect(isTouchDeviceUserAgentString("")).to.be.false;
                });

                it("should identify iPad on iOS 7 as touch device", function () {
                    var iOS7UserAgent = "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25 (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)";
                    expect(isTouchDeviceUserAgentString(iOS7UserAgent)).to.be.true;
                });

                it("should identify iPhone on iOS 7 as touch device", function () {
                    var iOS7UserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25";
                    expect(isTouchDeviceUserAgentString(iOS7UserAgent)).to.be.true;
                });

                it("should identify Android browser as touch device", function () {
                    var androidBrowserUserAgent = "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
                    expect(isTouchDeviceUserAgentString(androidBrowserUserAgent)).to.be.true;
                });

                it("should identify Chrome browser for iPad as touch device", function () {
                    var chromeForIPadUserAgent = "Mozilla/5.0 (iPad; U; CPU iPad OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3";
                    expect(isTouchDeviceUserAgentString(chromeForIPadUserAgent)).to.be.true;
                });

                it("should identify Chrome browser for iPhone as touch device", function () {
                    var chromeForIPhoneUserAgent = "Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3";
                    expect(isTouchDeviceUserAgentString(chromeForIPhoneUserAgent)).to.be.true;
                });
            });

            describe("isTouchDevice", function () {
                it("should exist", function () {
                    expect(isTouchDevice).to.exist;
                });
            });
        });
    }
);
