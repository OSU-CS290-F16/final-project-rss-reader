// Native Dependencies
var path = require("path");

// External Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

// Local Dependencies
var mongo = require("./mongo-wrap.js");
var rss = require("./rss-feeder");

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
* Load feed with "GUEST" account feed list
*/
app.get("/feed-page", function (req, res, next) {
	var userData = mongo.query("guest");
	console.log("Logged in as: " + userData.name + "\n -> Subscriptions are:\n" + userData.subscriptions);

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

/*
 * Set up a dynamic route to render a page with a specified user's rss feed
 * Pulls the users feedList array and parses each feed, creating a list.
 */
app.get("/feed-page/:user", function (req, res, next) {
	var userData = mongo.query(req.params.user);
	console.log("Logged in as: " + userData.name + "\n -> Subscriptions are:\n" + userData.subscriptions);

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


/*
* On POST, Check submitted feed for validity
* Valid -> Check Username
* => Valid Username -> Add Feed to Users Subscriptions
* => Else -> Error MSG
*/
app.post("/feed-page/:user/add-feed", function (req, res, next) {
	if (req.body) {
		var newFeed = req.body;
		var userData = mongo.query(req.params.user);
		if (req.params.user !== "guest") {
			if (rss.check(newFeed)) {
				mongo.insert(req.params.user);

				res.render("feed-page", {
					title: "Readdit - " + userData.name,
					feeds: rss.parse(userData.subscriptions),
					userName: userData.name
				});
			} else {
				res.render("add-feed", {
					title: "Readdit - Failed Feed",
					failed: true
				});
			}
		} else {
			res.status(400).send("You Must Log In to Add a Feed");
		}
	} else {
		res.status(400).send("Invalid Request");
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
	console.log("== Listening on port", port);
});
