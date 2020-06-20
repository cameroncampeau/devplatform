module.exports = {
  load() {
    require("../../DefaultServer").addRoute("/trip", require("./app"));
  },
};
