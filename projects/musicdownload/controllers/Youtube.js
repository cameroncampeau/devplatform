var YoutubeMp3Downloader = require("youtube-mp3-downloader"),
  path = require("path"),
  getVideoInfo = require("youtube-info"),
  fs = require("fs");

const FFMPEG_INSTALL_PATH = path.resolve(
    "C://Program Files/ffmpeg/bin/ffmpeg.exe"
  ),
  OUT_PATH = path.resolve(__dirname + "/../files");

var YD = new YoutubeMp3Downloader({
  ffmpegPath: FFMPEG_INSTALL_PATH, // Where is the FFmpeg binary located?
  outputPath: OUT_PATH, // Where should the downloaded and encoded files be stored?
  youtubeVideoQuality: "highest", // What video quality should be used?
  queueParallelism: 2, // How many parallel downloads/encodes should be started?
  progressTimeout: 500 // How long should be the interval of the progress reports
});

var listeners = {};
//{"videoId":"Vhd6Kc4TZls","stats":{"transferredBytes":11902266,"runtime":35,"averageSpeed":344993.22},"file":"C:\\Users\\Admin\\Desktop\\devplatform\\projects\\musicdownload\\files/Cold Funk - Funkorama.mp3","youtubeUrl":"http://www.youtube.com/watch?v=Vhd6Kc4TZls","videoTitle":"Cold Funk - Kevin MacLeod (No Copyright Music)","artist":"Cold Funk","title":"Kevin MacLeod (No Copyright Music)","thumbnail":"https://i.ytimg.com/vi/Vhd6Kc4TZls/hqdefault.jpg?sqp=-oaymwEiCKgBEF5IWvKriqkDFQgBFQAAAAAYASUAAMhCPQCAokN4AQ==&rs=AOn4CLB-RJ4BV6i30vzwD855QtyizDb0zg"}
function onDownloadFinished(err, data) {
  if (err) return;
  var id = data.videoId;
  if (id in listeners) listeners[id].onFinish(data.stats);
}
//{"videoId":"Vhd6Kc4TZls","progress":{"percentage":98.86310724361226,"transferred":11766950,"length":11902266,"remaining":135316,"eta":0,"runtime":30,"delta":32768,"speed":388990.0826446281}}
function onProgess(data) {
  var id = data.videoId;
  if (id in listeners) listeners[id].onProgress(data.progress);
}

function onError(err, data) {
  if (!data) return console.error(err);
  var id = data.videoId;
  if (id in listeners) listeners[id].onError(err);
}
function download(id, name, onProgress, onFinish, onError) {
  YD.download(id, name);
  listeners[id] = { onProgress, onFinish, onError };
}

YD.on("progress", onProgess);
YD.on("finished", onDownloadFinished);
YD.on("error", onError);

function getSavedVideos() {
  return new Promise((resolve, reject) => {
    fs.readdir(OUT_PATH, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
}
function getDownloadPath(title) {
  return path.resolve(OUT_PATH + "/" + title);
}

module.exports = { download, getVideoInfo, getSavedVideos, getDownloadPath };
