/* global define:false, console:false, $:false */
define([
        'underscore', 'backbone', 'jquery', 'jquery.bootstrap',
        'backbone.offline', 'utils',
        'app.result-collection', 'app.results-view'],

    function (_, Backbone, $, Bootstrap, BackboneOffline, Utils, TippekonkurranseCurrentResultsCollection, TippekonkurranseCurrentResultsView) {
        "use strict";

        var HeaderView = Backbone.View.extend({
            template: _.template('' +
                    '<h1 style="white-space:nowrap;">' +
                    '  <span style="padding-left:2rem;">Tippekonkurranse 2014</span>' +
                    '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= round %></span>' +
                    '  <span style="font-size:2rem;color:#d3d3d3;">av 30</span>' +
                    '  <span id="offlineScoresNotification" class="hidden noconnection-container" data-appname="Tippekonkurranse" data-uri="/api/scores/current" data-urititle="stillingen beregnet" style="margin-left:.5rem;font-size:2rem;color:#ef8d15;"></span>' +
                    '</h1>'
            ),
            initialize: function () {
                //BackboneOffline.norwegianOfflineListener(".noconnection-container");
                this.listenTo(this.collection, "reset", this.render);
            },
            render: function () {
                //if (this.collection.length > 0) {
                    this.$el.append(this.template({ round: this.collection.at(0).get("round") }));
                //} else {
                //    this.$el.append(this.template({ round: "ingen data" }));
                //}
                //return this;
            }
        });

        /** Application starting point (when DOM is ready ...) */
        $(document).ready(function () {
            console.log("DOM ready! Starting ...");

            Utils.wait(1650).then(function () {
                $("#intro").hide("slow", function () {
                    var results = new TippekonkurranseCurrentResultsCollection(),
                        headerView = new HeaderView({
                            el: "header",
                            collection: results
                        }),
                        resultsView = new TippekonkurranseCurrentResultsView({
                            el: "#content",
                            collection: results
                        });

                    $("header").removeClass("hidden");
                    $("footer").removeClass("hidden");
                    $("#intro").remove();

                    results.fetch();
                });
            });

            //BackboneOffline.listenToConnectivityDropouts(".noconnection-container");
            BackboneOffline.listenToConnectivityDropouts("#offlineScoresNotification");
            BackboneOffline.listenToConnectivityDropouts("#offlineResultsNotification");
        });
    }
);
