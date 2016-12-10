var data = require("./testData.json");

var rssFeeder = {
	parse: function(subs) {
		var output = [];

		for (var site of subs) {
			var currentFeed = data[site];

			for (var article of currentFeed["items"]) {
				article["source"] = currentFeed["feed"].title;
			}

			for (var item of currentFeed["items"]) {
				output.push(item);
			}
		}

		return output.sort(function (a, b) {
			return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
		});
	}
};

module.exports = rssFeeder;
