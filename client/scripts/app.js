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
                                "<tr><th style='padding-left:2rem;'>#</th><th></th><th>Tabellplassering</th><th>Pall</th><th>Cup</th><th>Toppskårer</th><th>Opprykk</th><th>Nedrykk</th><th><strong>Sum</strong></th></tr>" +

                                "<tr><td style='padding-left:2rem;'>1</td><td>Einar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>2</td><td>Eirik</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>3</td><td>Geir</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>4</td><td>Hans Bernhard</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>5</td><td>Jan Tore</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>6</td><td>Oddgeir</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>7</td><td>Oddvar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>8</td><td>Ole Erik</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>9</td><td>Rikard</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>10</td><td>Sveinar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                //"<tr><td>Steinar</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                //"<tr><td>Svein Tore</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>12</td><td>Tore</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "<tr><td style='padding-left:2rem;'>13</td><td>Trond</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>" +
                                "</table>")
                        .show("fast");
                });
            }, 18000);
        });
    }
);
