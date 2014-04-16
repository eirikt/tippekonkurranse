/* global require:false, console:false */

// Module dependencies, external
var mongoose = require("mongoose"),

// Module dependencies, local
    dbSchema = require("./db-schema.js"),
    soccerResultService = require("./norwegian-soccer-service.js"),
    utils = require("./utils.js"),

// Store hardcoded tippeliga round results in db
    persistRound1 = exports.persistRound1 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 1 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #1 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #1 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #1 has more than one document in db!");
                }
            } else {
                var round1 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201401) {
                    round1[attr] = soccerResultService.round201401[attr];
                }
                round1.save(function (err, round1) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #1 saved... OK");
                });
            }
        });
    },

    persistRound2 = exports.persistRound2 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 2 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #2 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #2 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #2 has more than one document in db!");
                }
            } else {
                var round2 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201402) {
                    round2[attr] = soccerResultService.round201402[attr];
                }
                round2.save(function (err, round1) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #2 saved... OK");
                });
            }
        });
    },

    persistRound3 = exports.persistRound3 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 3 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #3 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #3 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #3 has more than one document in db!");
                }
            } else {
                var round3 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201403) {
                    round3[attr] = soccerResultService.round201403[attr];
                }
                round3.save(function (err, round1) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #3 saved... OK");
                });
            }
        });
    },

    persistRound4 = exports.persistRound4 = function () {
        "use strict";
    };
