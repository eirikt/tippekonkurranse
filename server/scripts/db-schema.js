/* global root:false, require:false, console:false */

// Module dependencies, external
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,

// Module dependencies, local

// Mongoose schemas
    TeamStatusMongooseSchema = exports.TeamStatusMongooseSchema = new Schema({
        name: { type: String, index: true },
        no: { type: Number, min: 1, max: 16 },
        matches: { type: Number, index: true, min: 0, max: 30 }
    }),

    TippeligaRoundMongooseSchema = exports.TippeligaRoundMongooseSchema = new Schema({
        year: { type: Number, index: true },
        round: { type: Number, index: true },
        date: { type: Date },
        tippeliga: { type: [TeamStatusMongooseSchema] },
        toppscorer: { type: [String] },
        adeccoliga: { type: [TeamStatusMongooseSchema] },
        remainingCupContenders: { type: [String] }
    }),

// Mongoose models
    TippeligaRound = exports.TippeligaRound = mongoose.model("tippeligaround", TippeligaRoundMongooseSchema);
