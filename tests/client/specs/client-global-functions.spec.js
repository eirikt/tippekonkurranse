/* global define:false, describe:false, it:false */
/* jshint -W030 */

define(["chai", "underscore", "backbone", "../../../build/scripts/utils"],
    function (Chai, _, Backbone, Utils) {
        "use strict";

        var expect = Chai.expect;

        describe("isTouchDeviceUserAgentString", function () {
            var isTouchDeviceUserAgentString = Utils.isTouchDeviceUserAgentString;

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
            var isTouchDevice = Utils.isTouchDevice;

            it("should exist", function () {
                expect(isTouchDevice).to.exist;
            });
        });


        /*
        describe("chainableAscendingComparator", function () {
            var chainableAscendingComparator = Utils.chainableAscendingComparator,
                backbonePropertyGetter = Utils.backbonePropertyGetter,
                alwaysEqualComparator = Utils.alwaysEqualComparator;

            it("should exist", function () {
                expect(chainableAscendingComparator).to.exist;
                expect(backbonePropertyGetter).to.exist;
                expect(alwaysEqualComparator).to.exist;
            });

            it("should sort models by single number property value", function () {
                var backboneChainableAscendingComparator = _.partial(chainableAscendingComparator, backbonePropertyGetter);
                expect(backboneChainableAscendingComparator).to.exist;
                expect(_.isFunction(backboneChainableAscendingComparator)).to.be.true;

                var backboneAscendingComparator = _.partial(backboneChainableAscendingComparator, alwaysEqualComparator);
                expect(backboneAscendingComparator).to.exist;
                expect(_.isFunction(backboneAscendingComparator)).to.be.true;

                var myComparator = _.partial(backboneAscendingComparator, "myNumberProperty");
                expect(myComparator).to.exist;
                expect(_.isFunction(myComparator)).to.be.true;

                var model1 = new Backbone.Model({
                    "myId": "1",
                    "myNumberProperty": 1
                });
                var model2 = new Backbone.Model({
                    "myId": "2",
                    "myNumberProperty": 2
                });
                var model3 = new Backbone.Model({
                    "myId": "3",
                    "myNumberProperty": 3
                });
                var coll = new Backbone.Collection([model3, model1, model2], { comparator: myComparator });

                expect(coll.at(0).get("myId")).to.be.equal("1");
                expect(coll.at(1).get("myId")).to.be.equal("2");
                expect(coll.at(2).get("myId")).to.be.equal("3");
            });

            it("should sort models by single string property value", function () {
                var myComparator = _.partial(chainableAscendingComparator, backbonePropertyGetter, alwaysEqualComparator, "myId"),

                    model1 = new Backbone.Model({
                        "myId": "1",
                        "myNumberProperty": 1
                    }),
                    model2 = new Backbone.Model({
                        "myId": "2",
                        "myNumberProperty": 2
                    }),
                    model3 = new Backbone.Model({
                        "myId": "3",
                        "myNumberProperty": 3
                    }),
                    coll = new Backbone.Collection([model2, model3, model1], { comparator: myComparator });

                expect(coll.at(0).get("myId")).to.be.equal("1");
                expect(coll.at(1).get("myId")).to.be.equal("2");
                expect(coll.at(2).get("myId")).to.be.equal("3");
            });
        });


        describe("ascendingBackboneComparator", function () {
            var ascendingBackboneComparator = Utils.ascendingBackboneComparator;

            it("should exist and be a function", function () {
                expect(ascendingBackboneComparator).to.exist;
                expect(_.isFunction(ascendingBackboneComparator)).to.be.true;
            });

            it("should be somewhat robust", function () {
                var myUndefinedPropertyNamesComparator = _.partial(ascendingBackboneComparator, undefined),
                    myNullAsPropertyNamesComparator = _.partial(ascendingBackboneComparator, null),
                    myEmptyPropertyNamesComparator = _.partial(ascendingBackboneComparator, []),

                    model1 = new Backbone.Model({
                        "myId": "1",
                        "myNumberProperty": 1
                    }),
                    model2 = new Backbone.Model({
                        "myId": "2",
                        "myNumberProperty": 2
                    }),
                    model3 = new Backbone.Model({
                        "myId": "3",
                        "myNumberProperty": 3
                    }),
                    coll1 = new Backbone.Collection([model2, model3, model1], { comparator: myUndefinedPropertyNamesComparator }),
                    coll2 = new Backbone.Collection([model2, model3, model1], { comparator: myNullAsPropertyNamesComparator }),
                    coll3 = new Backbone.Collection([model2, model3, model1], { comparator: myEmptyPropertyNamesComparator });

                expect(coll1.at(0).get("myId")).to.be.equal("2");
                expect(coll1.at(1).get("myId")).to.be.equal("3");
                expect(coll1.at(2).get("myId")).to.be.equal("1");

                expect(coll2.at(0).get("myId")).to.be.equal("2");
                expect(coll2.at(1).get("myId")).to.be.equal("3");
                expect(coll2.at(2).get("myId")).to.be.equal("1");

                expect(coll3.at(0).get("myId")).to.be.equal("2");
                expect(coll3.at(1).get("myId")).to.be.equal("3");
                expect(coll3.at(2).get("myId")).to.be.equal("1");
            });

            it("should sort models by single number property value, non-array argument", function () {
                var myNonArrayComparator = _.partial(ascendingBackboneComparator, "myNumberProperty"),

                    model1 = new Backbone.Model({
                        "myId": "1",
                        "myNumberProperty": 1
                    }),
                    model2 = new Backbone.Model({
                        "myId": "2",
                        "myNumberProperty": 2
                    }),
                    model3 = new Backbone.Model({
                        "myId": "3",
                        "myNumberProperty": 3
                    }),
                    coll = new Backbone.Collection([model2, model3, model1], { comparator: myNonArrayComparator });

                expect(coll.at(0).get("myId")).to.be.equal("1");
                expect(coll.at(1).get("myId")).to.be.equal("2");
                expect(coll.at(2).get("myId")).to.be.equal("3");
            });

            it("should sort models by single number property value", function () {
                var myComparator = _.partial(ascendingBackboneComparator, ["myNumberProperty"]),

                    model1 = new Backbone.Model({
                        "myId": "1",
                        "myNumberProperty": 1
                    }),
                    model2 = new Backbone.Model({
                        "myId": "2",
                        "myNumberProperty": 2
                    }),
                    model3 = new Backbone.Model({
                        "myId": "3",
                        "myNumberProperty": 3
                    }),
                    coll = new Backbone.Collection([model1, model3, model2], { comparator: myComparator });

                expect(coll.at(0).get("myId")).to.be.equal("1");
                expect(coll.at(1).get("myId")).to.be.equal("2");
                expect(coll.at(2).get("myId")).to.be.equal("3");
            });

            it("should sort models", function () {
                var myComparator = _.partial(ascendingBackboneComparator,
                        ["myNumberProperty", "myDateProperty", "myStringProperty", "mySecondNumberProperty"]),

                    model1 = { myId: "1", myNumberProperty: 100, mySecondNumberProperty: -100, myStringProperty: "A", myDateProperty: new Date(2014, 6, 1) },
                    model2 = { myId: "2", myNumberProperty: 100, mySecondNumberProperty: -90, myStringProperty: "B", myDateProperty: new Date(2014, 6, 1) },
                    model3 = { myId: "3", myNumberProperty: 100, mySecondNumberProperty: -100, myStringProperty: "A", myDateProperty: new Date(2014, 6, 2) },
                    model4 = { myId: "4", myNumberProperty: 100, mySecondNumberProperty: -10, myStringProperty: "A", myDateProperty: new Date(2014, 6, 2) },
                    model5 = { myId: "5", myNumberProperty: 100, mySecondNumberProperty: -100, myStringProperty: "D", myDateProperty: new Date(2014, 6, 2) },

                    coll = new Backbone.Collection([model3, model5, model1, model4, model2], { comparator: myComparator });

                expect(coll.at(0).get("myId")).to.be.equal("1");
                expect(coll.at(1).get("myId")).to.be.equal("2");
                expect(coll.at(2).get("myId")).to.be.equal("3");
                expect(coll.at(3).get("myId")).to.be.equal("4");
                expect(coll.at(4).get("myId")).to.be.equal("5");
            });
        });
        */
    }
);
