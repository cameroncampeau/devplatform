var stats = require("./Stats");

var path = require("path");
var express = require("express");
var route = express.Router();

route.get("/data", async (req, res) => {
	res.json(await stats.get());
});

route.get("/data/progression", async (req, res) => {
	res.json(await stats.getDataProgressionStats(null, req.query.end || null));
});

route.get("/data/progression/:country", async (req, res) => {
	res.json(await stats.getDataProgressionStats(req.params.country));
});

route.get("/", (req, res) =>
	res.sendFile(path.resolve(__dirname + "/index.html"))
);

module.exports = route;
