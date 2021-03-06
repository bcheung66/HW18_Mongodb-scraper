var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var mongojs = require("mongojs");
var cheerio = require("cheerio");


// Database Name
const dbName = 'headlinesdb';

// Use connect method to connect to the server
var url = "mongodb://127.0.0.1:27017/" + dbName;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || url;

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to the Mongo DB
/* mongoose.connect(MONGODB_URI); */
var connection = mongoose.createConnection(MONGODB_URI);

var headlineSchema = {
    headline: {
        type: String,
        trim: true
        /* required: "headline is Required" */
    },

    summary: {
        type: String,
        trim: true
        /* required: "summary is Required" */
        /* validate: [
          function(input) {
            return input.length >= 6;
          },
          "Password should be longer."
        ] */
    },

    url: {
        type: String,
        trim: true
        /* required: "url is Required" */
        /* unique: true
        match: [/.+@.+\..+/, "Please enter a valid e-mail address"] */
    },

    comments: {
        type: String,
        trim: true
        /* default: Date.now */
    },
};

var hlineSchema = new mongoose.Schema(headlineSchema);
var headline = connection.model('headline', hlineSchema);
headline.insertMany([
    { headline: "Headline1", summary: "Summary1", url: "URL1", comments: ["comment1"] },
    { headline: "Headline2", summary: "Summary2", url: "URL2", comments: ["comment2"] },
    { headline: "Headline3", summary: "Summary3", url: "URL3", comments: ["comment3"] }],
    function (error) {
        if (error) throw error;
        console.log("Rows inserted!");

        headline.findOne({ 'headline': 'Headline3' }, 'headline summary url comments', function (err, result) {
            if (err) return handleError(err);

            console.log('%s %s %s %s', result.headline, result.summary, result.url, result.comments);
        });
    }
);

/* mongoose.connect(url, {
    connectTimeoutMS: 1000
    // Note that mongoose will **not** pull `bufferCommands` from the query string
}, function (error) {
    if (error) throw error;
    console.log("Database connected!");
}); */

