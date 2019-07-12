var express = require("express"),
  app = express();

function addRoute(path, router) {
  app.use(path, router);
}

function start(port) {
  port = port || 80;
  app.listen(port);
  console.log("Starting default server on port", port);
}

module.exports = { addRoute, start };
