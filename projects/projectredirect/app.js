var express = require("express"),
    router = express.Router(),
    db = require("../../DefaultDB"),
    bodyParser = require("body-parser");
const COLLECTION_NAME = "project_redirects",
    USERNAME = "MEDIASHAREHOME",
    PASSWORD = "5dca91fd4be53cc19ccc26a417fe5c27";
db.loadCollection(COLLECTION_NAME)
router.use(bodyParser.json());
router.post("/redirect", (req,res) => {
    var {username, password, name,port} = req.body;
    if (!username || !password || !name) return res.end();
    if (username != USERNAME || password != PASSWORD) return res.end();
    var ip = req.ip.split(":").pop();
    db.getCollection(COLLECTION_NAME).remove({name});
    db.saveItem(COLLECTION_NAME, {name, ip,port});
    res.send({name, ip,port})
});

router.get("/redirect/:username/:password/:id", async (req,res) => {
    var {username, password, id} = req.params;
    if (!username || !password || !id) return res.end();
    if (username != USERNAME || password != PASSWORD) return res.end();
    var record = await db.getCollection(COLLECTION_NAME).findOne({name: id});
    res.json(record);
});
router.get("/mediashare", async (req,res) => {
    var record = await db.getCollection(COLLECTION_NAME).findOne({name: "mediashare"});
    console.log("http://" + record.ip + ":" + record.port)
    res.redirect("http://" + record.ip + ":" + record.port);
})

module.exports = router;