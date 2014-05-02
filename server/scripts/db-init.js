/* global require:false */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
mongoose = require("mongoose"),

// Module dependencies, local
    dbData = require("./db-fun.js"),

// MongoDB URLs
    dbUrl = process.env.MONGOLAB_URI || "mongodb://localhost/tippekonkurranse";

// Connect to database via Mongoose
mongoose.connect(dbUrl);

if (env === "development") {
    // Baseline data
    dbData.persistRound1();
    dbData.persistRound2();
    dbData.persistRound3();
    dbData.persistRound4();
    dbData.persistRound5();
    dbData.persistRound6();
}
