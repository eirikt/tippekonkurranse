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


// Store hardcoded tippeliga round results in db, for now (to be removed) ...

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
                round2.save(function (err, round2) {
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
                round3.save(function (err, round3) {
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
                round4.save(function (err, round4) {
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
                var round5 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201405) {
                    round5[attr] = soccerResultService.round201405[attr];
                }
                round5.save(function (err, round5) {
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
                var round6 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201406) {
                    round6[attr] = soccerResultService.round201406[attr];
                }
                round6.save(function (err, round6) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #6 saved... OK");
                });
            }
        });
    },

    persistRound7 = exports.persistRound7 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 7 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #7 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #7 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #7 has more than one document in db!");
                }
            } else {
                var round7 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201407) {
                    round7[attr] = soccerResultService.round201407[attr];
                }
                round7.save(function (err, round7) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #7 saved... OK");
                });
            }
        });
    },

    persistRound8 = exports.persistRound8 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 8 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #8 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #8 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #8 has more than one document in db!");
                }
            } else {
                var round8 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201408) {
                    round8[attr] = soccerResultService.round201408[attr];
                }
                round8.save(function (err, round8) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #8 saved... OK");
                });
            }
        });
    },

    persistRound9 = exports.persistRound9 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 9 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #9 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #9 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #9 has more than one document in db!");
                }
            } else {
                var round9 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round201409) {
                    round9[attr] = soccerResultService.round201409[attr];
                }
                round9.save(function (err, round9) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #9 saved... OK");
                });
            }
        });
    },

    persistRound10 = exports.persistRound10 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 10 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #10 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #10 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #10 has more than one document in db!");
                }
            } else {
                var round10 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014010) {
                    round10[attr] = soccerResultService.round2014010[attr];
                }
                round10.save(function (err, round10) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #10 saved... OK");
                });
            }
        });
    },

    persistRound11 = exports.persistRound11 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 11 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #11 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #11 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #11 has more than one document in db!");
                }
            } else {
                var round11 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014011) {
                    round11[attr] = soccerResultService.round2014011[attr];
                }
                round11.save(function (err, round11) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #11 saved... OK");
                });
            }
        });
    };
