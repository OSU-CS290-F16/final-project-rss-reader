// Native Dependencies
var path = require("path");

// External Dependencies
var express = require("express");
var exphbs = require("express-handlebars");

// Local Dependencies
var mongo = require("./mongo-wrap.js");
var rss = require("rss-feeder");

// Global Variables
var port = process.env.PORT || 3000;
var app = express();

// Use Handlebars as the View Engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve static files from PUBLIC
app.use(express.static(path.join(__dirname, "public")));

/*
 * Route the root path ('/') to the index page.  Give Handlebars the
 * appropriate page title and data for all users to render.
 */
app.get("/", function (req, res) {
	res.render("index-page", {
		title: "Readdit",
		usersData: mongo.query("user")
	});
});

/*
 * Set up a dynamic route to render a page with a specified user's rss feed
 * Pulls the users feedList array and parses each feed, creating a list.
 */
app.get("/feed/:user", function (req, res, next) {
	var userData = mongo.query(req.params.user);

	if (userData) {
		res.render("feed-page", {
			title: "Readdit - " + userData.name,
			feeds: rss.parse(userData.subscriptions),
			userName: userData.name
		});
	} else {
		next();
	}

});

// Return a 404 and render the 404 page for any other route.
app.get("*", function (req, res) {
	res.status(404).render("404-page", {
		title: "Readdit"
	});
});

// Listen on the specified port.
app.listen(port, function () {
	//console.log("== Listening on port", port);
});
