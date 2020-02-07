module.exports.load = () => {
	require("../../DefaultServer").addRoute("/webnotes", require("./route"));
};
