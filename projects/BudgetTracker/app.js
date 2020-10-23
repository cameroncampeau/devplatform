var express = require("express");
var db = require("../../DefaultDB");
var route = new express.Router();

const COLLECTION_NAME = "BUDGET_TRACKER-goals";

db.loadCollection(COLLECTION_NAME);

function createGoal(name, target) {
  db.saveItem(COLLECTION_NAME, { name, target, saved: [] });
}

function addSavingsToGoal(goal_name, amount, account) {
  var goal = db.getCollection(COLLECTION_NAME).findOne({ name: goal_name });
  goal.saved.push({ amount, account, date: Date.now() });
  db.getCollection(COLLECTION_NAME).update({ name: goal_name }, goal);
}

function removeSavingsFromGoal(goal_name, amount, account) {
  var goal = db.getCollection(COLLECTION_NAME).findOne({ name: goal_name });
  var found = false;
  goal.saved = goal.saved.filter((saving) => {
    if (found) return true;
    else if (saving.amount == amount && saving.account == account) {
      found = true;
      return false;
    } else return true;
  });
  db.getCollection(COLLECTION_NAME).update({ name: goal_name }, goal);
}
function removeGoal(id) {
  db.getCollection(COLLECTION_NAME).remove({ _id: id });
}
function getGoals() {
  return db.getCollection(COLLECTION_NAME).find();
}

var path = require("path");
route.use(
  "/static",
  express.static(path.resolve(__dirname + "/public/dist/static"))
);
route.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname + "/public/dist/index.html"))
);
route.use(express.json());
const session = require("express-session");
const SESSION_SECRET =
  "sad889sd*(DyDAY&S*Y&*(Y&*((@Y&*H(D@NiasiubdHB&*!@bh8DBHUY";

route.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true },
  })
);

var assert_logged_in = (req, res, next) => {
  if (!req.session.budget_user) return res.status(401).json("Not Authorized");
  next();
};

route.get("/api/login", (req, res) => {
  res.json(!!req.session.budget_user);
});
route.post("/api/login", (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.status(400).json("Bad Request");
  if (req.body.username !== "cameron" || req.body.password !== "c1234567")
    return res.status(401).json("Not Authorized");
  req.session.budget_user = {
    username: "cameron",
  };
  res.json({});
});

route.post("/api/goal", assert_logged_in, (req, res) => {
  if (!req.body.name || !req.body.target)
    return res.status(400).json("Bad Request");
  createGoal(req.body.name, parseFloat(req.body.target));
  return res.json({});
});

route.get("/api/goal", assert_logged_in, (req, res) => {
  res.json({ goals: getGoals() });
});

route.delete("/api/goal/:goal_id", assert_logged_in, (req, res) => {
  removeGoal(req.params.goal_id);
  res.json({});
});

route.post("/api/goal/:name/save", assert_logged_in, (req, res) => {
  if (!req.body.account || !req.body.amount)
    return res.status(400).json("Bad Request");
  addSavingsToGoal(req.params.name, req.body.amount, req.body.account);
  return res.json({});
});

route.delete("/api/goal/:name/save", assert_logged_in, (req, res) => {
  if (!req.body.account || !req.body.amount)
    return res.status(400).json("Bad Request");
  removeSavingsFromGoal(req.params.name, req.body.amount, req.body.account);
  return res.json({});
});

module.exports = route;
