/* global require:false */
/* jshint -W106 */

// Environment
var env = process.env.NODE_ENV || "development",

// Module dependencies, external
    mongoose = require("mongoose"),

// Module dependencies, local

// MongoDB URLs
    dbUrl = process.env.MONGOLAB_URI || "mongodb://localhost/tippekonkurranse",

// TODO: Better control via 'db = mongoose.createConnection()'
    MONGO = {
        //username: "username",
        //password: "pa55W0rd!",
        //server: '******.mongolab.com',
        //port: '*****',
        //db: 'dbname',
        connectionString: function () {
            "use strict";
            return dbUrl;
        },
        options: {
            server: {
                auto_reconnect: true,
                socketOptions: {
                    //connectTimeoutMS: 5000,
                    //keepAlive: 3600000,
                    socketTimeoutMS: 3000
                }
            }
        }
    };//,

/*
 db = mongoose.createConnection(dbUrl, MONGO.options);

 db.on('error', function (err) {
 console.log("DB connection Error: " + err);
 });
 db.on('open', function () {
 console.log("DB connected");
 });
 db.on('close', function (str) {
 console.log("DB disconnected: " + str);
 });
 */

// Connect to database via Mongoose
mongoose.connect(dbUrl);
