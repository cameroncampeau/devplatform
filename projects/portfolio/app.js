var express = require("express"),
    path = require("path"),
    route = express.Router();


route.get("/", (req,res) => {
    res.sendFile(path.resolve(__dirname + "/public/index.html"))
})
route.use("/dist", express.static(path.resolve(__dirname + "/public/dist")))

module.exports = route;