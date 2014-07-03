/* global describe:false, it:false */
/* jshint -W030 */

var expect = require("../../../node_modules/chai/chai.js").expect,

    _ = require('../../../node_modules/underscore/underscore-min'),
    Backbone = require('../../../build/bower_components/backbone/backbone'),

    Comparators = require('../../../shared/scripts/comparators');


describe("Comparators", function () {
    "use strict";

    describe("aritmethicComparator", function () {
        var arithmeticComparator = Comparators._arithmeticAscendingValue;

        it("should exist", function () {
            expect(arithmeticComparator).to.exist;
        });
        it("should sort Numbers", function () {
            expect(arithmeticComparator(0, 0)).to.be.equal(0);
            expect(arithmeticComparator(0, 0)).not.to.be.below(0);
            expect(arithmeticComparator(0, 0)).not.to.be.above(0);

            expect(arithmeticComparator(10, 1)).to.be.equal(9);
            expect(arithmeticComparator(10, 1)).to.be.above(0);
            expect(arithmeticComparator(10, 1)).not.to.be.below(0);

            expect(arithmeticComparator(-3, 1)).to.be.equal(-4);
            expect(arithmeticComparator(-3, 1)).not.to.be.above(0);
            expect(arithmeticComparator(-3, 1)).to.be.below(0);
        });
        //it("should sort Strings", function () {
        //expect(arithmeticComparator("a","a")).to.be.equal(11); // Nope
        //});
        it("should sort Dates", function () {
            expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 1, 2))).to.be.equal(0);

            expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 3, 4))).to.be.equal(-5266800000);
            expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 3, 4))).not.to.be.above(0);
            expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 3, 4))).to.be.below(0);
        });
        //it("should sort Arrays", function () {
        //expect(arithmeticComparator([1, 2], [2, 3])).to.be.equal(11); // Nope
        //});
    });

    describe("chainableAscendingComparator", function () {
        var chainableAscendingComparator = Comparators._chainableAscending,
            backbonePropertyGetter = Comparators._backbonePropertyGetter,
            alwaysEqualComparator = Comparators._alwaysEqual;

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


    describe("backboneMultiAscending", function () {
        var backboneMultiAscending = Comparators.backboneMultiAscending;

        it("should exist and be a function", function () {
            expect(backboneMultiAscending).to.exist;
            expect(_.isFunction(backboneMultiAscending)).to.be.true;
        });

        it("should be somewhat robust", function () {
            var myUndefinedPropertyNamesComparator = _.partial(backboneMultiAscending, undefined),
                myNullAsPropertyNamesComparator = _.partial(backboneMultiAscending, null),
                myEmptyPropertyNamesComparator = _.partial(backboneMultiAscending, []),
                myIllegalType1PropertyNamesComparator = _.partial(backboneMultiAscending, 3.14),
                myIllegalType2PropertyNamesComparator = _.partial(backboneMultiAscending, [3.14, new Date()]),

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
            var myNonArrayComparator = _.partial(backboneMultiAscending, "myNumberProperty"),

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
            var myComparator = _.partial(backboneMultiAscending, ["myNumberProperty"]),

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
            var myComparator = _.partial(backboneMultiAscending,
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
});
