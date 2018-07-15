var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var mongojs = require("mongojs");
var cheerio = require("cheerio");
var mongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'headlinesdb';

/* var url = "mongodb://127.0.0.1:27017/headlinesdb"; */

// Use connect method to connect to the server
mongoClient.connect(url, function (err, client) {
    if (err) throw err;

    console.log("Connected successfully to server");
    const db = client.db(dbName);

    /* insertDocuments(db, function () {
        findDocuments(db, function () {
            client.close();
        });
    }); */

    findDocuments(db, function () {
        client.close();
    });
});

const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');

    // Insert some documents
    collection.insertMany([
        { headline: "Headline1", summary: "Summary1", url: "URL1", comments: ["comment1"] },
        { Headline: "Headline2", summary: "Summary2", url: "URL2", comments: ["comment2"] },
        { Headline: "Headline3", summary: "Summary3", url: "URL3", comments: ["comment3"] }],
        function (err, result) {
            console.log("Inserted " + result.ops.length + " documents into the collection");
            callback();
        }
    );
}

const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');

    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs)
        callback();
    });
}