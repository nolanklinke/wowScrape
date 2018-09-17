var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Routes
app.get("/scrape", function(req, res) {
    axios.get("https://www.wowhead.com/").then(function(response) {

    const $ = cheerio.load(response.data);

    $("h1.heading-size-1").each(function(i, element) {
        const result = {};

    result.title = $(this)
    .children("a")
    .text();
    result.link = $(this)
    .children("a")
    .attr("href");
    result.text = $(this)
    .children("div")
    .attr(".news-post-content");

        db.Article.create(result).then (function(dbArticle) {
            console.log(dbArticle);
        }).catch(function(err) {
            return res.json(err);
        });
    });
    res.send("Scrape Complete");
    });
});