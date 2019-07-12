var router = new require("express").Router(),
  defaultServer = require("./../../DefaultServer");

function load() {
  router.get("/", (req, res) => res.send("hello"));

  defaultServer.addRoute("/", router);
}

module.exports = { load };
