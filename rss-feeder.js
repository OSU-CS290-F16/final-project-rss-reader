var data = require("./testData.js");

var rssFeeder = {
	parse: function(subs) {
		var jsonTemp = {};
		var output = [];

		for (var feed of subs) {
			jsonTemp[feed] =data[feed];

			for (var article of jsonTemp[feed].items) {
				article["source"] = jsonTemp["title"];
			}
		}

		for (var site of jsonTemp) {
			output["articles"] += site["items"];
		}

		return output.sort(function (a, b) {
			return a.created - b.created;
		});
	}
};

module.exports = rssFeeder;
