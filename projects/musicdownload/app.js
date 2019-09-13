var path = require("path"),
  express = require("express"),
  session = require("express-session"),
  router = express.Router(),
  Youtube = require("./controllers/Youtube"),
  bodyParser = require("body-parser");

router.use(bodyParser());
router.use(
  session({
    secret: Math.random().toString(36),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

var middleware = {
  auth: function(req, res, next) {
    if (!req.session.user && false) return res.end("Not Authenticated");
    next();
  }
};

router.use("/dist", express.static(path.resolve(__dirname + "/public/dist")));

router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/public/index.html"));
});

router.get("/video/:id/info", middleware.auth, async (req, res) => {
  try {
    res.json(await Youtube.getVideoInfo(req.params.id));
  } catch (e) {
    res.status(500).end(e);
  }
});

router.get("/video", middleware.auth, async (req, res) => {
  res.json(await Youtube.getSavedVideos());
});

router.get("/video/:title", middleware.auth, (req, res) => {
  res.sendFile(Youtube.getDownloadPath(req.params.title));
});

router.post("/video/:id/download", middleware.auth, (req, res) => {
  if (!req.body.name) return res.status(400).json("Bad Request");
  Youtube.download(
    req.params.id,
    req.body.name + ".mp3",
    function() {},
    function(data) {
      res.json(data);
    },
    function(err) {
      res.status(500).json(err);
    }
  );
});

router.delete("/video/:title", middleware.auth, async (req, res) => {
  var videos = await Youtube.getSavedVideos();
  if (!videos.find(e => e == req.params.title))
    return res.status(404).json("Not found");
  await Youtube.deleteDownload(req.params.title).catch(e => {
    res.status(500).end("Server error");
    console.error(e);
  });
  res.json({ error: false });
});

module.exports = router;
