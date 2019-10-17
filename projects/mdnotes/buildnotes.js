var fs = require("fs"),
    path  = require("path")

function getSources() {
    var files = fs.readdirSync(__dirname);
    var source_files = [];
    files.forEach(file => {
        if (file.split(".").pop() == "md" && file != "notes.md" && file != "images.md") source_files.push(file);
    })

    source_files = source_files.sort((a,b) => a - b);
    return source_files;
}
function getSourceText(filename) {
    return fs.readFileSync(path.resolve(__dirname + "/" + filename))
}
function createNotes() {
    var sources = getSources().concat(["images.md"]);
    var notes_text = "";
    sources.forEach(s => {console.log(s); notes_text += "\n" + getSourceText(s)})

    var header_text = fs.readFileSync(path.resolve(__dirname + "/header.html"))
    var footer_text = fs.readFileSync(path.resolve(__dirname + "/footer.html"))

    fs.writeFileSync(__dirname + "/notes.html", header_text + notes_text + footer_text);

}
createNotes();