/* global define:false, describe:false, before:false, beforeEach:false, afterEach:false, after:false, it:false, done:false */
/* jshint -W030, -W106 */

define([
        "chai", "sinon",
        "jquery", "underscore", "backbone",
        "app.models", "app.rating-history-collection"
    ],
    function (Chai, Sinon, $, _, Backbone, SharedRatingModel, RatingHistoryCollection) {
        "use strict";

        describe("Tippekonkurranse rankings history collection", function () {

            var expect = Chai.expect,
                sandbox,
                ajaxSpy;

            beforeEach(function () {
                sandbox = Sinon.sandbox.create({
                    properties: ["spy", "server"],
                    useFakeServer: true
                });
                sandbox.server.autoRespond = true;

                ajaxSpy = sandbox.spy();
            });

            afterEach(function () {
                sandbox.restore();
            });


            it("should be able to create Tippekonkurranse rankings history collection", function () {
                expect(new RatingHistoryCollection()).to.be.ok;
                expect(new RatingHistoryCollection()).to.be.an("Object");
                expect(new RatingHistoryCollection()).to.be.an.instanceof(Backbone.Collection);
            });


            it("should have 'year' property", function () {
                expect(new RatingHistoryCollection().year).to.be.equal(new Date().getFullYear());
                expect(new RatingHistoryCollection({ year: 1492 }).year).to.be.equal(1492);
            });


            it("should populate model via a fetch", function (done) {
                var collection = new RatingHistoryCollection({ year: 2014 });

                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    ajaxSpy(xhr, query);
                    if (query === [SharedRatingModel.resource.ratingHistory.baseUri, 2014].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": { "year": 2015, "round": 2 },
                            "scores": {
                                "john": {
                                    "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 0, "previousRating": 0
                                }
                            }
                        }));

                    } else {
                        throw new Error("Didn't expect " + query);
                    }
                    return true;
                });

                // Before fetch ...

                collection.once("reset", function () {
                    expect(ajaxSpy.calledOnce).to.be.true;


                    done();
                });

                collection.fetch({ reset: true });
            });


            it("should convert ratings history response to jqPlot data structure", function (done) {
                var collection = new RatingHistoryCollection({ year: 2014 });

                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [SharedRatingModel.resource.ratingHistory.baseUri, 2014].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify([
                                {
                                    userId: "oddvar",
                                    ratings: [33, 44, 55, 33, 33, 44, 76, 82, 83, 85, 64, 23]
                                },
                                {
                                    userId: "hans_bernhard",
                                    ratings: [3, 4, 5, 3, 3, 4, 7, 8, 8, 8, 6, 6]
                                },
                                {
                                    userId: "eirik",
                                    ratings: [8, 23, 25, 34, 39, 41, 77, 88, 88, 89, 62, 64]
                                },
                                {
                                    userId: "jan_tore",
                                    ratings: [1, 10, 5, 9, 13, 11, 6, 3, 1, 1, 2, 4]
                                }
                            ]
                        ));
                    }
                    else {
                        throw new Error("Didn't expect " + query);
                    }
                    return true;
                });

                collection.once("reset", function () {
                    expect(this.models.length).to.be.equal(4);
                    expect(this.getJqPlotSeries()).to.be.deep.equal([
                        { label: 'Jan Tore' },
                        { label: 'Hans Bernhard' },
                        { label: 'Oddvar' },
                        { label: 'Eirik' }
                    ]);
                    /*[
                     {
                     userId: "oddvar",
                     ratings: [33, 44, 55, 33, 33, 44, 76, 82, 83, 85, 64, 23]
                     },
                     {
                     userId: "hans_bernhard",
                     ratings: [3, 4, 5, 3, 3, 4, 7, 8, 8, 8, 6, 6]
                     },
                     {
                     userId: "eirik",
                     ratings: [8, 23, 25, 34, 39, 41, 77, 88, 88, 89, 62, 64]
                     },
                     {
                     userId: "jan_tore",
                     ratings: [1, 10, 5, 9, 13, 11, 6, 3, 1, 1, 2, 4]
                     }
                     ]*/
                    var jqPlotPlot = this.getJqPlotPlot();
                    expect(jqPlotPlot).to.be.an("Array");
                    expect(jqPlotPlot.length).to.be.equal(4);
                    expect(jqPlotPlot[0]).to.be.deep.equal([
                        [0, 1],
                        [1, 1],
                        [2, 10],
                        [3, 5],
                        [4, 9],
                        [5, 13],
                        [6, 11],
                        [7, 6],
                        [8, 3],
                        [9, 1],
                        [10, 1],
                        [11, 2],
                        [12, 4]
                    ]);

                    done();
                });

                collection.fetch({ reset: true });
            });
        });
    }
);
