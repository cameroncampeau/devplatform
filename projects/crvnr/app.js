var express = require("express"),
    app = express(),
    path = require("path");

app.use(express.static(path.resolve(__dirname + "/public")));

app.listen(80);