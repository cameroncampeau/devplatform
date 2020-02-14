var express = require("express"),
	app = express(),
	https = require("https"),
	http = require("http"),
	fs = require("fs").promises,
	session = require("express-session");

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
	app.use(session({
			  secret: Math.random().toString(32),
			  resave: false,
			  saveUninitialized: true,
			  cookie: { secure: true }
		}))
	if (port == 80) return
	var httpApp = express();
	httpApp.get('*', function(req, res) {  
		res.redirect('https://' + req.headers.host + req.url);
	})
	httpApp.listen(80);
}	

module.exports = { addRoute, start };
