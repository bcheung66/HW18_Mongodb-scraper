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
var db = require("./models/headlineModel");
db.init().insertMany();


// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from reddit's webdev board:" +
    "\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://old.reddit.com/r/webdev/", function (error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("p.title").each(function (i, element) {

        // Save the text of the element in a "title" variable
        var title = $(element).text();

        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).children().attr("href");

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link
        });
    });

    // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
    $("h4.headline-link").each(function (i, element) {

        // Save the text of the h4-tag as "title"
        var title = $(element).text();

        // Find the h4 tag's parent a-tag, and save it's href value as "link"
        var link = $(element).parent().attr("href");

        // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
            title: title,
            link: link
        });
    });

    $("figure.rollover").each(function (i, element) {

        /* Cheerio's find method will "find" the first matching child element in a parent.
         *    We start at the current element, then "find" its first child a-tag.
         *    Then, we "find" the lone child img-tag in that a-tag.
         *    Then, .attr grabs the imgs srcset value.
         *    The srcset value is used instead of src in this case because of how they're displaying the images
         *    Visit the website and inspect the DOM if there's any confusion
        */
        var imgLink = $(element).find("a").find("img").attr("data-srcset").split(",")[0].split(" ")[0];

        // Push the image's URL (saved to the imgLink var) into the results array
        results.push({ link: imgLink });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});



