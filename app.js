var fs = require("fs"),
	path = require("path"),
	PortTracker = require("./PortManager"),
	DefaultServer = require("./DefaultServer"),
	process = require("process");

var projects = [];
function print_port_usage() {
	console.log("Ports in use:", PortTracker.getUsedPorts());
}
function loadProject(folder) {
	var folderPath = path.resolve(__dirname + "/projects/" + folder);
	var project_files = fs.readdirSync(folderPath);
	if (!project_files.find(f => f == "project_config.js")) return;
	var config = require(folderPath + "/project_config.js");
	projects.push({ folder, config });
	if (config.load) config.load();
}
function load_projects() {
	function isFolder(fileName) {
		return fs
			.lstatSync(path.resolve(__dirname + "/projects") + "/" + fileName)
			.isDirectory();
	}
	if (process.argv.length > 2) return loadProject(process.argv[2]);
	var project_folders = fs.readdirSync(path.resolve(__dirname + "/projects"));

	project_folders.forEach(project_folder => {
		try {
			if (isFolder(project_folder)) loadProject(project_folder);
		} catch (e) {
			console.error("Error loading project", project_folder);
			console.error(e);
		}
	});
}

function init() {
	DefaultServer.start();
	load_projects();
	print_port_usage();
}
init();
