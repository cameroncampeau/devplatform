module.exports.load = function() {
    require("../../DefaultServer").addRoute("/jobsearch", require("./app"))
}