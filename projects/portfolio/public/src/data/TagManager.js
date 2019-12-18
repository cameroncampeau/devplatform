var fs = require("fs"),
	path = require("path");

	
var TAGS_FILE_PATH = path.resolve("C:/Users/Admin/Desktop/DevPlatform/Projects/Portfolio/public/src/data/ProjectTags.json");

var tagStruct = {},
	tags= require(TAGS_FILE_PATH),
	topLevelCategories = [],
	currentCategory = null,
	currPath = [];
	

function generateTagStructure() {
	/*
		Format: 
		{
			tag: [arr of child tags]
		}
		
	*/
	function addChildTag(parent, child) {
		if (tagStruct[parent]) tagStruct[parent].push(child);
		else tagStruct[parent] = [child];
	}
	
	var tagStruct = {};
	tags.forEach(t => {
		if (!t.parentCategory) {
			topLevelCategories.push(t);
			if (!tagStruct[t.name]) tagStruct[t.name] = [];
		} else {
			if (typeof t.parentCategory == "object") {
				t.parentCategory.forEach(p => addChildTag(p, t));
			} else addChildTag(t.parentCategory, t);
		}
		if (!tagStruct[t.name]) tagStruct[t.name] = [];
	});
	
	return tagStruct;
}

function listenForInput() {
	process.stdin.addListener("data", function(input) {
		input = input.toString().trim();
		processCommand(input);
	});
}

function printCategory() {
	var str = "";
	if (!currentCategory) topLevelCategories.forEach(c => str += c.name + '\t');
	else {
		console.log("==",currentCategory,"==")
		if (tagStruct[currentCategory].length == 0) str = "No categories found";
		else tagStruct[currentCategory].forEach(t => str += t.name + '\t');
	}
	console.log(str);
}
function prevCategory() {
	if (!currentCategory) return;
	
}
function navTo(categoryName) {
	// Prev category special case
	if (categoryName == "..") {
		var newCat = currPath.pop();
		if (newCat) categoryName = newCat;
		else categoryName = null;
	}
	else if (currentCategory && !tagStruct[currentCategory].find(t => t.name == categoryName))return false;
    else if (!currentCategory && !topLevelCategories.find(c => c.name == categoryName)) return false;
	if (currentCategory != null) currPath.push(currentCategory);
	currentCategory = categoryName;
	return true;
	
}
function addTag(tagName) {
	var tag = {name:tagName};
	if (currentCategory) {
		tag.parentCategory = currentCategory;
		tagStruct[currentCategory].push(tag);
	} else topLevelCategories.push(tag);
		tagStruct[tagName] = [];
	
	tags.push(tag);
}
function removeTag(tagName) {
	if (!currentCategory) {
		if (!topLevelCategories.find(c => c.name == tagName)) return false;
		topLevelCategories = topLevelCategories.filter(c => c.name != tagName);
		
	} else {
		if (!tagStruct[currentCategory].find(t => t.name == tagName)) return false;
		tagStruct[currentCategory] = tagStruct[currentCategory].filter(t => t.name != tagName);
	}
	tags = tags.filter(t => t.name != tagName);
	delete tagStruct[tagName];
	return true;
}
function saveTags() {
	fs.writeFile(TAGS_FILE_PATH, JSON.stringify(tags), (err) => {
		if (err) console.log("Error saving tags:\n", err);
	});
}
function processCommand(commandStr) {
	var [command, arg] = commandStr.split(" ");
	switch(command) {
		case "a":
		case "add": 
			addTag(arg);
			console.log("Added", arg);
			break;
		case "go":
		case "cd":
			if (!navTo(arg)) console.log("Could not navigate to", arg);
			break;
		case "r":
		case "rm":
		case "remove":
			if (!removeTag(arg)) console.log("Could not remove", arg);
			break;
		case "s":
		case "save":
			saveTags();
			break;
		case "/":
			currentCategory = null;
			break;
		default:
			console.log("Command not recognized:",command);
			break;
			
	}
	printCategory();
}
function init() {
	tagStruct = generateTagStructure();
	listenForInput();
	printCategory();
}
init()