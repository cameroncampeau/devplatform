var router = require("express").Router(),
  defaultDB = require("./../../DefaultDB"),
  ejs = require("ejs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  crypto = require("crypto"),
  cookieSession = require("cookie-session");

router.use(
  cookieSession({
    keys: [
      new Array(12)
        .fill(0)
        .map(e => {
          return String.fromCharCode(Math.floor(Math.random() * 50 * 90));
        })
        .join("")
    ]
  })
);
function createNote(name, owner) {
  return defaultDB.saveItem("note", { name, owner, content: "" });
}

function createUser(name, uname, password) {
  var cipher = crypto.createCipher("aes-256-cbc", password);
  password = cipher.update(password, "utf8");
  password += cipher.final("hex");

  return defaultDB.saveItem("note-user", {
    name,
    username: uname,
    password
  });
}
async function login(username, password) {
  var cipher = crypto.createDecipher("aes-256-cbc", password);
  var user = await defaultDB.getCollection("note-user").findOne({ username });
  if (!user) return null;
  console.log(password, user.password);
  try {
    var dec_password = cipher.update((user && user.password) || "", "hex");
    dec_password += cipher.final("utf8");
    return password == dec_password && user;
  } catch (e) {
    return null;
  }
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

async function init() {
  defaultDB.loadCollection("note");
  defaultDB.loadCollection("note-user");
}

var middleware = {
  auth: function(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).end("Not Authorized");
  }
};
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

router.get("/note/:id", middleware.auth, async (req, res) => {
  if (!req.params.id) return res.status(400).end("Bad Request");
  req.session.user = { name: "Default" };
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
