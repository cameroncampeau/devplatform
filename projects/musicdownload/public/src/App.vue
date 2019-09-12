<template>
  <div id="app">
    <video-downloader></video-downloader>
    <download-viewer></download-viewer>
  </div>
</template>

<script>
import VideoDownloader from "./components/VideoDownloader.vue";
import DownloadViewer from "./components/DownloadViewer.vue";
export default {
  name: "app",
  components: { VideoDownloader, DownloadViewer }
};
</script>
