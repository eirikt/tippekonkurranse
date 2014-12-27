/* global define:false, describe:false, before:false, beforeEach:false, afterEach:false, after:false, it:false, done:false */
/* jshint -W030 */
define([
        "chai", "sinon",
        "jquery", "underscore", "backbone", "marionette",
        "app.models", "app.result", "app.result-collection",
        "app.results-view" // TODO: Rename to 'app.ratings-view.js' or 'app.scores-view.js' ?
    ],
    function (Chai, Sinon, $, _, Backbone, Marionette, SharedRatingModel, RatingModel, RatingModelCollection, RatingsView) {
        "use strict";

        var expect = Chai.expect;


        describe("Tippekonkurranse scores view", function () {

            var sandbox, ajaxSpy;


            beforeEach(function () {
                sandbox = Sinon.sandbox.create({
                    properties: [ "spy", "server" ],
                    useFakeServer: true
                });
                sandbox.server.autoRespond = true;

                ajaxSpy = sandbox.spy();
            });

            afterEach(function () {
                sandbox.restore();
                $("#content").empty();
            });


            it("should be a Marionette CollectionView", function () {
                var ratingsView = new RatingsView({ collection: new RatingModelCollection() });
                expect(ratingsView).to.exist;
                expect(ratingsView).to.be.an.instanceof(Marionette.CollectionView);
            });


            it("should expect an accompanying collection", function () {
                expect(RatingsView).to.throw(TypeError);
            });


            it("should render a table with proper headers", function () {
                var ratingCollection = new RatingModelCollection(),
                    ratingsView = new RatingsView({
                        // Uncomment if viewing it (with the help of a breakpoint) in 'test.amd.html'
                        //el: "#content",
                        model: new Backbone.Model(),
                        collection: ratingCollection
                    });

                // Empty $el
                expect(ratingsView.$el).to.exist;
                expect(ratingsView.$el.children().length).to.equal(0);
                expect(ratingsView.$("thead").length).to.equal(0);

                ratingsView.render();

                // Table rows
                expect(ratingsView.$el).to.exist;
                expect(ratingsView.$("thead").length).to.be.equal(1);
                expect(ratingsView.$("tr").length).to.be.equal(1);

                // Headers
                expect(ratingsView.$("th").length).to.be.equal(11);
                expect($(ratingsView.$("th")[ 0 ]).html()).to.be.equal("");
                expect($(ratingsView.$("th")[ 1 ]).html()).to.be.equal("");
                expect($(ratingsView.$("th")[ 2 ]).html()).to.be.equal("");
                expect($(ratingsView.$("th")[ 3 ]).find(".icon-line-chart")).to.exist;
                expect($(ratingsView.$("th")[ 3 ]).find("a").html()).to.have.string("Trend");
                expect($(ratingsView.$("th")[ 4 ]).find("button").html()).to.be.equal("Gjeldende resultater");
                expect($(ratingsView.$("th")[ 5 ]).html()).to.be.equal("Tabell");
                expect($(ratingsView.$("th")[ 6 ]).html()).to.be.equal("Pall");
                expect($(ratingsView.$("th")[ 7 ]).html()).to.be.equal("Nedrykk");
                expect($(ratingsView.$("th")[ 8 ]).html()).to.be.equal("Toppsk.");
                expect($(ratingsView.$("th")[ 9 ]).html()).to.be.equal("Opprykk");
                expect($(ratingsView.$("th")[ 10 ]).html()).to.be.equal("Cup");
            });


            it("should render a default scores row", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    //console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [ SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current ].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": { "year": 2017, "round": 22 },
                            "scores": {
                                "john": {
                                    "tabell": 0,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": 0,
                                    "rating": 0,
                                    "previousRating": 0
                                }
                            }
                        }));
                    } else {
                        throw new Error("Didn't expect " + query);
                    }
                    return true;
                });

                var ratingCollection = new RatingModelCollection(),
                    ratingsView = new RatingsView({
                        // Uncomment if viewing it (with the help of a breakpoint) in 'test.amd.html'
                        //el: "#content",
                        model: new Backbone.Model(),
                        collection: ratingCollection
                    });

                Backbone.listenTo(ratingCollection, "reset", ratingsView.render);

                // Empty $el
                expect(ratingsView.$el).to.exist;
                expect(ratingsView.$el.children().length).to.equal(0);
                expect(ratingsView.$("tbody").length).to.equal(0);

                ratingsView.on("render", function () {
                    expect(ajaxSpy.calledOnce).to.be.true;

                    // Table rows
                    expect(ratingsView.$el).to.exist;
                    expect(ratingsView.$("tbody").length).to.be.equal(1);
                    expect(ratingsView.$("tr").length).to.be.equal(2);

                    // Empty scores
                    expect(ratingsView.$("td").length).to.be.equal(12);
                    expect($(ratingsView.$("td")[ 0 ]).html()).to.have.string("icon-trophy-gold");
                    expect($(ratingsView.$("td")[ 1 ]).find("span").html()).to.be.equal("John");
                    expect($(ratingsView.$("td")[ 2 ]).html()).to.be.equal('<span class="tendency-arrow"></span><small>&nbsp;</small>');
                    expect($(ratingsView.$("td")[ 3 ]).html()).to.be.equal("");
                    expect($(ratingsView.$("td")[ 4 ]).find(".rating-tendency").prev().html()).to.be.equal("0");
                    expect($(ratingsView.$("td")[ 5 ]).find("button").html()).to.have.string("Johns tips");
                    expect($(ratingsView.$("td")[ 6 ]).html()).to.be.equal("0");
                    expect($(ratingsView.$("td")[ 7 ]).html()).to.be.equal("0");
                    expect($(ratingsView.$("td")[ 8 ]).html()).to.be.equal("0");
                    expect($(ratingsView.$("td")[ 9 ]).html()).to.be.equal("0");
                    expect($(ratingsView.$("td")[ 10 ]).html()).to.be.equal("0");
                    expect($(ratingsView.$("td")[ 11 ]).html()).to.be.equal("0");

                    done();
                });

                ratingCollection.fetch();
            });


            it("should calculate and show rank trends from previous round", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    //console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [ SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current ].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": { "year": 2016, "round": 10 },
                            "scores": {
                                "einar": {
                                    "tabell": 68,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": -1,
                                    "cup": -1,
                                    "rating": 66,
                                    "previousRating": 61
                                },
                                "eirik": {
                                    "tabell": 72,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 71,
                                    "previousRating": 73
                                },
                                "geir": {
                                    "tabell": 54,
                                    "pall": -2,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 51,
                                    "previousRating": 51
                                },
                                "hans_bernhard": {
                                    "tabell": 84,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 83,
                                    "previousRating": 75
                                },
                                "jan_tore": {
                                    "tabell": 62,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": -1,
                                    "cup": -1,
                                    "rating": 59,
                                    "previousRating": 50
                                },
                                "oddgeir": {
                                    "tabell": 70,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 69,
                                    "previousRating": 61
                                },
                                "oddvar": {
                                    "tabell": 64,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 62,
                                    "previousRating": 56
                                },
                                "ole_erik": {
                                    "tabell": 62,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": -1,
                                    "cup": -1,
                                    "rating": 59,
                                    "previousRating": 56
                                },
                                "rikard": {
                                    "tabell": 54,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 52,
                                    "previousRating": 54
                                },
                                "svein_tore": {
                                    "tabell": 68,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 66,
                                    "previousRating": 54
                                },
                                "steinar": {
                                    "tabell": 58,
                                    "pall": -2,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 55,
                                    "previousRating": 49
                                },
                                "tore": {
                                    "tabell": 56,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 54,
                                    "previousRating": 49
                                },
                                "trond": {
                                    "tabell": 80,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -1,
                                    "rating": 78,
                                    "previousRating": 74
                                }
                            }
                        }));
                    } else {
                        throw new Error("Didn't expect " + query);
                    }
                    return true;
                });

                var ratingCollection = new RatingModelCollection(),
                    ratingsView = new RatingsView({
                        // Uncomment if viewing it (with the help of a breakpoint) in 'test.amd.html'
                        //el: "#content",
                        model: new Backbone.Model(),
                        collection: ratingCollection
                    });

                Backbone.listenTo(ratingCollection, "reset", ratingsView.render);

                // Empty $el
                expect(ratingsView.$el).to.exist;
                expect(ratingsView.$el.children().length).to.equal(0);
                expect(ratingsView.$("tbody").length).to.equal(0);

                ratingsView.on("render", function () {

                    // Table rows
                    expect(ratingsView.$el).to.exist;
                    expect(ratingsView.$("tbody").length).to.be.equal(1);
                    var rows = ratingsView.$("tr");
                    //expect($(rows).length).to.be.equal(14);
                    expect(rows.length).to.be.equal(14);

                    // #1 (Upward PLUS trending, 3 notches)
                    var $row = $(rows[ 1 ]);
                    expect($($row.find("td")[ 0 ]).html()).to.have.string("icon-trophy-gold");
                    expect($($row.find("td")[ 1 ]).html()).to.have.string("Geir");

                    var rankTrendIcon = $($row.find("td")[ 2 ]).find("span.icon-up-plus"),
                        rankTrendPlaces = rankTrendIcon.siblings();
                    expect(rankTrendIcon.length).to.be.equal(1);
                    expect(rankTrendPlaces.html()).to.have.string("+3");
                    expect($($row.find("td")[ 4 ]).html()).to.have.string("51");

                    // #2
                    $row = $(rows[ 2 ]);
                    expect($($row.find("td")[ 0 ]).html()).to.have.string("icon-trophy-silver");
                    expect($($row.find("td")[ 1 ]).html()).to.have.string("Rikard");

                    rankTrendIcon = $($row.find("td")[ 2 ]).find("span.icon-up-plus");
                    rankTrendPlaces = rankTrendIcon.siblings();
                    expect(rankTrendIcon.length).to.be.equal(1);
                    expect(rankTrendPlaces.html()).to.have.string("+3");
                    expect($($row.find("td")[ 4 ]).html()).to.have.string("52");
                    expect($($row.find("td")[ 4 ]).html()).to.have.string("(-2p)");

                    // #3
                    $row = $(rows[ 3 ]);
                    expect($($row.find("td")[ 0 ]).html()).to.have.string("icon-trophy-bronze");
                    expect($($row.find("td")[ 1 ]).html()).to.have.string("Tore");

                    rankTrendIcon = $($row.find("td")[ 2 ]).find("span.icon-down-plus");
                    rankTrendPlaces = rankTrendIcon.siblings();
                    expect(rankTrendIcon.length).to.be.equal(1);
                    expect(rankTrendPlaces.html()).to.have.string("-2");
                    expect($($row.find("td")[ 4 ]).html()).to.have.string("54");
                    expect($($row.find("td")[ 4 ]).html()).to.have.string("(+5p)");

                    done();
                });

                ratingCollection.fetch();
            });


            // TODO: ?
            it("should calculate and show rating trends from previous round");
        });
    }
);
