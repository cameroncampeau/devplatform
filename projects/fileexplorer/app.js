var File = require("./controllers/File"),
  express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  path = require("path");

app.use(bodyParser.json({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/public/index.html"));
});

app.use("/dist", express.static(path.resolve(__dirname + "/public/dist")));

app.post("/dir", async (req, res) => {
  if (!req.body.path) return res.status(400).end("Bad Request");
  var files = await File.getDirContents(req.body.path);
  res.json({ error: false, files });
});

app.listen(80);
