/* global define:false, describe:false, before:false, beforeEach:false, afterEach:false, after:false, it:false, done:false */
/* jshint -W030 */

define([
        "chai", "sinon",
        "jquery", "underscore", "backbone",
        "app.models", "app.result", "app.result-collection",
        "app.results-view" // TODO: Rename to 'app.rankings-view.js'
    ],
    function (Chai, Sinon, $, _, Backbone, SharedRatingModel, RatingModel, RatingModelCollection, RankingsView) {
        "use strict";

        var expect = Chai.expect;


        describe("Tippekonkurranse rankings view", function () {

            var sandbox, ajaxSpy;

            //before(function () {
            //    console.log("before() ...");
            //});

            beforeEach(function () {
                //console.log("beforeEach() ...");
                sandbox = Sinon.sandbox.create({
                    properties: ["spy", "server"],
                    useFakeServer: true
                });
                sandbox.server.autoRespond = true;

                ajaxSpy = sandbox.spy();
            });

            afterEach(function () {
                //console.log("afterEach() ...");
                sandbox.restore();
                $("#content").empty();
            });

            //after(function () {
            //    console.log("after() ...");
            //});

            it("should expect an accompanying collection", function () {
                expect(RankingsView).to.throw(TypeError);
            });


            it("should exist", function () {
                var rankingsView = new RankingsView({ collection: new RatingModelCollection() });

                expect(rankingsView).to.exist;
                expect(rankingsView).to.be.an.instanceof(Backbone.View);
            });


            it("should render a table with proper headers when collection receives requested data (fetch)", function (done) {
                var collection = new RatingModelCollection(),
                    rankingsView = new RankingsView({
                        //el: "#content", // Show view it in 'test.amd.html' ...
                        collection: collection
                    });

                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    //console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": { "year": 2015, "round": 2 },
                            "scores": {
                                "john": {
                                    "tabell": 0, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": 0, "rating": 0, "previousRating": 0
                                }
                            }
                        }));
                        //} else {
                        //    throw new Error("Didn't expect " + query);
                    }
                    return true;
                });

                // Empty $el
                expect(rankingsView.$el.children().length).to.equal(0);
                expect(rankingsView.$("table").length).to.equal(0);

                collection.once("reset", function () {
                    expect(ajaxSpy.calledOnce).to.be.true;

                    // Table
                    expect(rankingsView.$el).to.exist;
                    expect(rankingsView.$("table").length).to.be.equal(1);
                    expect(rankingsView.$("tr").length).to.be.equal(2);

                    // Headers
                    expect(rankingsView.$("th").length).to.be.equal(11);
                    expect($(rankingsView.$("th")[0]).html()).to.be.equal("");
                    expect($(rankingsView.$("th")[1]).html()).to.be.equal("");
                    // TODO: expect($(rankingsView.$("th")[2]).find("button").html()).to.be.equal("Historikk");
                    expect($(rankingsView.$("th")[3]).html()).to.be.equal("");
                    expect($(rankingsView.$("th")[4]).find("button").html()).to.be.equal("Gjeldende resultater");
                    expect($(rankingsView.$("th")[5]).html()).to.be.equal("Tabell");
                    expect($(rankingsView.$("th")[6]).html()).to.be.equal("Pall");
                    expect($(rankingsView.$("th")[7]).html()).to.be.equal("Nedrykk");
                    expect($(rankingsView.$("th")[8]).html()).to.be.equal("Toppsk.");
                    expect($(rankingsView.$("th")[9]).html()).to.be.equal("Opprykk");
                    expect($(rankingsView.$("th")[10]).html()).to.be.equal("Cup");

                    // Empty scores
                    // TODO: expect(rankingsView.$("td").length).to.be.equal(11);
                    // TODO: expect($(rankingsView.$("td")[0]).html()).to.have.string("icon-trophy-gold");
                    // TODO: expect($(rankingsView.$("td")[1]).find("span").html()).to.be.equal("John");
                    // TODO: expect($(rankingsView.$("td")[2]).html()).to.be.equal("");
                    // TODO: expect($(rankingsView.$("td")[3]).find(".rating-tendency").prev().html()).to.be.equal("0");
                    // TODO: expect($(rankingsView.$("td")[4]).find("button").html()).to.be.equal("Johns tips");
                    // TODO: expect($(rankingsView.$("td")[5]).find("div").html()).to.be.equal("0");
                    // TODO: expect($(rankingsView.$("td")[6]).find("div").html()).to.be.equal("0");
                    // TODO: expect($(rankingsView.$("td")[7]).find("div").html()).to.be.equal("0");
                    // TODO: expect($(rankingsView.$("td")[8]).find("div").html()).to.be.equal("0");
                    // TODO: expect($(rankingsView.$("td")[9]).find("div").html()).to.be.equal("0");
                    // TODO: expect($(rankingsView.$("td")[10]).find("div").html()).to.be.equal("0");

                    done();
                });

                collection.fetch();
            });


            /* Not suited for this kind of testing due to rendering animations and whatnot ...
             it("should calculate and show rank trends from previous round", function (done) {
             var collection = new RatingModelCollection(),
             rankingsView = new RankingsView({
             el: "#content", // Show view it in 'test.amd.html' ...
             collection: collection
             });

             sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
             console.log("query:" + query);
             ajaxSpy(xhr, query);
             if (query === SharedRatingModel.resources.scores.baseUri + SharedRatingModel.resources.uri.element.current) {
             xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
             "metadata": { "year": 2014, "round": 10 },
             "scores": {
             "einar": { "tabell": 68, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": -1, "cup": -1, "rating": 66, "previousRating": 61 },
             "eirik": { "tabell": 72, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 71, "previousRating": 73 },
             "geir": { "tabell": 54, "pall": -2, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 51, "previousRating": 51 },
             "hans_bernhard": { "tabell": 84, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 83, "previousRating": 75 },
             "jan_tore": { "tabell": 62, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": -1, "cup": -1, "rating": 59, "previousRating": 50 },
             "oddgeir": { "tabell": 70, "pall": 0, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 69, "previousRating": 61 },
             "oddvar": { "tabell": 64, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 62, "previousRating": 56 },
             "ole_erik": { "tabell": 62, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": -1, "cup": -1, "rating": 59, "previousRating": 56 },
             "rikard": { "tabell": 54, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 52, "previousRating": 54 },
             "svein_tore": { "tabell": 68, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 66, "previousRating": 54 },
             "steinar": { "tabell": 58, "pall": -2, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 55, "previousRating": 49 },
             "tore": { "tabell": 56, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 54, "previousRating": 49 },
             "trond": {"tabell": 80, "pall": -1, "nedrykk": 0, "toppscorer": 0, "opprykk": 0, "cup": -1, "rating": 78, "previousRating": 74 }
             }
             }));
             //} else {
             //    throw new Error("Didn't expect " + query);
             }
             return true;
             });

             // Empty $el
             expect(rankingsView.$el.children().length).to.equal(0);
             expect(rankingsView.$("table").length).to.equal(0);

             //collection.once("reset", function () {
             rankingsView.once("rendered", function () {

             var rows = rankingsView.$("table tr");
             expect($(rows).length).to.be.equal(11);

             // #1
             var row = rankingsView.$("table tr")[1];
             expect($($(row).find("td")[0]).html()).to.have.string("icon-trophy-gold");
             expect($($(row).find("td")[1]).html()).to.have.string("Geir");

             var rankTrendIcon = $($(row).find("td")[2]).find("span.icon-up"),
             rankTrendPlaces = rankTrendIcon.siblings();
             expect(rankTrendIcon.length).to.be.equal(1);
             expect(rankTrendPlaces.html()).to.have.string("+1");

             expect($($(row).find("td")[3]).html()).to.have.string("51");

             // #2 (Not ready ...)
             row = rankingsView.$("table tr")[2];
             expect($($(row).find("td")[0]).html()).to.have.string("icon-trophy-silver");
             //expect($($(row).find("td")[1]).html()).to.have.string("Rikard");

             //rankTrendIcon = $($(row).find("td")[2]).find("span.icon-up");
             //rankTrendPlaces = rankTrendIcon.siblings();
             //expect(rankTrendIcon.length).to.be.equal(1);
             //expect(rankTrendPlaces.html()).to.have.string("+1");

             //expect($($(row).find("td")[3]).html()).to.have.string("52");

             done();
             });

             collection.fetch();
             });


             it("should calculate and show rating trends from previous round");
             */
        });
    }
);
