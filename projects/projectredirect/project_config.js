module.exports.load = function() {
    require("../../DefaultServer").addRoute("/projectredirect",require("./app"));
}