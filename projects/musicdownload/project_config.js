var DefaultServer = require("./../../DefaultServer");
module.exports = {};
module.exports.load = function() {
  var route = require("./app.js");
  DefaultServer.addRoute("/videodownload", route);
};
