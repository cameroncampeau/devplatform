<style lang="scss">
</style>
<template>
  <div class="m-3">
    <h3>Available Files</h3>
    <ul class="list-group">
      <li v-for="download in downloads" class="list-group-item">
        <a v-bind="{href: 'video/' + download}" target="_blank" class download>{{download}}</a>
      </li>
    </ul>
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
    }
  },
  mounted: function() {
    this.getDownloads();
  }
};
</script>