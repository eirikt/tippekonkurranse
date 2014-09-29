/* global require:false, console:false */
/* jshint -W089 */

// Module dependencies, external

// Module dependencies, local
var dbSchema = require("./db-schema.js"),
    soccerResultService = require("./norwegian-soccer-service.js"),
    utils = require("./utils.js"),


// TODO: Rather generic MongoDB requestor functions ...
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
    },

    persistRound12 = exports.persistRound12 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 12 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #12 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #12 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #12 has more than one document in db!");
                }
            } else {
                var round12 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014012) {
                    round12[attr] = soccerResultService.round2014012[attr];
                }
                round12.save(function (err, round12) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #12 saved... OK");
                });
            }
        });
    },

    persistRound13 = exports.persistRound13 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 13 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #13 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #13 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #13 has more than one document in db!");
                }
            } else {
                var round13 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014013) {
                    round13[attr] = soccerResultService.round2014013[attr];
                }
                round13.save(function (err, round13) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #13 saved... OK");
                });
            }
        });
    },

    persistRound14 = exports.persistRound14 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 14 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #14 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #14 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #14 has more than one document in db!");
                }
            } else {
                var round14 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014014) {
                    round14[attr] = soccerResultService.round2014014[attr];
                }
                round14.save(function (err, round14) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #14 saved... OK");
                });
            }
        });
    },

    persistRound15 = exports.persistRound15 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 15 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #15 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #15 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #15 has more than one document in db!");
                }
            } else {
                var round15 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014015) {
                    round15[attr] = soccerResultService.round2014015[attr];
                }
                round15.save(function (err, round15) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #15 saved... OK");
                });
            }
        });
    },

    persistRound16 = exports.persistRound16 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 16 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #16 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #16 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #16 has more than one document in db!");
                }
            } else {
                var round16 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014016) {
                    round16[attr] = soccerResultService.round2014016[attr];
                }
                round16.save(function (err, round16) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #16 saved... OK");
                });
            }
        });
    },

    persistRound17 = exports.persistRound17 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 17 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #17 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #17 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #17 has more than one document in db!");
                }
            } else {
                var round17 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014017) {
                    round17[attr] = soccerResultService.round2014017[attr];
                }
                round17.save(function (err, round17) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #17 saved... OK");
                });
            }
        });
    },

    persistRound18 = exports.persistRound18 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 18 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #18 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #18 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #18 has more than one document in db!");
                }
            } else {
                var round18 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014018) {
                    round18[attr] = soccerResultService.round2014018[attr];
                }
                round18.save(function (err, round18) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #18 saved... OK");
                });
            }
        });
    },

    persistRound19 = exports.persistRound19 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 19 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #19 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #19 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #19 has more than one document in db!");
                }
            } else {
                var round19 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014019) {
                    round19[attr] = soccerResultService.round2014019[attr];
                }
                round19.save(function (err, round19) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #19 saved... OK");
                });
            }
        });
    },

    persistRound20 = exports.persistRound20 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 20 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #20 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #20 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #20 has more than one document in db!");
                }
            } else {
                var round20 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014020) {
                    round20[attr] = soccerResultService.round2014020[attr];
                }
                round20.save(function (err, round20) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #20 saved... OK");
                });
            }
        });
    },

    persistRound21 = exports.persistRound21 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 21 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #21 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #21 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #21 has more than one document in db!");
                }
            } else {
                var round21 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014021) {
                    round21[attr] = soccerResultService.round2014021[attr];
                }
                round21.save(function (err, round21) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #21 saved... OK");
                });
            }
        });
    },

    persistRound22 = exports.persistRound22 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 22 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #22 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #22 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #22 has more than one document in db!");
                }
            } else {
                var round22 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014022) {
                    round22[attr] = soccerResultService.round2014022[attr];
                }
                round22.save(function (err, round22) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #22 saved... OK");
                });
            }
        });
    },

    persistRound23 = exports.persistRound23 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 23 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #23 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #23 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #23 has more than one document in db!");
                }
            } else {
                var round23 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014023) {
                    round23[attr] = soccerResultService.round2014023[attr];
                }
                round23.save(function (err, round23) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #23 saved... OK");
                });
            }
        });
    },

    persistRound24 = exports.persistRound24 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 24 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #24 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #24 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #24 has more than one document in db!");
                }
            } else {
                var round24 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014024) {
                    round24[attr] = soccerResultService.round2014024[attr];
                }
                round24.save(function (err, round24) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #24 saved... OK");
                });
            }
        });
    },

    persistRound25 = exports.persistRound25 = function () {
        "use strict";
        dbSchema.TippeligaRound.count({ year: 2014, round: 25 }, function (err, count) {
            if (count > 0) {
                console.log(utils.logPreamble() + "Tippeliga 2014 round #25 already exists in db");
                if (count > 1) {
                    console.warn(utils.logPreamble() + "Tippeliga 2014 round #25 has more than one document in db!");
                    throw new Error("Tippeliga 2014 round #25 has more than one document in db!");
                }
            } else {
                var round25 = new dbSchema.TippeligaRound();
                for (var attr in soccerResultService.round2014025) {
                    round25[attr] = soccerResultService.round2014025[attr];
                }
                round25.save(function (err, round25) {
                    console.log(utils.logPreamble() + "Tippeliga 2014 round #25 saved... OK");
                });
            }
        });
    };
