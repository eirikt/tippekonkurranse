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

// Baseline data (to be removed ...)
dbData.persistRound1();
dbData.persistRound2();
dbData.persistRound3();
dbData.persistRound4();
dbData.persistRound5();
dbData.persistRound6();
dbData.persistRound7();
dbData.persistRound8();
dbData.persistRound9();
//dbData.persistRound10();
//dbData.persistRound11();
//dbData.persistRound12();
//dbData.persistRound13();
//dbData.persistRound14();
//dbData.persistRound15();
//dbData.persistRound16();
