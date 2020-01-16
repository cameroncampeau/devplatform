var express = require("express"),
    app = express(),
    File = require("./controllers/File"),
    path = require("path");
var mime = require('mime-types'),
    rp = require("request-promise");

const port = 3080;


async function sendIP() {
    var options = {
        uri: "http://camc.xyz/projectredirect/redirect",
        method: "POST",
        body: JSON.stringify({
            name: "mediashare",
            username: "MEDIASHAREHOME",
            password: "5dca91fd4be53cc19ccc26a417fe5c27",
            port
        }),
        headers: {
            "content-type": "application/json"
        }
    }
    await rp(options)
    console.log("Updated IP with IP Tracker")
}
setInterval(sendIP, 8 * 60 * 60 * 1000); // every 8 hours
sendIP()
app.get("/", (req,res) => {
    res.sendFile(path.resolve(__dirname + "/index.html"));
});
app.get("/movie", async (req,res) => {
    try {
        var movies = await File.getMovies();
        res.json({movies})
    } catch(e) {
        console.error(e);
        res.status(500).json({error: true, message: "Server Error"})
    }
})
app.get("/movie/watch/*", async(req,res) => {
    res.sendFile(path.resolve(__dirname + "/video.html"));
})

app.get("/movie/:name/thumbnail/:i", async (req,res) => {
    console.log(req.params.name,req.params.i)
    var thumbnail_idx = parseInt(req.params.i);
    var thumbnailPaths = File.getThumbnailPaths(req.params.name);
    if (req.params.name == "21 Jump Street.avi") console.log(thumbnail_idx >= thumbnailPaths.length, thumbnailPaths,thumbnailPaths,thumbnail_idx)
    if (thumbnail_idx == NaN || thumbnail_idx >= thumbnailPaths.length) return res.status(400).json({error: "Bad Request"}) 
    res.sendFile(thumbnailPaths[thumbnail_idx])
});
app.get("/movie/:name", async (req,res) => {
    var p = File.getMovieFilePath(req.params.name);
    res.sendFile(p);
})
app.get("/movie/:name/info", async(req,res) => {
    return res.json({contentType: mime.lookup(File.getMovieFilePath(req.params.name))});
})

app.listen(port, (err) => {
    if (err) return console.error(e);
    console.log("listening", port)
});

