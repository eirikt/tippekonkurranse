/* global define: false, console: false */
define(['underscore', 'backbone', 'jquery', 'jquery.bootstrap', 'app.models.ScoreModel', 'app.result', 'app.resultCollection', 'app.results-view'],

    function (_, Backbone, $, Bootstrap, ScoreModel, TippekonkurranseCurrentResult, TippekonkurranseCurrentResultsCollection, TippekonkurranseCurrentResultsView) {
        "use strict";

        /** Application starting point (when DOM is ready ...) */
        $(document).ready(function () {
            console.log("DOM ready! Starting ...");

            setTimeout(function () {
                $("#intro").hide("slow", function () {
                    $("header").removeClass("hidden");
                    $("footer").removeClass("hidden");
                    $("#intro").remove();
                    var results = new TippekonkurranseCurrentResultsCollection(),
                        resultsView = new TippekonkurranseCurrentResultsView({
                            el: "#content",
                            collection: results
                        });
                    results.fetch();
                });
            }, 16500);
        });
    }
);
