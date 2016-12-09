// => Mongo Imports
var userData = require("./testUserData");

var mongoWrap = {
	connect: function () {return "Feature Not Yet Implemented";},
	insert: function (term) {
		return "Feature Not Yet Implemented: " + term;
	},
	query: function (query) {
		return userData[query];
	},
	login: function (user, pwd) {
		if (userData[user]) {
			if (userData[user].password === pwd) {
				return userData[user];
			}
		} else {
			return false;
		}
	}
};

module.exports = mongoWrap;
