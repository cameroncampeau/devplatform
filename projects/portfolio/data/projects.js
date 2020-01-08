var process = require("process"),
    fs = require("fs").promises,
    path = require("path");


var page = "home",
    pageArgs = {};

const PROJECTS_FILE_PATH =  path.resolve(__dirname + "/projects.json")

async function saveProjects(projects) {
    return await fs.writeFile(PROJECTS_FILE_PATH, JSON.stringify(projects))
}
async function getProjects() {
    var text = await fs.readFile(PROJECTS_FILE_PATH)
    return JSON.parse(text);
}
async function listProjects() {
    var projects = await getProjects();
    console.log("Projects:")
    projects.forEach((project,i) => {
        console.log(`[${i}] ${project.name}`)
    });
}
async function viewProject(index) {
    var projects = await getProjects();
    var project = projects[index]
    if (!project) return console.error(`Index out of bounds. ${index} not in [0, ${projects.length}})`) && false
    
    console.log(`Name: ${project.name}`)
    console.log(`Description: ${project.description}`)
    console.log(`Tags: ${(project.tags || []).join(",")}`)
    console.log(`URL: ${project.url}`)
    return true;
}
function setPage(newPage, newPageArgs={}) {
    page = newPage;
    pageArgs = newPageArgs;
}
async function handleCommand(command, args) {
    async function homeCommand() {
        console.log("home",command)
        switch(command) {
            case "l":
            case "list":
                listProjects();
                break;
            case "v":
            case "view":
                if (!args || !args[0]) return console.error("No index given")
                var projectNum = parseInt(args[0]);
                if (viewProject(projectNum)) pageArgs.project = projectNum;
            case "a":
            case "add":
            case "c":
            case "create":
                createCommand()
                return;
            case "e":
            case "edit":
                if (pageArgs.project && !args[0]) args[0] = pageArgs.projectNum;
                return editCommand();
        }
    }
    async function editCommand() {
        if (page != "edit") {
            var projectIndex = parseInt(args[0]);
            if (await viewProject(projectIndex)) setPage("edit", {projectIndex, stage: "name"})
            console.log("=============================")
            console.log("Enter Project Name:")
            return
        }
        switch(pageArgs.stage) {
            case "name":
                pageArgs.name = command;
                pageArgs.stage = "description"
                console.log("Description:")
                break;
            case "description":
                pageArgs.description = command;
                pageArgs.stage = "tags"
                console.log("Tags:")
                break;
            case "tags":
                pageArgs.tags = [command].concat(args || []);
                pageArgs.stage = "url"
                console.log("URL:")
                break;
            case "url":
                var projects = await getProjects();
                var {name, description, tags} = pageArgs;
                projects[pageArgs.projectIndex] = {name, description, tags, url: command};
                await saveProjects(projects);
                viewProject(pageArgs.projectIndex);
                setPage("home")
                break;
        }


    }
    async function createCommand() {
        if (page != "create") {
            setPage("create", {stage: "name"});
            console.log("Enter Project Name:")
            return
        }
        switch(pageArgs.stage) {
            case "name":
                pageArgs.name = command;
                pageArgs.stage = "description"
                console.log("Description:")
                break;
            case "description":
                pageArgs.description = command;
                pageArgs.stage = "tags"
                console.log("Tags:")
                break;
            case "tags":
                pageArgs.tags = [command].concat(args || []);
                pageArgs.stage = "url"
                console.log("URL:")
                break;
            case "url":
                var projects = await getProjects();
                var {name, description, tags} = pageArgs;
                projects.push({name, description, tags, url: command});
                await saveProjects(projects);
                viewProject(projects.length-1);
                setPage("home");
                break;
        }

    }
    switch (page) {
        case "home": 
            homeCommand();
            break;
        case "create":
            createCommand();
            break;
        case "edit":
            editCommand();
            break;
        case "list":
            listProjects();
            break;
        default: 
            console.error("Invalid State", page, pageArgs);
            return;
    }
}
function onInput(input) {
    input = input.toString().trim();
    var tokens = input.split(" ");
    handleCommand(tokens[0], tokens.slice(1))
}
function printCommands() {
    switch(page) {
        case "home":
            console.log("list [l]: List all projects")
            console.log("edit [e] <idx>: Edit project #idx")
            console.log("view [v] <idx>: View project #idx");
            break;
    }
}
process.openStdin().addListener("data", onInput)
printCommands();