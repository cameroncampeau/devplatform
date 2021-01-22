# Music Downloader
I designed this app to explore the functionality of ffmpeg, a library for converting video files to audio. In this app, I integrated with the Youtube API to allow users to download videos as MP3s given a video URL. 

## Setup
The app can be started using DevPlatform with the command:
`node app.js musicdownload`

It can also be brought into an existing application by importing the express router from the app.js

```
const music_download_app = require(./app.js);
const app = require("express")();
app.use("/music", music_download_app);
```