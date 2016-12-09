function post(user, data) {
	var request = new XMLHttpRequest();
	request.open("POST", "/send/" + user, true);
	request.setRequestHeader("Content-Type", "application/json");
	request.send(data);
}
