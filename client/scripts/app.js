/* global define:false, console:false, $:false */
define(['underscore', 'backbone', 'jquery', 'jquery.bootstrap', 'app.result-collection', 'app.results-view', 'utils'],

    function (_, Backbone, $, Bootstrap, TippekonkurranseCurrentResultsCollection, TippekonkurranseCurrentResultsView, Utils) {
        "use strict";

        var HeaderView = Backbone.View.extend({
            template: _.template('' +
                    '<h1 style="white-space:nowrap;">' +
                    '  <span style="padding-left:2rem;">Tippekonkurranse 2014</span>' +
                    '  <span style="font-size:2rem;color:#808080;">&nbsp;&nbsp;|&nbsp;&nbsp;runde&nbsp;<%= round %></span>' +
                    '  <span style="font-size:2rem;color:#d3d3d3;">av 30</span>' +
                    '</h1>'
            ),
            initialize: function () {
                this.listenTo(this.collection, "reset", this.render);
            },
            render: function () {
                this.$el.append(this.template({ round: this.collection.at(0).get("round") }));
                return this;
            }
        });

        /** Application starting point (when DOM is ready ...) */
        $(document).ready(function () {
            console.log("DOM ready! Starting ...");

            setTimeout(function () {
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
            }, 1650);
        });
    }
);
