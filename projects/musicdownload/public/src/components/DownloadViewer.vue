<style lang="scss">
</style>
<template>
  <div class="m-3">
    <h3>Available Files</h3>
    <ul class="list-group">
      <li v-for="download in downloads" class="list-group-item pr-3">
        <a v-bind="{href: 'video/' + download}" target="_blank" download>{{download}}</a>
        <i class="fa fa-times float-right" v-on:click="deleteDownload(download)"></i>
      </li>
    </ul>
    <button id="downloadAll" v-on:click="downloadAll" class="btn btn-primary">
      <i class="fa fa-download mr-2"></i>Download All
    </button>
    <button v-on:click="deleteAllDownloads" class="btn btn-danger">
      <i class="fa fa-trash mr-2"></i>Delete All
    </button>
  </div>
</template>
<script>
export default {
  data: function() {
    return { downloads: [] };
  },
  methods: {
    getDownloads: function() {
      $.get("video").then(downloads => {
        this.downloads = downloads;
      });
    },
    downloadAll: function() {
      this.$el.querySelectorAll("ul > li a").forEach(e => e.click());
    },
    deleteDownload: function(d) {
      $.ajax({
        method: "delete",
        url: "video/" + d
      })
        .then(() => {
          this.getDownloads();
        })
        .catch(e => {
          console.error(e);
        });
    },
    deleteAllDownloads: function() {
      if (!confirm("Are you sure you want to delete all?")) return;
      this.downloads.forEach(d => {
        this.deleteDownload(d);
      });
    }
  },
  mounted: function() {
    this.getDownloads();
    this.timerId = setInterval(this.getDownloads, 2000);
  }
};
</script>