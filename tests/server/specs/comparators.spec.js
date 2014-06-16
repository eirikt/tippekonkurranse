/* global describe:false, it:false */
/* jshint -W030 */

var expect = require("../../../node_modules/chai/chai.js").expect,

    __ = require('../../../node_modules/underscore/underscore-min'),
    Backbone = require('../../../build/bower_components/backbone/backbone'),

    Comparators = require('../../../shared/scripts/comparators');


describe("Comparators", function () {
    "use strict";

    describe("chainableAscendingComparator", function () {
        var chainableAscendingComparator = Comparators.chainableAscendingComparator,
            backbonePropertyGetter = Comparators.backbonePropertyGetter,
            alwaysEqualComparator = Comparators.alwaysEqualComparator;

        it("should exist", function () {
            expect(chainableAscendingComparator).to.exist;
            expect(backbonePropertyGetter).to.exist;
            expect(alwaysEqualComparator).to.exist;
        });

        it("should sort models by single number property value", function () {
            var backboneChainableAscendingComparator = __.partial(chainableAscendingComparator, backbonePropertyGetter);
            expect(backboneChainableAscendingComparator).to.exist;
            expect(__.isFunction(backboneChainableAscendingComparator)).to.be.true;

            var backboneAscendingComparator = __.partial(backboneChainableAscendingComparator, alwaysEqualComparator);
            expect(backboneAscendingComparator).to.exist;
            expect(__.isFunction(backboneAscendingComparator)).to.be.true;

            var myComparator = __.partial(backboneAscendingComparator, "myNumberProperty");
            expect(myComparator).to.exist;
            expect(__.isFunction(myComparator)).to.be.true;

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
            var myComparator = __.partial(chainableAscendingComparator, backbonePropertyGetter, alwaysEqualComparator, "myId"),

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
        var multiAscendingBackbone = Comparators.multiAscendingBackbone;

        it("should exist and be a function", function () {
            expect(multiAscendingBackbone).to.exist;
            expect(__.isFunction(multiAscendingBackbone)).to.be.true;
        });

        it("should be somewhat robust", function () {
            var myUndefinedPropertyNamesComparator = __.partial(multiAscendingBackbone, undefined),
                myNullAsPropertyNamesComparator = __.partial(multiAscendingBackbone, null),
                myEmptyPropertyNamesComparator = __.partial(multiAscendingBackbone, []),
                myIllegalType1PropertyNamesComparator = __.partial(multiAscendingBackbone, 3.14),
                myIllegalType2PropertyNamesComparator = __.partial(multiAscendingBackbone, [3.14, new Date()]),

                model1 = { "myId": "1", "myNumberProperty": 1 },
                model2 = { "myId": "2", "myNumberProperty": 2 },
                model3 = { "myId": "3", "myNumberProperty": 3 },

                coll1 = new Backbone.Collection([model2, model3, model1], { comparator: myUndefinedPropertyNamesComparator }),
                coll2 = new Backbone.Collection([model2, model3, model1], { comparator: myNullAsPropertyNamesComparator }),
                coll3 = new Backbone.Collection([model2, model3, model1], { comparator: myEmptyPropertyNamesComparator }),
                coll4 = new Backbone.Collection([model2, model3, model1], { comparator: myIllegalType1PropertyNamesComparator }),
                coll5 = new Backbone.Collection([model2, model3, model1], { comparator: myIllegalType1PropertyNamesComparator });

            expect(coll1.at(0).get("myId")).to.be.equal("2");
            expect(coll1.at(1).get("myId")).to.be.equal("3");
            expect(coll1.at(2).get("myId")).to.be.equal("1");

            expect(coll2.at(0).get("myId")).to.be.equal("2");
            expect(coll2.at(1).get("myId")).to.be.equal("3");
            expect(coll2.at(2).get("myId")).to.be.equal("1");

            expect(coll3.at(0).get("myId")).to.be.equal("2");
            expect(coll3.at(1).get("myId")).to.be.equal("3");
            expect(coll3.at(2).get("myId")).to.be.equal("1");

            expect(coll4.at(0).get("myId")).to.be.equal("2");
            expect(coll4.at(1).get("myId")).to.be.equal("3");
            expect(coll4.at(2).get("myId")).to.be.equal("1");

            expect(coll5.at(0).get("myId")).to.be.equal("2");
            expect(coll5.at(1).get("myId")).to.be.equal("3");
            expect(coll5.at(2).get("myId")).to.be.equal("1");
        });

        it("should sort models by single number property value, non-array argument", function () {
            var myNonArrayComparator = __.partial(multiAscendingBackbone, "myNumberProperty"),

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
            var myComparator = __.partial(multiAscendingBackbone, ["myNumberProperty"]),

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
            var myComparator = __.partial(multiAscendingBackbone,
                    ["myNumberPr_operty", "myDateProperty", "myStringProperty", "mySecondNumberProperty"]),

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
});
