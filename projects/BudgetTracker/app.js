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
route.post("/api/goal", (req, res) => {
  if (!req.body.name || !req.body.target)
    return res.status(400).json("Bad Request");
  createGoal(req.body.name, parseFloat(req.body.target));
  return res.json({});
});

route.get("/api/goal", (req, res) => {
  res.json({ goals: getGoals() });
});

route.delete("/api/goal/:goal_id", (req, res) => {
  removeGoal(req.params.goal_id);
  res.json({});
});

route.post("/api/goal/:name/save", (req, res) => {
  if (!req.body.account || !req.body.amount)
    return res.status(400).json("Bad Request");
  addSavingsToGoal(req.params.name, req.body.amount, req.body.account);
  return res.json({});
});

module.exports = route;
