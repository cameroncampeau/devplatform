var router = require("express").Router(),
  defaultDB = require("./../../DefaultDB"),
  ejs = require("ejs"),
  path = require("path"),
  bodyParser = require("body-parser");

function createNote(name, owner) {
  defaultDB.saveItem("note", { name, owner, content: "" });
}

async function getNote(id) {
  return await defaultDB.getCollection("note").findOne({ _id: id });
}
async function getNotes() {
  return await defaultDB.getCollection("note").find();
}
async function updateNote(id, content) {
  return await defaultDB.getCollection("note").update({ _id: id }, { content });
}
function init() {
  defaultDB.loadCollection("note");
}

router.get("/", async (req, res) => {
  var notes = await getNotes();
  ejs.renderFile(
    path.resolve(__dirname + "/views/index.ejs"),
    { notes },
    (err, text) => {
      res.send(text);
    }
  );
});
router.post("/create", bodyParser.json(), (req, res) => {
  if (!req.body.owner || !req.body.title)
    return res.status(400).json({ error: true, message: "Bad Request" });

  var { title, owner } = { ...req.body };

  createNote(title, owner);
  res.json({ error: false });
});

router.get("/note/:id", async (req, res) => {
  if (!req.params.id) return res.status(400).end("Bad Request");
  var note = await getNote(req.params.id);
  ejs.renderFile(
    path.resolve(__dirname + "/views/note.ejs"),
    { note: note },
    (err, text) => {
      if (err)
        return res.status(500).end(JSON.stringify(err)) && console.error(err);
      res.send(text);
    }
  );
});
router.post("/note/:id", bodyParser.json(), async (req, res) => {
  if (!req.params.id || !req.body.content)
    return res.status(400).end("Bad Request");
  await updateNote(req.params.id, req.body.content).catch(e => {
    res.status(500).end(JSON.stringify(e));
    console.error(e);
  });
  res.json({ error: false });
});
init();

module.exports = router;
