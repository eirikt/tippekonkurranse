/* global require:false, console:false */
/* jshint -W089 */

// Module dependencies, external

// Module dependencies, local
var dbSchema = require("./db-schema.js"),
    soccerResultService = require("./norwegian-soccer-service.js"),
    utils = require("./utils.js"),


// TODO: rather generic MongoDB requestor functions ...
    getTippeligaRound = exports.getTippeligaRound = function (requestion, year, round) {
        "use strict";
        // TODO: ...
    },


// Store hardcoded tippeliga round results in db, for now ...

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
        dbSchema.TippeligaRound.count({ year: 2014, round: 4 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #4 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #4 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #4 has more than one document in db!");
                }
            } else {
                var round4 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201404) {
                    round4[attr] = soccerResultService.round201404[attr];
                }
                round4.save(function (err, round1) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #4 saved... OK");
                });
            }
        });
    },

    persistRound5 = exports.persistRound5 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 5 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #5 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #5 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #5 has more than one document in db!");
                }
            } else {
                var round4 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201405) {
                    round4[attr] = soccerResultService.round201405[attr];
                }
                round4.save(function (err, round1) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #5 saved... OK");
                });
            }
        });
    },

    persistRound6 = exports.persistRound6 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 6 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #6 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #6 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #6 has more than one document in db!");
                }
            } else {
                var round4 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201406) {
                    round4[attr] = soccerResultService.round201406[attr];
                }
                round4.save(function (err, round1) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #6 saved... OK");
                });
            }
        });
    };
