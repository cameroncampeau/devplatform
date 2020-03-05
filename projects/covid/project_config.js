module.exports.load = () => {
	require("../../DefaultServer").addRoute("/covid", require("./app"));
};
