var mongojs = require("mongojs");

// Requiring the `Headline` model for accessing the `Headlines` collection
var database = require("./models/headlineModel");
/* db.init().insertMany(); */
var db = database.init().db();

// Scraping
var scraping = require("./scraping");

module.exports = function (app) {
  // Routes
  // ======

  // Simple index route
  app.get("/", function (req, res) {
    res.send(index.html);
  });

  // Handle form submission, save submission to mongo
  app.post("/api/notes", function (req, res) {
    console.log(req.body);
    // Insert the note into the notes collection
    db.notes.insert(req.body, function (error, saved) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        // Otherwise, send the note back to the browser
        // This will fire off the success function of the ajax request
        res.send(saved);
      }
    });
  });

  // Retrieve results from mongo
  app.get("/api/headlines", function (req, res) {
    // Scraping
    /*     scraping.startScrape(); */

    // Find all notes in the notes collection
    db.headlines.find({}, function (error, found) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        // Otherwise, send json of the notes back to user
        // This will fire off the success function of the ajax request
        res.json(found);
      }
    });

    /* db.headlines.aggregate([{
      $lookup: {
        from: "notes",
        localField: "headlineId",
        foreignField: "_id",
        as: "comments"
      }
    }]) */
  });

  // Select just one note by an id
  app.get("/api/notes/:id", function (req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))

    console.log("***ID*** = " + req.params.id);

    // Find just one result in the notes collection
    /* db.notes.findOne( */
    db.notes.find(
      {
        // Using the id in the url
        "headlineId": req.params.id
      },
      function (error, found) {
        // log any errors
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the note to the browser
          // This will fire off the success function of the ajax request
          if (found) {
            /* console.log("FOUND NOTE = " + found[0] + "/" + found[1]); */
            console.log("_ID = " + req.params.id);
          }
          res.send(found);
        }
      }
    );
  });

  // Update just one note by an id
  app.put("/api/notes/:id", function (req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))

    // Update the note that matches the object id
    db.notes.update(
      {
        /* _id: mongojs.ObjectId(req.params.id) */
        headlineId: req.params.id
      },
      {
        // Set the title, note and modified parameters
        // sent in the req body.
        $set: {
          title: req.body.title,
          note: req.body.note,
          modified: Date.now()
        }
      },
      function (error, edited) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(edited);
          res.send(edited);
        }
      }
    );
  });

  // Delete One from the DB
  app.delete("/api/notes/:id", function (req, res) {
    console.log("DELETE1 = " + req.params.id);console.log("DELETE1 = " + req.params.id);
    var ident = req.params.id.split("|")[0];
    var comments = req.params.id.split("|")[1];

    console.log("ident = " + ident);
    console.log("comments = " + comments);

    // Remove a note using the objectID
    db.notes.remove(
      {
        headlineId: ident,
        comments: comments
      },
      function (error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });

  // Clear the DB
  app.get("/api/clear", function (req, res) {
    // Remove every note from the notes collection
    db.headlines.remove({}, function (error, response) {
      // Log any errors to the console
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(response);
        res.send(response);
      }
    });
  })
}
