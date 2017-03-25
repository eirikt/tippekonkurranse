/* global define:false, describe:false, before:false, beforeEach:false, afterEach:false, after:false, it:false, done:false */
/* jshint -W030 */
define([
        "chai", "sinon",
        "jquery", "underscore", "backbone", "marionette",
        "app.models", "app.result", "app.result-collection",
        "app.scores-table-view"
    ],
    function (Chai, Sinon, $, _, Backbone, Marionette, SharedRatingModel, RatingModel, RatingModelCollection, RatingsView) {
        "use strict";

        var expect = Chai.expect;


        describe("Tippekonkurranse scores table view", function () {

            var sandbox, ajaxSpy;


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
                $("#content").empty();
            });


            it("should be a Marionette CollectionView", function () {
                var ratingsView = new RatingsView({collection: new RatingModelCollection()});
                expect(ratingsView).to.exist;
                expect(ratingsView).to.be.an.instanceof(Marionette.CollectionView);
            });


            it("should expect an accompanying collection", function () {
                expect(RatingsView).to.throw(TypeError);
            });


            it("should render a flexbox reflecting a collection", function () {
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

                ratingsView.render();

                // Still empty $el
                expect(ratingsView.$el).to.exist;
                expect(ratingsView.$el.children().length).to.equal(0);
            });


            it("should render a default row", function () {
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

                ratingsView.render();

                // Client-side responsibility: Add nothing
                ratingsView.collection.unshift();

                // Table header row
                expect(ratingsView.$("div.participant").length).to.be.equal(0);

                // Table header row cells
                expect(ratingsView.$("div.participant").children().length).to.equal(0);


                // Client-side responsibility: Add empty model => header row
                ratingsView.collection.unshift(new Backbone.Model({}));

                // Table header row
                expect(ratingsView.$("div.participant").length).to.be.equal(1);

                // Table header row cells
                expect(ratingsView.$("div.participant").children().length).to.equal(11);

                // Table header row
                expect(ratingsView.$("div.participant").length).to.be.equal(1);

                // Table header row cells
                expect(ratingsView.$("div.participant").children().length).to.equal(11);
                expect(ratingsView.$("div.participant").find("div.scores-table-header-row").length).to.be.equal(5);

                expect(ratingsView.$("div.rank").html()).to.be.equal("");
                expect(ratingsView.$("div.name").html()).to.be.equal("");
                expect(ratingsView.$("div.rank-trend").html()).to.be.equal("");

                expect(ratingsView.$("div.rating").find("a.btn").length).to.equal(1);
                expect(ratingsView.$("div.rating").find("a.btn > span.icon-line-chart").length).to.equal(1);
                expect(ratingsView.$("div.rating").find("a.btn").html()).to.contain("Trend");

                expect(ratingsView.$("div.rating-trend").html()).to.be.equal("");

                expect(ratingsView.$("div.current-results").find("button.btn").length).to.equal(1);
                expect(ratingsView.$("div.current-results").find("button.btn").html()).to.be.equal("Gjeldende resultater");

                expect(ratingsView.$("div.tabell-score > span").html()).to.be.equal("Tabell");
                expect(ratingsView.$("div.pall-score > span").html()).to.be.equal("Pall");
                expect(ratingsView.$("div.toppscorer-score > span").html()).to.be.equal("Toppsk.");
                expect(ratingsView.$("div.opprykk-score > span").html()).to.be.equal("Opprykk");
                expect(ratingsView.$("div.cup-score > span").html()).to.be.equal("Cup");
            });


            it("should render a flexbox table with header row", function () {
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

                ratingsView.render();

                // Client-side responsibility: Add app model as header row (missing 'rating' property)
                ratingsView.collection.unshift(new Backbone.Model({
                    initialYear: 2014,
                    initialRound: 1,
                    year: null,
                    round: null,
                    currentYear: null,
                    currentRound: null,
                    currentEliteserieSeasonStartDate: null,
                    currentEliteserieSeasonHasStarted: null
                }));

                // Table header row
                expect(ratingsView.$("div.participant").length).to.be.equal(1);

                // Table header row cells
                expect(ratingsView.$("div.participant").children().length).to.equal(11);
                expect(ratingsView.$("div.participant").find("div.scores-table-header-row").length).to.be.equal(5);

                expect(ratingsView.$("div.rank").html()).to.be.equal("");
                expect(ratingsView.$("div.name").html()).to.be.equal("");
                expect(ratingsView.$("div.rank-trend").html()).to.be.equal("");

                expect(ratingsView.$("div.rating").find("a.btn").length).to.equal(1);
                expect(ratingsView.$("div.rating").find("a.btn > span.icon-line-chart").length).to.equal(1);
                expect(ratingsView.$("div.rating").find("a.btn").html()).to.contain("Trend");

                expect(ratingsView.$("div.rating-trend").html()).to.be.equal("");

                expect(ratingsView.$("div.current-results").find("button.btn").length).to.equal(1);
                expect(ratingsView.$("div.current-results").find("button.btn").html()).to.be.equal("Gjeldende resultater");

                expect(ratingsView.$("div.tabell-score > span").html()).to.be.equal("Tabell");
                expect(ratingsView.$("div.pall-score > span").html()).to.be.equal("Pall");
                expect(ratingsView.$("div.toppscorer-score > span").html()).to.be.equal("Toppsk.");
                expect(ratingsView.$("div.opprykk-score > span").html()).to.be.equal("Opprykk");
                expect(ratingsView.$("div.cup-score > span").html()).to.be.equal("Cup");
            });


            it("should render a default participant scores row", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current].join("/")) {
                        xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify({
                            "metadata": {
                                "year": 2017,
                                "round": 22,
                                "hasPredictions": {}
                            },
                            "scores": {
                                // Participant: Having 'rating' property > 0
                                "john": {
                                    "tabell": 0,
                                    "pall": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": 0,
                                    "rating": 1,
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

                ratingsView.on("render", function () {
                    expect(ajaxSpy.calledOnce).to.be.true;

                    // Table default participant row
                    expect(ratingsView.$("div.participant").length).to.be.equal(1);

                    // Table default participant row cells
                    expect(ratingsView.$("div.participant").children().length).to.equal(11);
                    expect(ratingsView.$("div.participant").find("div.scores-table-header-row").length).to.be.equal(0);

                    expect(ratingsView.$("div.rank > span").hasClass("icon-trophy-gold")).to.be.true;
                    expect(ratingsView.$("div.name").html()).to.be.equal("John");
                    expect(ratingsView.$("div.rank-trend > span").hasClass("tendency-arrow")).to.be.true;

                    expect(ratingsView.$("div.rating").html()).to.equal("1");

                    expect(ratingsView.$("div.rating-trend > small").length).to.equal(1);
                    expect(ratingsView.$("div.rating-trend > small").html()).to.be.equal("");

                    expect(ratingsView.$("div.current-results").length).to.equal(0);
                    expect(ratingsView.$("div.prediction").find("button.btn").html()).to.be.equal("Johns tips");

                    expect(ratingsView.$("div.tabell-score").html()).to.be.equal("0");
                    expect(ratingsView.$("div.pall-score").html()).to.be.equal("0");
                    expect(ratingsView.$("div.toppscorer-score").html()).to.be.equal("0");
                    expect(ratingsView.$("div.opprykk-score").html()).to.be.equal("0");
                    expect(ratingsView.$("div.cup-score").html()).to.be.equal("0");

                    done();
                });

                ratingCollection.fetch();
            });


            it("should calculate and show rank trends from previous round", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current].join("/")) {
                        xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify({
                            "metadata": {
                                "year": 2016,
                                "round": 10,
                                "hasPredictions": {}
                            },
                            // 13 Participants: Having 'rating' property > 0
                            // Client side does not calculate anything, except sort for rank
                            "scores": {
                                "einar": {
                                    "tabell": 68,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": -3,
                                    "cup": -5,
                                    "rating": 66,
                                    "previousRating": 61
                                },
                                "eirik": {
                                    "tabell": 72,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 67,
                                    "previousRating": 73
                                },
                                "geir": {
                                    "tabell": 54,
                                    "pall": -2,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 47,
                                    "previousRating": 51
                                },
                                "hans_bernhard": {
                                    "tabell": 84,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 79,
                                    "previousRating": 75
                                },
                                "jan_tore": {
                                    "tabell": 62,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": -3,
                                    "cup": -5,
                                    "rating": 53,
                                    "previousRating": 50
                                },
                                "oddgeir": {
                                    "tabell": 70,
                                    "pall": 0,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 65,
                                    "previousRating": 61
                                },
                                "oddvar": {
                                    "tabell": 64,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 58,
                                    "previousRating": 56
                                },
                                "ole_erik": {
                                    "tabell": 62,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": -3,
                                    "cup": -5,
                                    "rating": 53,
                                    "previousRating": 56
                                },
                                "rikard": {
                                    "tabell": 54,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 48,
                                    "previousRating": 54
                                },
                                "svein_tore": {
                                    "tabell": 68,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 62,
                                    "previousRating": 54
                                },
                                "steinar": {
                                    "tabell": 58,
                                    "pall": -2,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 51,
                                    "previousRating": 49
                                },
                                "tore": {
                                    "tabell": 56,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 50,
                                    "previousRating": 49
                                },
                                "trond": {
                                    "tabell": 80,
                                    "pall": -1,
                                    "nedrykk": 0,
                                    "toppscorer": 0,
                                    "opprykk": 0,
                                    "cup": -5,
                                    "rating": 74,
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
                        el: "#content",
                        model: new Backbone.Model(),
                        collection: ratingCollection
                    });

                Backbone.listenTo(ratingCollection, "reset", ratingsView.render);

                /* jshint -W071 */
                ratingsView.on("render", function () {

                    // Table participant rows
                    var participants = ratingsView.$("div.participant");

                    expect(participants.length).to.be.equal(13);

                    // #1 (Upward PLUS trending, 3 notches)
                    var no1 = participants.get(0);
                    expect($(no1).children().length).to.be.equal(11);

                    expect($(no1).find("div.rank > span").hasClass("icon-trophy-gold")).to.be.true;
                    expect($(no1).find("div.name").html()).to.equal("Geir");
                    expect($(no1).find("div.rank-trend > span").hasClass("icon-up-plus")).to.be.true;
                    expect($(no1).find("div.rank-trend > small").html()).to.equal("&nbsp;+3");

                    expect($(no1).find("div.rating").html()).to.equal("47");

                    expect($(no1).find("div.rating-trend > small").length).to.equal(1);
                    expect($(no1).find("div.rating-trend > small").html()).to.equal("(-4p)");

                    expect($(no1).find("div.current-results").length).to.equal(0);
                    expect($(no1).find("div.prediction").find("button.btn").html()).to.equal("Geirs tips");

                    expect($(no1).find("div.tabell-score").html()).to.equal("54");
                    expect($(no1).find("div.pall-score").html()).to.equal("-2");
                    expect($(no1).find("div.toppscorer-score").html()).to.equal("0");
                    expect($(no1).find("div.opprykk-score").html()).to.equal("0");
                    expect($(no1).find("div.cup-score").html()).to.equal("-5");

                    // #2
                    var no2 = participants.get(1);
                    expect($(no2).children().length).to.be.equal(11);

                    expect($(no2).find("div.rank > span").hasClass("icon-trophy-silver")).to.be.true;
                    expect($(no2).find("div.name").html()).to.equal("Rikard");
                    expect($(no2).find("div.rank-trend > span").hasClass("icon-up-plus")).to.be.true;
                    expect($(no2).find("div.rank-trend > small").html()).to.equal("&nbsp;+3");

                    expect($(no2).find("div.rating").html()).to.equal("48");

                    expect($(no2).find("div.rating-trend > small").length).to.equal(1);
                    expect($(no2).find("div.rating-trend > small").html()).to.equal("(-6p)");

                    expect($(no2).find("div.current-results").length).to.equal(0);
                    expect($(no2).find("div.prediction").find("button.btn").html()).to.equal("Rikards tips");

                    expect($(no2).find("div.tabell-score").html()).to.equal("54");
                    expect($(no2).find("div.pall-score").html()).to.equal("-1");
                    expect($(no2).find("div.toppscorer-score").html()).to.equal("0");
                    expect($(no2).find("div.opprykk-score").html()).to.equal("0");
                    expect($(no2).find("div.cup-score").html()).to.equal("-5");

                    // #3
                    var no3 = participants.get(2);
                    expect($(no3).children().length).to.be.equal(11);

                    expect($(no3).find("div.rank > span").hasClass("icon-trophy-bronze")).to.be.true;
                    expect($(no3).find("div.name").html()).to.equal("Tore");
                    expect($(no3).find("div.rank-trend > span").hasClass("icon-down")).to.be.true;
                    expect($(no3).find("div.rank-trend > small").html()).to.equal("&nbsp;-2");

                    expect($(no3).find("div.rating").html()).to.equal("50");

                    expect($(no3).find("div.rating-trend > small").html()).to.equal("(+1p)");

                    expect($(no3).find("div.tabell-score").html()).to.equal("56");
                    expect($(no3).find("div.pall-score").html()).to.equal("-1");
                    expect($(no3).find("div.toppscorer-score").html()).to.equal("0");
                    expect($(no3).find("div.opprykk-score").html()).to.equal("0");
                    expect($(no3).find("div.cup-score").html()).to.equal("-5");

                    done();
                });

                ratingCollection.fetch();
            });
        });
    });
