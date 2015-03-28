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


            it("should render a flexbox with header div of order 0", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [ SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current ].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": {
                                "year": 2017,
                                "round": 22,
                                "hasPredictions": {}
                            },
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

                ratingsView.on("render", function () {
                    expect(ajaxSpy.calledOnce).to.be.true;

                    // Fasit: "<div class="participant current-scores scores-table-row"><div class="rank strong"><span class="icon-trophy-gold"></span></div><div class="name strong">John</div><div class="rank-trend"><span class="tendency-arrow"></span><small>&nbsp;</small></div><div class="rating strong">0</div><div class="rating-trend"><small></small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Johns tips</button></div><div class="tabell-score">0</div><div class="pall-score">0</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">0</div></div>"
                    // TODO: ...
                    /* OLD
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
                     */

                    done();
                });

                ratingCollection.fetch();
            });


            it("should render a default scores row", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [ SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current ].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": {
                                "year": 2017,
                                "round": 22,
                                "hasPredictions": {}
                            },
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
                /*
                expect(ratingsView.$el).to.exist;
                expect(ratingsView.$el.children().length).to.equal(0);
                expect(ratingsView.$("tbody").length).to.equal(0);
                */

                ratingsView.on("render", function () {
                    expect(ajaxSpy.calledOnce).to.be.true;

                    // Fasit: "<div class="participant current-scores scores-table-row"><div class="rank strong"><span class="icon-trophy-gold"></span></div><div class="name strong">John</div><div class="rank-trend"><span class="tendency-arrow"></span><small>&nbsp;</small></div><div class="rating strong">0</div><div class="rating-trend"><small></small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Johns tips</button></div><div class="tabell-score">0</div><div class="pall-score">0</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">0</div></div>"
                    // TODO: ...
                    //expect(ratingsView.$el).to.exist;
                    //expect(ratingsView.$("tbody").length).to.be.equal(1);
                    //expect(ratingsView.$("tr").length).to.be.equal(2);

                    // Empty scores
                    //expect(ratingsView.$("td").length).to.be.equal(12);
                    //expect($(ratingsView.$("td")[ 0 ]).html()).to.have.string("icon-trophy-gold");
                    //expect($(ratingsView.$("td")[ 1 ]).find("span").html()).to.be.equal("John");
                    //expect($(ratingsView.$("td")[ 2 ]).html()).to.be.equal('<span class="tendency-arrow"></span><small>&nbsp;</small>');
                    //expect($(ratingsView.$("td")[ 3 ]).html()).to.be.equal("");
                    //expect($(ratingsView.$("td")[ 4 ]).find(".rating-tendency").prev().html()).to.be.equal("0");
                    //expect($(ratingsView.$("td")[ 5 ]).find("button").html()).to.have.string("Johns tips");
                    //expect($(ratingsView.$("td")[ 6 ]).html()).to.be.equal("0");
                    //expect($(ratingsView.$("td")[ 7 ]).html()).to.be.equal("0");
                    //expect($(ratingsView.$("td")[ 8 ]).html()).to.be.equal("0");
                    //expect($(ratingsView.$("td")[ 9 ]).html()).to.be.equal("0");
                    //expect($(ratingsView.$("td")[ 10 ]).html()).to.be.equal("0");
                    //expect($(ratingsView.$("td")[ 11 ]).html()).to.be.equal("0");

                    /* OLD
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
                    */

                    done();
                });

                ratingCollection.fetch();
            });


            it("should calculate and show rank trends from previous round", function (done) {
                sandbox.server.respondWith("GET", /(.*)/, function (xhr, query) {
                    console.log("query:" + query);
                    ajaxSpy(xhr, query);
                    if (query === [ SharedRatingModel.resources.scores.baseUri, SharedRatingModel.resources.uri.element.current ].join("/")) {
                        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                            "metadata": {
                                "year": 2016,
                                "round": 10,
                                "hasPredictions": {}
                            },
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
                // TODO: ...
                //expect(ratingsView.$el).to.exist;
                //expect(ratingsView.$el.children().length).to.equal(0);
                //expect(ratingsView.$("tbody").length).to.equal(0);

                ratingsView.on("render", function () {

                    // Fasit: "<div class="participant current-scores scores-table-row"><div class="rank strong"><span class="icon-trophy-gold"></span></div><div class="name strong">Geir</div><div class="rank-trend"><span class="icon-up-plus"></span><small>&nbsp;+3</small></div><div class="rating strong">51</div><div class="rating-trend"><small></small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Geirs tips</button></div><div class="tabell-score">54</div><div class="pall-score">-2</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong"><span class="icon-trophy-silver"></span></div><div class="name strong">Rikard</div><div class="rank-trend"><span class="icon-up-plus"></span><small>&nbsp;+3</small></div><div class="rating strong">52</div><div class="rating-trend"><small>(-2p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Rikards tips</button></div><div class="tabell-score">54</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong"><span class="icon-trophy-bronze"></span></div><div class="name strong">Tore</div><div class="rank-trend"><span class="icon-down"></span><small>&nbsp;-2</small></div><div class="rating strong">54</div><div class="rating-trend"><small>(+5p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Tores tips</button></div><div class="tabell-score">56</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">4.</div><div class="name strong">Steinar</div><div class="rank-trend"><span class="icon-down-plus"></span><small>&nbsp;-3</small></div><div class="rating strong">55</div><div class="rating-trend"><small>(+6p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Steinars tips</button></div><div class="tabell-score">58</div><div class="pall-score">-2</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">5.</div><div class="name strong">Jan Tore</div><div class="rank-trend"><span class="icon-down"></span><small>&nbsp;-2</small></div><div class="rating strong">59</div><div class="rating-trend"><small>(+9p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Jan Tores tips</button></div><div class="tabell-score">62</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">-1</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong"></div><div class="name strong">Ole Erik</div><div class="rank-trend"><span class="icon-up"></span><small>&nbsp;+2</small></div><div class="rating strong">59</div><div class="rating-trend"><small>(+3p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Ole Eriks tips</button></div><div class="tabell-score">62</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">-1</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">7.</div><div class="name strong">Oddvar</div><div class="rank-trend"><span class=""></span><small>&nbsp;</small></div><div class="rating strong">62</div><div class="rating-trend"><small>(+6p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Oddvars tips</button></div><div class="tabell-score">64</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">8.</div><div class="name strong">Einar</div><div class="rank-trend"><span class="icon-up"></span><small>&nbsp;+1</small></div><div class="rating strong">66</div><div class="rating-trend"><small>(+5p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Einars tips</button></div><div class="tabell-score">68</div><div class="pall-score">0</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">-1</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong"></div><div class="name strong">Svein Tore</div><div class="rank-trend"><span class="icon-down-plus"></span><small>&nbsp;-3</small></div><div class="rating strong">66</div><div class="rating-trend"><small>(+12p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Svein Tores tips</button></div><div class="tabell-score">68</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">10.</div><div class="name strong">Oddgeir</div><div class="rank-trend"><span class="icon-down"></span><small>&nbsp;-1</small></div><div class="rating strong">69</div><div class="rating-trend"><small>(+8p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Oddgeirs tips</button></div><div class="tabell-score">70</div><div class="pall-score">0</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">11.</div><div class="name strong">Eirik</div><div class="rank-trend"><span class=""></span><small>&nbsp;</small></div><div class="rating strong">71</div><div class="rating-trend"><small>(-2p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Eiriks tips</button></div><div class="tabell-score">72</div><div class="pall-score">0</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">12.</div><div class="name strong">Trond</div><div class="rank-trend"><span class=""></span><small>&nbsp;</small></div><div class="rating strong">78</div><div class="rating-trend"><small>(+4p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Tronds tips</button></div><div class="tabell-score">80</div><div class="pall-score">-1</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div><div class="participant current-scores scores-table-row"><div class="rank strong">13.</div><div class="name strong">Hans Bernhard</div><div class="rank-trend"><span class=""></span><small>&nbsp;</small></div><div class="rating strong">83</div><div class="rating-trend"><small>(+8p)</small></div><div class="prediction"><button type="button" class="btn btn-sm btn-primary" data-id="ParticipantScore.userIdPropertyName" data-toggle="modal" data-target="#predictionsTable">Hans Bernhards tips</button></div><div class="tabell-score">84</div><div class="pall-score">0</div><div class="nedrykk-score">0</div><div class="toppscorer-score">0</div><div class="opprykk-score">0</div><div class="cup-score">-1</div></div>"
                    // TODO: ...

                    /* OLD
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
                    */

                    done();
                });

                ratingCollection.fetch();
            });


            // TODO: ?
            it("should calculate and show rating trends from previous round");
        });
    }
);
