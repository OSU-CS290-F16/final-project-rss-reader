var express = require("express");
var exphbs = require("express-handlebars");
var mongo = require("mongodb").MongoClient;
var assert = require("assert");

var url = "mongodb://localhost:27017/rss";
var app = express();
var port = process.env.PORT || 3000;

// Use Handlebars as the view engine for the app.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Set static serve folder
app.use(express.static("public"));

mongo.connect(url, function(err, db) {
	assert.equal(null, err);
	// console.log("Connected to MongoDB");

	db.close();
});

app.get("/", function (req, res) {
	res.render("index");
});

// app.get("/notes/:user", function(req, res){
// 	var user = usersData[req.params.user];
//
// 	if (user){
// 		res.render("notes-page", user);
// 	} else {
// 		res.render("404-page", {status: 404});
// 	}
// });

app.get("*", function (req, res) {
	res.render("404-page", {status: 404});
});

// Listen on the specified port.
app.listen(port, function () {
	//console.log("== Listening on port: ", port);
});
