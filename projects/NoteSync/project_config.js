var DefaultServer = require("./../../DefaultServer");
function load() {
  console.log("Loading NoteSync...");
  DefaultServer.addRoute("/notes/", require("./app"));
}
module.exports = { load };
