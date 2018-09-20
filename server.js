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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Routes
//root route
app.get("/", function(req, res) {
  res.send(index.html);
});

app.get("/savedTest", function(req, res) {
  res.send(saved.html);
});

//route to scrape wowhead website
app.get("/scrape", function(req, res) {
    axios.get("https://www.wowhead.com/").then(function(response) {

    const $ = cheerio.load(response.data);

    $(".news-post").each(function(i, element) {
        const result = {};

    result.title = $(this).find("h1").children("a").text();

    result.link = $(this).find("h1").children("a").attr("href");

    result.snippet = $(this).find(".news-post-content").children("noscript").text().trim();


        db.Article.create(result)
        .then (function(dbArticle) {

            console.log(dbArticle);

        }).catch(function(err) {

            return res.json(err);

        });
    });
    res.send("Scrape Complete");
    });
});

//route to get all articles
app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

//route to populate article with note
app.get("/articles/:id", function(req, res) {

    db.Article
      .findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// update or create note
app.post("/articles/:id", function(req, res) {

    db.Note
      .create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// save article
app.put("/saved/:id", function(req, res) {

    db.Article
      .findByIdAndUpdate({ _id: req.params.id }, { $set: { isSaved: true }})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

//getting all saved articles
app.get("/saved", function(req, res) {

    db.Article
      .find({ isSaved: true })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// delete articles from saved section
app.put("/delete/:id", function(req, res) {

    db.Article
      .findByIdAndUpdate({ _id: req.params.id }, { $set: { isSaved: false }})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });