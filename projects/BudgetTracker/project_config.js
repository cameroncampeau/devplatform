module.exports = {
  load: () => {
    require("../../DefaultServer").addRoute("/budget", require("./app"));
  },
};
