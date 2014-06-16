/* global define:false, describe:false, it:false */
/* jshint -W030, -W106 */

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
                expect(new ScoresModelCollection()).to.be.an.instanceof(Backbone.Collection);
            });


            it("should throw exception for parse with empty response argument", function () {
                var myScoresCollection_parse_emptyobject = _.partial(new ScoresModelCollection().parse, {});
                expect(myScoresCollection_parse_emptyobject).to.throw(TypeError);
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

                // Server-side originating properties
                expect(john.tabell).to.not.exist;
                expect(john.pall).to.not.exist;
                expect(john.nedrykk).to.not.exist;
                expect(john.toppscorer).to.not.exist;
                expect(john.opprykk).to.not.exist;
                expect(john.cup).to.not.exist;
                expect(john.rating).to.not.exist;
                expect(john.previousRating).to.not.exist;

                // TODO: NB! Round 1: no previous rating nor previous rank of any kind... copy this to an individual test?

                // Client-side originating properties
                expect(john[ScoresModel.userIdPropertyName]).to.exist;
                expect(john[ScoresModel.namePropertyName]).to.exist;
                expect(john[ScoresModel.yearPropertyName]).to.exist;
                expect(john[ScoresModel.roundPropertyName]).to.exist;
                expect(john[ScoresModel.rankPropertyName]).to.exist;
                expect(john[ScoresModel.rankPresentationPropertyName]).to.exist;
                expect(john[ScoresModel.previousRankPropertyName]).to.not.exist;

                expect(john[ScoresModel.userIdPropertyName]).to.be.a("String");
                expect(john[ScoresModel.namePropertyName]).to.be.a("String");
                expect(john[ScoresModel.yearPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.roundPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.rankPropertyName]).to.be.a("Number");
                //expect(john[ScoresModel.rankPresentationPropertyName]).to.be.a("String");
                //expect(john[ScoresModel.previousRankPropertyName]).to.be.a("Number");

                expect(john[ScoresModel.userIdPropertyName]).to.be.equal("john");
                expect(john[ScoresModel.namePropertyName]).to.be.equal("John");
                expect(john[ScoresModel.yearPropertyName]).to.be.equal(2014);
                expect(john[ScoresModel.roundPropertyName]).to.be.equal(1);
                expect(john[ScoresModel.rankPropertyName]).to.be.equal(-1);
                //expect(john[ScoresModel.rankPresentationPropertyName]).to.be.equal("");
                //expect(john[ScoresModel.previousRankPropertyName]).to.be.equal(1);
            });


            it("should create complete participant score model from participant properties in response", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2015, "round": 2 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 0, "previousRating": 0
                        }
                    }
                });

                var john = scoresCollection.models[0].toJSON();

                // Server-side originating properties
                expect(john.tabell).to.exist;
                expect(john.pall).to.exist;
                expect(john.nedrykk).to.exist;
                expect(john.toppscorer).to.exist;
                expect(john.opprykk).to.exist;
                expect(john.cup).to.exist;
                expect(john.rating).to.exist;
                expect(john.previousRating).to.exist;

                // Client-side originating properties
                expect(john[ScoresModel.userIdPropertyName]).to.exist;
                expect(john[ScoresModel.namePropertyName]).to.exist;
                expect(john[ScoresModel.yearPropertyName]).to.exist;
                expect(john[ScoresModel.roundPropertyName]).to.exist;
                expect(john[ScoresModel.rankPropertyName]).to.exist;
                expect(john[ScoresModel.rankPresentationPropertyName]).to.exist;
                expect(john[ScoresModel.previousRankPropertyName]).to.exist;

                expect(john[ScoresModel.userIdPropertyName]).to.be.a("String");
                expect(john[ScoresModel.namePropertyName]).to.be.a("String");
                expect(john[ScoresModel.yearPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.roundPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.rankPropertyName]).to.be.a("Number");
                expect(john[ScoresModel.rankPresentationPropertyName]).to.be.a("String");
                expect(john[ScoresModel.previousRankPropertyName]).to.be.a("Number");

                expect(john[ScoresModel.userIdPropertyName]).to.be.equal("john");
                expect(john[ScoresModel.namePropertyName]).to.be.equal("John");
                expect(john[ScoresModel.yearPropertyName]).to.be.equal(2015);
                expect(john[ScoresModel.roundPropertyName]).to.be.equal(2);
                expect(john[ScoresModel.rankPropertyName]).to.be.equal(1);
                expect(john[ScoresModel.rankPresentationPropertyName]).to.be.equal("<span class='icon-trophy-gold'></span>");
                expect(john[ScoresModel.previousRankPropertyName]).to.be.equal(1);
            });


            it("should rank/sort participants by rating", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2016, "round": 3 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 2, "previousRating": 0
                        },
                        "paul": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 1, "previousRating": 0
                        }
                    }
                });

                var john = scoresCollection.findWhere({ userId: "john" }).toJSON();
                var paul = scoresCollection.findWhere({ userId: "paul" }).toJSON();

                expect(john.rank).to.be.equal(2);
                expect(paul.rank).to.be.equal(1);
            });


            it("should rank/sort participants by rating, then by name", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2017, "round": 4 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 100, "previousRating": 20
                        },
                        "paul": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 100, "previousRating": 30
                        }
                    }
                });

                var first = scoresCollection.models[0].toJSON();
                var second = scoresCollection.models[1].toJSON();

                expect(first.rank).to.be.equal(1);
                expect(second.rank).to.be.equal(1);
                expect(first.name).to.be.equal("John");
                expect(second.name).to.be.equal("Paul");
            });


            it("should calculate previous rank as well", function () {
                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse({
                    "metadata": { "year": 2018, "round": 5 },
                    "scores": {
                        "john": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 10, "previousRating": 22
                        },
                        "paul": {
                            "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 20, "previousRating": 11
                        }
                    }
                });

                var john = scoresCollection.findWhere({ userId: "john" }).toJSON();
                var paul = scoresCollection.findWhere({ userId: "paul" }).toJSON();

                expect(john.previousRating).to.be.equal(22);
                expect(paul.previousRating).to.be.equal(11);

                expect(john.previousRank).to.be.equal(2);
                expect(paul.previousRank).to.be.equal(1);
            });


            it("should rank/sort real-life participant scores response", function () {
                var response = {
                    "metadata": { "year": 2014, "round": 3 },
                    "scores": {
                        "einar": {
                            "tabell": 66, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 64, "previousRating": 85
                        },
                        "eirik": {
                            "tabell": 92, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 91, "previousRating": 97
                        },
                        "geir": {
                            "tabell": 68, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 67, "previousRating": 79
                        },
                        "hans_bernhard": {
                            "tabell": 84, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 82, "previousRating": 101
                        },
                        "jan_tore": {
                            "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 69, "previousRating": 85
                        },
                        "oddgeir": {
                            "tabell": 70, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 68, "previousRating": 83
                        },
                        "oddvar": {
                            "tabell": 66, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 65, "previousRating": 89
                        },
                        "ole_erik": {
                            "tabell": 74, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 73, "previousRating": 91
                        },
                        "rikard": {
                            "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 69, "previousRating": 77
                        },
                        "svein_tore": {
                            "tabell": 72, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 71, "previousRating": 81
                        },
                        "steinar": {
                            "tabell": 68, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 67, "previousRating": 95
                        },
                        "tore": {
                            "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 69, "previousRating": 77
                        },
                        "trond": {
                            "tabell": 72, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 71, "previousRating": 99
                        }
                    }
                };

                var scoresCollection = new ScoresModelCollection();

                scoresCollection.parse(response);

                var first = scoresCollection.at(0).toJSON();
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

                scoresCollection.comparator = scoresCollection.sortByPreviousRatingThenName;
                scoresCollection.sort();

                first = scoresCollection.models[0].toJSON();
                second = scoresCollection.models[1].toJSON();
                third = scoresCollection.models[2].toJSON();
                forth = scoresCollection.models[3].toJSON();
                fifth = scoresCollection.models[4].toJSON();
                sixth = scoresCollection.models[5].toJSON();
                seventh = scoresCollection.models[6].toJSON();
                eighth = scoresCollection.models[7].toJSON();
                ninth = scoresCollection.models[8].toJSON();
                tenth = scoresCollection.models[9].toJSON();
                eleventh = scoresCollection.models[10].toJSON();
                twelfth = scoresCollection.models[11].toJSON();
                thirteenth = scoresCollection.models[12].toJSON();

                expect(first.name).to.be.equal("Rikard");
                expect(second.name).to.be.equal("Tore");
                expect(third.name).to.be.equal("Geir");
                expect(forth.name).to.be.equal("Svein Tore");
                expect(fifth.name).to.be.equal("Oddgeir");
                expect(sixth.name).to.be.equal("Einar");
                expect(seventh.name).to.be.equal("Jan Tore");
                expect(eighth.name).to.be.equal("Oddvar");
                expect(ninth.name).to.be.equal("Ole Erik");
                expect(tenth.name).to.be.equal("Steinar");
                expect(eleventh.name).to.be.equal("Eirik");
                expect(twelfth.name).to.be.equal("Trond");
                expect(thirteenth.name).to.be.equal("Hans Bernhard");
            });
        });
    }
);
