const path = require("path");
const MOVIE_FOLDER_PATH = path.resolve("G://Movies"),
        MOVIE_THUMBNAIL_FOLDER_PATH = path.resolve(__dirname + "/../thumbnails") + "/"
const fs = require("fs").promises;
const videoThumbnail = require('simple-thumbnail')

const THUMBNAIL_TIMES = ['00:01:22', '00:05:00', '00:10:00', '00:25:00']
const Thumbler = require('thumbler');
 

function getVideoThumbnailName(videoName) {
    return videoName + ".thumb.jpeg";
}
function getThumbnailPath(videoName) {
    return MOVIE_THUMBNAIL_FOLDER_PATH + "/" + getVideoThumbnailName(videoName);
}
function getThumbnailPaths(videoName) {
    return THUMBNAIL_TIMES.map((TIME, i) => MOVIE_THUMBNAIL_FOLDER_PATH + "/" + getVideoThumbnailName(videoName + "." + i));
}
function createThumbnail(videoName) {
    var promises = []
    THUMBNAIL_TIMES.forEach((THUMBNAIL_TIME,i) => {
        promises.push(
            new Promise((resolve, reject) => {
                Thumbler({
                        type: 'video', 
                        input:  getMovieFilePath(videoName) ,
                        output: getThumbnailPath(videoName + "." + i), 
                        time: THUMBNAIL_TIME,
                        size: '300x200' 
                }, function(err, path){
                    if (err) reject(err);
                    console.log(videoName, "thumbnail created",path)
                    resolve(path);
                });
            })
        )
    })
}
async function hasThumbnail(videoName) {
    try{
        await fs.access(getThumbnailPaths(videoName)[0])
        return true;
    } catch(e) {
        console.error(e)
        return false;
    }
}
function fileToFriendlyName(fileName) {
    var f = fileName.split(".");
    if (f.length > 1)f.pop();
    return f.join("");
}
async function ensureVideoHasThumbnail(videoName) {
    if (!(await hasThumbnail(videoName))) {
        try {
            await createThumbnail(videoName)
        } catch(e) {
            console.error("Error creating thumbnail for", videoName);
            console.error(e)
        }
    }
}
var i = 0;
async function getMovies() {
    return (await fs.readdir(MOVIE_FOLDER_PATH)).map((m) => {
        i++;
        if (i < 300) ensureVideoHasThumbnail(m)
        return {name: fileToFriendlyName(m), fileName:m} 
    })
}
function getMovieFilePath(fileName) {
    return path.resolve(MOVIE_FOLDER_PATH + "/" + fileName)
}
module.exports = {getMovies,getMovieFilePath,getThumbnailPaths}