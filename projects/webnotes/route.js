const express = require("express");
const route = express.Router();
const controllers = {
    Link: require("./controllers/ViewLink"),
    Note: require("./controllers/Note"),
    User: require("./controllers/User")
  },
  bodyParser = require("body-parser");

const middleware = {
  auth: (req, res, next) => {
    if (!req.session || !req.session.webnotes || !req.session.webnotes.user)
      return res.status(401).end("Not Authorized");
    next();
  }
};
route.use(bodyParser.json());
const session = require("express-session");
route.use(
  session({
    secret: Math.random().toString(32),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
route.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

route.post("/login", async (req, res) => {
  if (req.session && req.session.webnotes && req.session.webnotes.user)
    return res.json(req.session.webnotes.user);
  if (!req.body.username || !req.body.password)
    return res.status(400).end("Bad Request");
  try {
    var user = await controllers.User.login(
      req.body.username,
      req.body.password
    );
    if (!user) return res.status(401).end("User not found");
    if (!req.session) req.session = {};
    req.session.webnotes = { user };
    res.json({ username: user.username });
  } catch (e) {
    console.error(e);
    res.status(500).end("Server Error");
  }
});

route.get(["/note", "/n"], middleware.auth, async (req, res) => {
  try {
    var notes = await controllers.Note.getByCreator(
      req.session.webnotes.user.username
    );
    res.json({ notes });
  } catch (e) {
    res.status(500).end("Server Error");
  }
});

route.get("/note/:id", middleware.auth, async (req, res) => {
  try {
    var note = await controllers.Note.get(req.params.id);
    res.json({ note });
  } catch (e) {
    res.status(500).end("Server Error");
  }
});

const buildViewTemplate = require("./template").build;
route.get(["/note/view/:id", "/n/v/:id", "/v/:id"], async (req, res) => {
  try {
    var link = await controllers.Link.get(req.params.id);
    if (!link) return res.status(404).end("Not Found");
    var note = await controllers.Note.get(link.note);
    if (!note) return res.status(404).end("Note not Found");
    res.send(buildViewTemplate(note.body));
  } catch (e) {
    console.error(e);
    res.status(500).end("Server Error");
  }
});

route.get(
  "/note/view/create/:key/:note_id",
  middleware.auth,
  async (req, res) => {
    try {
      await controllers.Link.create(req.params.key, req.params.note_id);
      res.redirect("/webnotes/v/" + req.params.key);
    } catch (e) {
      console.error(e);
      res.status(500).end("Server Error");
    }
  }
);

route.post("/note", middleware.auth, async (req, res) => {
  if (!req.session.webnotes || !req.session.webnotes.user)
    return res.status(401).end("Not Authorized");
  if (!req.body.title) return res.status(400).end("Bad Request");
  try {
    var note = await controllers.Note.create(
      req.session.webnotes.user.username,
      req.body.title,
      ""
    );
    res.json({ note });
  } catch (e) {
    res.status(500).end("Server Error");
    console.error(e);
  }
});

route.patch("/note/:id", middleware.auth, async (req, res) => {
  if (!req.body.body) return res.status(400).end("Bad Request");
  try {
    await controllers.Note.updateBody(req.params.id, req.body.body);
    res.json({ body: req.body.body });
  } catch (e) {
    res.status(500).end("Server Error");
  }
});
module.exports = route;
