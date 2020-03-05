var getData = require("./Stats").get;

var path = require("path");
var express = require("express");
var route = express.Router();

route.get("/data", async (req, res) => {
	res.json(await getData());
});

route.get("/", (req, res) =>
	res.sendFile(path.resolve(__dirname + "/index.html"))
);

module.exports = route;
