const express = require("express"),
    multer = require("multer"),
    imageUpload = multer({dest: "images/raw"}),
    Image = require("./controllers/Image"),
    path = require("path"),
    db = require("./../../DefaultDB"),
    session = require("express-session"),
    fs = require("fs");

const SESSION_KEY = fs.readFileSync(path.resolve(__dirname + "/keys/session.key"));



var app = express();


app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.post("/image/convert/:type", imageUpload.single("file"), async (req,res) => {
    if (!req.file) return res.status(400).end("Bad Request");
    Image.create(req.file);
    var newImageName = await Image.convertTo(req.file, req.params.type);
    if (!req.session.filenames) req.session.filenames = [];
    req.session.filenames.push(req.file.filename);
    res.json({error: false, filename: req.file.filename})
})

app.use("/dist", express.static(path.resolve(__dirname + "/public/dist/")));

app.get("/", (req,res) => {
    res.sendFile(path.resolve(__dirname + "/public/index.html"));
})

app.get("/image/:filename", async (req,res) => {
    var image = await Image.get(req.params.filename);
    if (!image.processedType) return res.status(400).end("Not Found")
    var newName = image.originalname.replace(path.extname(image.originalname), "") + "." + image.processedType;
    res.setHeader("content-type", "image/" + image.processedType);
    res.setHeader("Content-Disposition", "inline; filename=" + newName)
    res.sendFile(path.resolve(__dirname + "/images/processed/" + req.params.filename + "." + image.processedType));
})

app.listen(80);