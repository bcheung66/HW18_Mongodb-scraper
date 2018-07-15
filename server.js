var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");


var PORT = process.env.PORT || 3001;

// Initialize Express
var app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Requiring the `Headline` model for accessing the `Headlines` collection
/* var db = require("./models/headlineModel");
db.init().insertMany();
db.init().mongojsDb; */

require("./route")(app);

var scraping = require("./scraping");
scraping.startScrape();

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});



