var express = require("express"),
	app = express(),
	https = require("https"),
	fs = require("fs").promises;

function addRoute(path, router) {
	app.use(path, router);
}

async function start(port) {
	var key = await fs.readFile("./certs/privkey.pem");
	var cert = await fs.readFile("./certs/fullchain.pem");
	port = port || 443;
	https
		.createServer(
			{
				key,
				cert
			},
			app
		)
		.listen(port);
	console.log("Starting default server on port", port);
}

module.exports = { addRoute, start };
