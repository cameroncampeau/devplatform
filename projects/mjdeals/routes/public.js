const express = require("express"),
  router = express.Router(),
  path = require("path");
router.use(
  "/dist",
  express.static(path.resolve(__dirname + "/../public/dist"))
);
router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../public/index.html"));
});
module.exports = router;
