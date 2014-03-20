/* global require: false */
require(["jquery", "jquery.bootstrap"],

    function ($, Bootstrap) {
        "use strict";

        /** Application starting point (when DOM is ready ...) */
        $(document).ready(function () {
            console.log("DOM ready! Starting ...");
            setTimeout(function () {
                $("#intro").hide("slow", function () {
                    $("header").removeClass("hidden");
                    $("footer").removeClass("hidden");
                    $("#intro").remove();
                    $("#content").append(
                            // Temporary table layout
                            "<table class='table table-condenced table-striped table-hover'>" +
                                "<tr><th></th><th>Tabell</th><th>Pall</th><th>Cup</th><th>Toppskårer</th><th>Opprykk</th><th>Nedrykk</th><th><strong>Sum</strong></th></tr>" +
                                "<tr><td>Einar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Eirik</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Geir</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Hans Bernhard</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Jan Tore</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Oddgeir</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Oddvar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Ole Erik</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Rikard</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Sveinar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                //"<tr><td>Steinar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                //"<tr><td>Svein Tore</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Tore</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td>Trond</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "</table>")
                        .show("fast");
                });
            }, 18000);
        });
    }
);
