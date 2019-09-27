var express = require("express"),
  router = express.Router(),
  Deal = require("../controllers/Deal"),
  User = require("../controllers/User"),
  bodyParser = require("body-parser"),
  rateLimit = require("express-rate-limit"),
  session = require("express-session");

router.use(bodyParser.json());
router.use(
  session({
    secret: "1886a34271ccb0faab64b2c07c3e4c58",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true }
  })
);
function checkArgs(req, argList) {
  for (var i = 0; i < argList.length; i++) {
    if (typeof req.body[argList[i]] == "undefined") return false;
  }
  return true;
}

var middleware = {
  auth: function(req, res, next) {
    if (!req.session.user) return res.status(401).json("Not Authorized");
  }
};
router.get("/deal", async (req, res) => {
  var sort = req.query.sort && { [req.query.sort]: -1 };
  var limit = parseInt(req.query.limit) || 10;
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
router.get("/deal/:id/related", async (req, res) => {
  var limit = parseInt(req.query.limit) || 5;
  try {
    var deal = await Deal.getById(req.params.id);
    if (!deal) return res.status(404).json("Deal Not Found");
    var query = { $ne: { id: req.params.id } };
    var category =
      deal.categories[Math.floor(Math.random() * deal.categories.length)];

    if (category) query.categories = category;
    var deals = await Deal.get({}, limit, query);
    res.json({ deals });
  } catch (e) {}
});

router.get("/deal/top", async (req, res) => {
  try {
    var limit = parseInt(req.body.limit) || 10;
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

router.get("/account/checkLogin", (req, res) => {
  var user = req.session.user;
  if (!user) return res.json({ user: null });
  res.json({ user: { ...user, password: undefined } });
});

router.post("/account/login", async (req, res) => {
  if (!checkArgs(req, ["username", "password"]))
    return res.status(400).json("Bad Request");
  try {
    var user = await User.login(req.body.username, req.body.password);
    if (!user) return res.status(404).json("Bad Login");
    req.session.user = user;
    res.json({ user: { ...user, password: undefined } });
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});

router.post("/deal/:title", middleware.auth, async (req, res) => {
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
router.post(
  "/deal/:id/upvote",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15 // limit each IP to 100 requests per windowMs
  }),
  async (req, res) => {
    try {
      if (await Deal.upvote(req.params.id)) res.json({ error: false });
      else res.status(404).json("Deal Not Found");
    } catch (e) {
      res.status(500).json("Server Error");
      console.error(e);
    }
  }
);
router.post("/category/:title", middleware.auth, async (req, res) => {
  try {
    var category = await Deal.createCategory(req.params.title);
    res.json(category);
  } catch (e) {
    res.status(500).json("Server Error");
    console.error(e);
  }
});

router.patch("/deal/:id", middleware.auth, async (req, res) => {
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

router.delete("/deal/:id", middleware.auth, async (req, res) => {
  try {
    var deal = await Deal.remove(req.params.id);
    res.json({ deal });
  } catch (e) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
