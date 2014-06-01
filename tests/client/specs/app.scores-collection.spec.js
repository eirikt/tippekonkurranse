/* global define:false, describe:false, it:false */
/* jshint -W030, -W106, -W071 */

define([
        "jquery", "underscore", "backbone", "chai",
        "app.models", "app.result", "app.result-collection"
    ],
    function ($, _, Backbone, Chai, SharedScoresModel, ScoresModel, ScoresModelCollection) {
        "use strict";

        var expect = Chai.expect;

        describe("Tippekonkurranse scores collection", function () {

            it("should be able to create Tippekonkurranse participant scores collection", function () {
                expect(new ScoresModelCollection()).to.be.ok;
                expect(new ScoresModelCollection()).to.be.an("Object");
            });


            it("should throw exception for parse with no response arguments", function () {
                expect(new ScoresModelCollection().parse).to.throw(TypeError, "\'undefined\' is not an object (evaluating \'a.scores\'");
            });


            it("should throw exception for parse with null response argument", function () {
                var myScoresCollection_parse_null = _.partial(new ScoresModelCollection().parse, null);
                expect(myScoresCollection_parse_null).to.throw(TypeError, "\'null\' is not an object (evaluating \'a.scores\'");
            });


            it("should throw exception for parse with empty response argument", function () {
                var myScoresCollection_parse_emptyobject = _.partial(new ScoresModelCollection().parse, {});
                expect(myScoresCollection_parse_emptyobject).to.throw(TypeError, "\'undefined' is not an object (evaluating 'a.metadata.round')");
            });


            it("should create empty models array for parse with empty properties in response", function () {
                var invalidResponse = {
                        "metadata": {},
                        "scores": {}
                    },
                    scoresCollection = new ScoresModelCollection();

                scoresCollection.parse(invalidResponse);

                expect(scoresCollection.models).to.be.an("Array");
                expect(scoresCollection.models.length).to.equal(0);
            });


            it("should create default participant score models with empty participant properties in response", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2014, "round": 1 },
                    "scores": {
                        "john": {}
                    }
                });

                expect(scoresCollection.models).to.be.an("Array");
                expect(scoresCollection.models.length).to.equal(1);

                var john = scoresCollection.models[0];
                expect(john).to.be.an("Object");
                expect(john).to.be.an.instanceof(Backbone.Model);

                john = john.toJSON();
                expect(john).to.be.an("Object");
                expect(john).to.not.be.an.instanceof(Backbone.Model);

                expect(john.tabell).to.not.exist;
                expect(john.pall).to.not.exist;
                expect(john.nedrykk).to.not.exist;
                expect(john.toppscorer).to.not.exist;
                expect(john.opprykk).to.not.exist;
                expect(john.cup).to.not.exist;
                expect(john.sum).to.not.exist;
                expect(john.previousSum).to.not.exist;

                expect(john[ScoresModel.userIdPropertyName]).to.exist;
                expect(john[ScoresModel.namePropertyName]).to.exist;
                expect(john[ScoresModel.yearPropertyName]).to.exist;
                expect(john[ScoresModel.roundPropertyName]).to.exist;
                expect(john[ScoresModel.ratingPropertyName]).to.exist;
                expect(john[ScoresModel.ratingNumberPropertyName]).to.exist;

                expect(john[ScoresModel.userIdPropertyName]).to.be.a("String");
                expect(john[ScoresModel.namePropertyName]).to.be.a("String");
                expect(john[ScoresModel.yearPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.roundPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.ratingPropertyName]).to.be.a("String");
                expect(john[ScoresModel.ratingNumberPropertyName]).to.be.a("Number");

                expect(john[ScoresModel.userIdPropertyName]).to.be.equal("john");
                expect(john[ScoresModel.namePropertyName]).to.be.equal("John");
                expect(john[ScoresModel.yearPropertyName]).to.be.equal(2014);
                expect(john[ScoresModel.roundPropertyName]).to.be.equal(1);
                expect(john[ScoresModel.ratingPropertyName]).to.be.equal("");
                expect(john[ScoresModel.ratingNumberPropertyName]).to.be.equal(1);
            });


            it("should create complete participant score model from participant properties in response", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2015, "round": 2 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 0, "previousSum": 0
                        }
                    }
                });

                var john = scoresCollection.models[0].toJSON();

                expect(john.tabell).to.exist;
                expect(john.pall).to.exist;
                expect(john.nedrykk).to.exist;
                expect(john.toppscorer).to.exist;
                expect(john.opprykk).to.exist;
                expect(john.cup).to.exist;
                expect(john.sum).to.exist;
                expect(john.previousSum).to.exist;

                expect(john[ScoresModel.userIdPropertyName]).to.exist;
                expect(john[ScoresModel.namePropertyName]).to.exist;
                expect(john[ScoresModel.yearPropertyName]).to.exist;
                expect(john[ScoresModel.roundPropertyName]).to.exist;
                expect(john[ScoresModel.ratingPropertyName]).to.exist;
                expect(john[ScoresModel.ratingNumberPropertyName]).to.exist;
                expect(john[ScoresModel.previousRatingNumberPropertyName]).to.exist;

                expect(john[ScoresModel.userIdPropertyName]).to.be.a("String");
                expect(john[ScoresModel.namePropertyName]).to.be.a("String");
                expect(john[ScoresModel.yearPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.roundPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.ratingPropertyName]).to.be.a("String");
                expect(john[ScoresModel.ratingNumberPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.previousRatingNumberPropertyName]).to.be.a("Number");

                expect(john[ScoresModel.userIdPropertyName]).to.be.equal("john");
                expect(john[ScoresModel.namePropertyName]).to.be.equal("John");
                expect(john[ScoresModel.yearPropertyName]).to.be.equal(2015);
                expect(john[ScoresModel.roundPropertyName]).to.be.equal(2);
                expect(john[ScoresModel.ratingPropertyName]).to.be.equal("");
                expect(john[ScoresModel.ratingNumberPropertyName]).to.be.equal(1);
                expect(john[ScoresModel.previousRatingNumberPropertyName]).to.be.equal(1);
            });


            it("should sort participants by rating", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2016, "round": 3 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 2, "previousSum": 0
                        },
                        "paul": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 1, "previousSum": 0
                        }
                    }
                });

                var john = scoresCollection.findWhere({ userId: "john" }).toJSON();
                var paul = scoresCollection.findWhere({ userId: "paul" }).toJSON();

                expect(john.ratingNumber).to.be.equal(2);
                expect(paul.ratingNumber).to.be.equal(1);
            });


            it("should sort participants by rating, then by name", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2017, "round": 4 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 100, "previousSum": 200
                        },
                        "paul": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 100, "previousSum": 200
                        }
                    }
                });

                var first = scoresCollection.models[0].toJSON();
                var second = scoresCollection.models[1].toJSON();

                expect(first.ratingNumber).to.be.equal(1);
                expect(second.ratingNumber).to.be.equal(1);
                expect(first.name).to.be.equal("John");
                expect(second.name).to.be.equal("Paul");
            });


            it("should calculate previous rating", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2018, "round": 5 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 0, "previousSum": 22
                        },
                        "paul": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "sum": 0, "previousSum": 11
                        }
                    }
                });

                var john = scoresCollection.findWhere({ userId: "john" }).toJSON();
                var paul = scoresCollection.findWhere({ userId: "paul" }).toJSON();

                expect(john.previousSum).to.be.equal(22);
                expect(paul.previousSum).to.be.equal(11);

                expect(john.previousRatingNumber).to.be.equal(2);
                expect(paul.previousRatingNumber).to.be.equal(1);
            });


            it("should rate real-life participant scores response", function () {
                var response = {
                    "scores": {
                        "einar": {
                            "tabell": 66, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 64, "previousSum": 85
                        },
                        "eirik": {
                            "tabell": 92, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 91, "previousSum": 97
                        },
                        "geir": {
                            "tabell": 68, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 67, "previousSum": 79
                        },
                        "hansbernhard": {
                            "tabell": 84, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 82, "previousSum": 101
                        },
                        "jantore": {
                            "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 69, "previousSum": 85
                        },
                        "oddgeir": {
                            "tabell": 70, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 68, "previousSum": 83
                        },
                        "oddvar": {
                            "tabell": 66, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 65, "previousSum": 89
                        },
                        "oleerik": {
                            "tabell": 74, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 73, "previousSum": 91
                        },
                        "rikard": {
                            "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 69, "previousSum": 77
                        },
                        "sveintore": {
                            "tabell": 72, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 71, "previousSum": 81
                        },
                        "steinar": {
                            "tabell": 68, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 67, "previousSum": 95
                        },
                        "tore": {
                            "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 69, "previousSum": 77
                        },
                        "trond": {
                            "tabell": 72, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "sum": 71, "previousSum": 99
                        }
                    },
                    "metadata": { "year": 2014, "round": 3 }
                };

                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse(response);

                var first = scoresCollection.models[0].toJSON();
                var second = scoresCollection.models[1].toJSON();
                var third = scoresCollection.models[2].toJSON();
                var forth = scoresCollection.models[3].toJSON();
                var fifth = scoresCollection.models[4].toJSON();
                var sixth = scoresCollection.models[5].toJSON();
                var seventh = scoresCollection.models[6].toJSON();
                var eighth = scoresCollection.models[7].toJSON();
                var ninth = scoresCollection.models[8].toJSON();
                var tenth = scoresCollection.models[9].toJSON();
                var eleventh = scoresCollection.models[10].toJSON();
                var twelfth = scoresCollection.models[11].toJSON();
                var thirteenth = scoresCollection.models[12].toJSON();

                expect(first.name).to.be.equal("Einar");
                expect(second.name).to.be.equal("Oddvar");
                expect(third.name).to.be.equal("Geir");
                expect(forth.name).to.be.equal("Steinar");
                expect(fifth.name).to.be.equal("Oddgeir");
                expect(sixth.name).to.be.equal("Jan Tore");
                expect(seventh.name).to.be.equal("Rikard");
                expect(eighth.name).to.be.equal("Tore");
                expect(ninth.name).to.be.equal("Svein Tore");
                expect(tenth.name).to.be.equal("Trond");
                expect(eleventh.name).to.be.equal("Ole Erik");
                expect(twelfth.name).to.be.equal("Hans Bernhard");
                expect(thirteenth.name).to.be.equal("Eirik");
            });
        });
    }
);
