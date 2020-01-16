module.exports.load = function() {
	require("./../../DefaultServer").addRoute("/dogs", require("./app"));
};
