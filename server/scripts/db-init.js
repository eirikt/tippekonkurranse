/* global require:false */

// Module dependencies, external
var mongoose = require("mongoose"),

// Module dependencies, local
    dbData = require("./db-fun.js"),

// MongoDB URLs
    standardDbUrlFormat = "mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]",

    herokuMongoLabUrl = "mongodb://ds045897.mongolab.com:45897/heroku_app22911822",
    devMongoDBUrl = "mongodb://localhost/tippekonkurranse",

    mongoDBUrl = herokuMongoLabUrl,
//mongoDBUrl = devMongoDBUrl,

    dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || mongoDBUrl;

// Connect to database via Mongoose
mongoose.connect(dbUrl);

// Base data
dbData.persistRound1();
dbData.persistRound2();
//dbData.persistRound3();
//dbData.persistRound4();
