var express = require("express"),
    path = require("path"),
    route = express.Router();

route.use("/dist", express.static(path.resolve(__dirname + "/public/dist")))
route.get("/", (req,res) => {
    res.sendFile(path.resolve(__dirname + "/public/index.html"))
})
route.get("/projects", (req,res) => {
    res.sendFile(path.resolve(__dirname + "/data/projects.json"))
});

module.exports = route;