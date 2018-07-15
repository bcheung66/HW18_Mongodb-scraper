// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// Requiring the `Headline` model for accessing the `Headlines` collection
var database = require("./models/headlineModel");
/* db.init().insertMany(); */
var db = database.init().db();

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
var scraping = {

  startScrape: function () {
    request("https://nytimes.com", function (error, response, html) {

      // First, tell the console what server.js is doing
      console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from nytimes:" +
        "\n***********************************\n");

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);

      // An empty array to save the data that we'll scrape
      var results = [];

      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("article").each(function (i, element) {
        /* console.log(element) */
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

      // Log the results once you've looped through each of the elements found with cheerio
      console.log("Scraping Finished");

      // Insert into database
      results.forEach(headline => {
        db.headlines.insert({
          headline: headline.title,
          comments: headline.link
        },
          function (err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              /* console.log(inserted); */
            }
          });
      })
    })
  }
}

module.exports = scraping;