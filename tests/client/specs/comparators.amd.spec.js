/* global define:false, describe:false, it:false */
/* jshint -W030 */

define([ "chai", "underscore", "backbone", "../../../shared/scripts/comparators" ],
    function (Chai, _, Backbone, Comparators) {
        "use strict";

        var expect = Chai.expect;

        describe("Comparators", function () {

            describe("alphanumericComparator", function () {
                var alphanumericComparator = Comparators._alphanumericAscendingValue;

                it("should exist as a function", function () {
                    expect(alphanumericComparator).to.exist;
                    expect(_.isFunction(alphanumericComparator)).to.exist;
                });

                it("should throw error if Numbers", function () {
                    expect(_.partial(alphanumericComparator, 0, 0)).to.throw(TypeError);
                });


                it("should sort Strings", function () {
                    expect(alphanumericComparator("a", "a")).to.be.equal(0);
                    //expect(alphanumericComparator("d", "D")).to.be.above(0); // TODO: Case-sensitivity requires some more config ...

                    expect(alphanumericComparator("a", "d")).to.be.below(0);
                    expect(alphanumericComparator("A", "D")).to.be.below(0);

                    expect(alphanumericComparator("d", "a")).to.be.above(0);
                    expect(alphanumericComparator("D", "A")).to.be.above(0);
                });

                it("should throw error if Dates", function () {
                    expect(_.partial(alphanumericComparator, new Date(), new Date())).to.throw(TypeError);
                });

                it("should throw error if Arrays", function () {
                    expect(_.partial(alphanumericComparator, [ 0, 1 ], [ 1, 2 ])).to.throw(TypeError);
                });
            });


            describe("aritmethicComparator", function () {
                var arithmeticComparator = Comparators._arithmeticAscendingValue;

                it("should exist as a function", function () {
                    expect(arithmeticComparator).to.exist;
                    expect(_.isFunction(arithmeticComparator)).to.exist;
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

                it("should give NaN if Strings", function () {
                    expect(arithmeticComparator("A", "A")).to.be.NaN; // Nope
                });

                it("should sort Dates", function () {
                    expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 1, 2))).to.be.equal(0);

                    expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 1, 3))).not.to.be.above(0);
                    expect(arithmeticComparator(new Date(1999, 1, 2), new Date(1999, 1, 3))).to.be.below(0);
                });

                it("should give NaN if Arrays", function () {
                    expect(arithmeticComparator([ 1, 2 ], [ 2, 3 ])).to.be.NaN; // Nope
                    expect(arithmeticComparator([ 1, 2 ], [ 2, 3 ])).to.be.NaN; // Nope
                });
            });


            /* Needed?
             describe("chainableAscendingComparator", function () {
             var chainableAscendingComparator = Comparators._chainable_Ascending,
             backbonePropertyGetter = Comparators._backbonePropertyGetter,
             alwaysEqualComparator = Comparators._alwaysEqual;

             it("should exist as a function", function () {
             expect(chainableAscendingComparator).to.exist;
             expect(backbonePropertyGetter).to.exist;
             expect(alwaysEqualComparator).to.exist;
             expect(_.isFunction(chainableAscendingComparator)).to.exist;
             expect(_.isFunction(backbonePropertyGetter)).to.exist;
             expect(_.isFunction(alwaysEqualComparator)).to.exist;
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
             var coll = new Backbone.Collection([ model3, model1, model2 ], { comparator: myComparator });

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
             coll = new Backbone.Collection([ model2, model3, model1 ], { comparator: myComparator });

             expect(coll.at(0).get("myId")).to.be.equal("1");
             expect(coll.at(1).get("myId")).to.be.equal("2");
             expect(coll.at(2).get("myId")).to.be.equal("3");
             });
             });
             */


            describe("byBackbonePropertyAscending", function () {
                var ascendingByBackboneProperty = Comparators.ascendingByBackboneProperty;

                it("should exist as a function", function () {
                    expect(ascendingByBackboneProperty).to.exist;
                    expect(_.isFunction(ascendingByBackboneProperty)).to.be.true;
                });

                it("should be somewhat robust", function () {
                    var myUndefinedPropertyNamesComparator = _.partial(ascendingByBackboneProperty, undefined),
                        myNullAsPropertyNamesComparator = _.partial(ascendingByBackboneProperty, null),
                        myEmptyPropertyNamesComparator = _.partial(ascendingByBackboneProperty, []),
                        myIllegalType1PropertyNamesComparator = _.partial(ascendingByBackboneProperty, 3.14),
                        myIllegalType2PropertyNamesComparator = _.partial(ascendingByBackboneProperty, [ 3.14, new Date() ]),

                        model1 = { "myId": "1", "myNumberProperty": 1 },
                        model2 = { "myId": "2", "myNumberProperty": 2 },
                        model3 = { "myId": "3", "myNumberProperty": 3 },

                        coll1 = new Backbone.Collection([ model2, model3, model1 ], { comparator: myUndefinedPropertyNamesComparator }),
                        coll2 = new Backbone.Collection([ model2, model3, model1 ], { comparator: myNullAsPropertyNamesComparator }),
                        coll3 = new Backbone.Collection([ model2, model3, model1 ], { comparator: myEmptyPropertyNamesComparator }),
                        coll4 = new Backbone.Collection([ model2, model3, model1 ], { comparator: myIllegalType1PropertyNamesComparator }),
                        coll5 = new Backbone.Collection([ model2, model3, model1 ], { comparator: myIllegalType1PropertyNamesComparator });

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
                    var myNonArrayComparator = _.partial(ascendingByBackboneProperty, "myNumberProperty"),

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
                        coll = new Backbone.Collection([ model2, model3, model1 ], { comparator: myNonArrayComparator });

                    expect(coll.at(0).get("myId")).to.be.equal("1");
                    expect(coll.at(1).get("myId")).to.be.equal("2");
                    expect(coll.at(2).get("myId")).to.be.equal("3");
                });

                it("should sort models by single number property value", function () {
                    var myComparator = _.partial(ascendingByBackboneProperty, [ "myNumberProperty" ]),

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
                        coll = new Backbone.Collection([ model1, model3, model2 ], { comparator: myComparator });

                    expect(coll.at(0).get("myId")).to.be.equal("1");
                    expect(coll.at(1).get("myId")).to.be.equal("2");
                    expect(coll.at(2).get("myId")).to.be.equal("3");
                });

                it("should sort models", function () {
                    var myComparator = _.partial(ascendingByBackboneProperty,
                            [ "myNumberProperty", "myDateProperty", "myStringProperty", "mySecondNumberProperty" ]),
                        earlier = new Date(2014, 6, 1),
                        later = new Date(2014, 6, 2),

                        model1 = {
                            myId: "1",
                            myNumberProperty: 100,
                            mySecondNumberProperty: 100,
                            myStringProperty: "A",
                            myDateProperty: earlier
                        },
                        model2 = {
                            myId: "2",
                            myNumberProperty: 100,
                            mySecondNumberProperty: 90,
                            myStringProperty: "B",
                            myDateProperty: earlier
                        },
                        model3 = {
                            myId: "3",
                            myNumberProperty: 100,
                            mySecondNumberProperty: -100,
                            myStringProperty: "A",
                            myDateProperty: later
                        },
                        model4 = {
                            myId: "4",
                            myNumberProperty: 100,
                            mySecondNumberProperty: 10,
                            myStringProperty: "D",
                            myDateProperty: later
                        },
                        model5 = {
                            myId: "5",
                            myNumberProperty: 100,
                            mySecondNumberProperty: 11,
                            myStringProperty: "Æ",
                            myDateProperty: later
                        },
                        model6 = {
                            myId: "6",
                            myNumberProperty: 100,
                            mySecondNumberProperty: 12,
                            myStringProperty: "Æ",
                            myDateProperty: later
                        },
                        model7 = {
                            myId: "7",
                            myNumberProperty: 100,
                            mySecondNumberProperty: 1234567,
                            myStringProperty: "Æ",
                            myDateProperty: later
                        },

                        coll = new Backbone.Collection([ model3, model5, model7, model1, model6, model4, model2 ], { comparator: myComparator });

                    expect(coll.at(0).get("myId")).to.be.equal("1");
                    expect(coll.at(1).get("myId")).to.be.equal("2");
                    expect(coll.at(2).get("myId")).to.be.equal("3");
                    expect(coll.at(3).get("myId")).to.be.equal("4");
                    expect(coll.at(4).get("myId")).to.be.equal("5");
                    expect(coll.at(5).get("myId")).to.be.equal("6");
                    expect(coll.at(6).get("myId")).to.be.equal("7");
                });
            });
        });
    }
);
