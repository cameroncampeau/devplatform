var express = require("express");
var route = new express.Router();
var DefaultDB = require("../../DefaultDB");
var bodyParser = require("body-parser");

route.use(bodyParser.json());


const JOB_COLLECTION_NAME = "jobs-applied";
DefaultDB.loadCollection(JOB_COLLECTION_NAME);

function Job({name, company, url, time}) {
    return {name, company, url, time};
}

function saveJob(job) {
    DefaultDB.saveItem(JOB_COLLECTION_NAME, job);
}

route.post("/Job", async (req,res) => {
    if (!req.body.name || !req.body.company) return res.status(400).end("Bad Request");

    var job = new Job(req.body);
    saveJob(job);
    return job;
})

route.get("/Job", async (req,res) => {
    res.json(await DefaultDB.getCollection(JOB_COLLECTION_NAME).find({}));
})
route.get("/Job/:name", async (req,res) => {
    var job = DefaultDB.getCollection(JOB_COLLECTION_NAME).find({name: req.params.name})
    if (!job) return res.status(404).end("not found")
    res.json(job);
})


module.exports = route;