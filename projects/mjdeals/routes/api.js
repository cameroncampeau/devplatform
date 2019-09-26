var express = require("express"),
  router = express.Router(),
  Deal = require("../controllers/Deal"),
  bodyParser = require("body-parser");

router.use(bodyParser.json());

function checkArgs(req, argList) {
  for (var i = 0; i < argList.length; i++) {
    if (typeof req.body[argList[i]] == "undefined")
      return console.log(argList[i]) && false;
  }
  return true;
}

router.get("/deal", async (req, res) => {
  var sort = req.query.sort && { [req.query.sort]: -1 };
  var limit = req.query.limit || 10;
  var query = {};
  if (req.query.category) query = { categories: req.query.category };
  var deals = await Deal.get(sort, limit, query);
  res.json({ deals });
});

router.get("/deal/:id", async (req, res) => {
  try {
    var deal = await Deal.getById(req.params.id);
    res.json({ deal });
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});

router.get("/deal/top", async (req, res) => {
  try {
    var limit = req.body.limit || 10;
    var deals = await Deal.get({ upvotes: -1 }, limit);
    res.json({ deals });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
});

router.get("/category", async (req, res) => {
  try {
    var categories = await Deal.getCategories();
    res.json({ categories });
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});

router.post("/deal/:title", async (req, res) => {
  if (!checkArgs(req, ["start", "end", "url"]))
    return res.status(400).json("Bad Request");
  try {
    res.json(
      await Deal.create(
        req.params.title,
        req.body.description || "",
        req.body.url,
        req.body.thumb_url,
        req.body.categories || [],
        req.body.start,
        req.body.end
      )
    );
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});
router.post("/deal/:id/upvote", async (req, res) => {
  try {
    if (await Deal.upvote(req.params.id)) res.json({ error: false });
    else res.status(404).json("Deal Not Found");
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});
router.post("/category/:title", async (req, res) => {
  try {
    var category = await Deal.createCategory(req.params.title);
    res.json(category);
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});

router.patch("/deal/:id", async (req, res) => {
  if (
    !checkArgs(req, [
      "title",
      "description",
      "thumb_url",
      "start",
      "end",
      "categories",
      "url"
    ])
  )
    return res.status(404).json("Bad Request");
  try {
    var deal = await Deal.update(
      req.params.id,
      req.body.title,
      req.body.description,
      req.body.thumb_url,
      req.body.categories,
      req.body.start,
      req.body.end
    );
    res.json({ deal });
  } catch (e) {
    res.status(500).json("Server Error");
  }
});

router.delete("/deal/:id", async (req, res) => {
  try {
    var deal = await Deal.remove(req.params.id);
    res.json({ deal });
  } catch (e) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
