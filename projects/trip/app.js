var express = require("express");
var path = require("path");
var fs = require("fs").promises;
var route = new express.Router();
route.use(express.json());
const DATE_FILE_PATH = path.resolve(__dirname + "/db/dates.json");

async function getDates() {
  return JSON.parse(await fs.readFile(DATE_FILE_PATH));
}

async function addDate(start, end, creator = null) {
  var votes = [creator];
  var nays = [];
  var dates = await getDates();
  var date = { start, end, votes, creator, nays };
  dates.push(date);
  await saveDates(dates);
  return date;
}

async function saveDates(dates) {
  return await fs.writeFile(DATE_FILE_PATH, JSON.stringify(dates));
}

route.post("/date/:start/:end/nay", async (req, res) => {
  var { start, end } = req.params;
  var { user } = req.body;
  console.log({ user });
  try {
    var dates = await getDates();
    var date = dates.find((d) => d.start == start && d.end == end);
    if (!date) return res.status(404).json("Date not found");
    date.votes = date.votes.filter((voter) => voter != user);
    date.nays = Array.from(new Set(date.nays).add(user)); //only allow user vote one time
    if (date.votes.length === 0) dates = dates.filter((d) => d !== date);
    await saveDates(dates);
    return res.json({ date });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
});

route.post("/date/:start/:end/vote", async (req, res) => {
  var { start, end } = req.params;
  var { user } = req.body;
  try {
    var dates = await getDates();
    var date = dates.find((d) => d.start == start && d.end == end);
    if (!date) return res.status(404).json("Date not found");
    date.nays = date.nays.filter((nay_voter) => nay_voter != user);
    date.votes = Array.from(new Set(date.votes).add(user)); //only allow user vote one time
    await saveDates(dates);
    return res.json({ date });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
});

route.post("/date", async (req, res) => {
  var { start, end, user } = req.body;
  if (!start || !end || !user) return res.status(400).json("Bad Request");

  try {
    var date = await addDate(start, end, user);
    return res.json({ date });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
});

route.get("/date", async (req, res) => {
  try {
    res.json({ dates: await getDates() });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
});

route.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/index.html"));
});

module.exports = route;
