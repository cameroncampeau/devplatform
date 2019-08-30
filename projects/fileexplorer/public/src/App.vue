<template>
  <div id="app">
    <h4 class="bg-light p-3">{{path}}</h4>
    <file v-for="file in files" v-on:fileClick="onFileClick" v-bind="file"></file>
  </div>
</template>

<script>
import File from "./components/File.vue";

export default {
  name: "app",
  data: function() {
    return {
      files: [],
      path: "C://"
    };
  },
  components: {
    File
  },
  methods: {
    onFileClick: function a(filename) {
      var file = this.files.find(f => f.name == filename);
      console.log(file);
      if (!file.directory) return;
      this.path = file.path;
      this.refreshFileList();
    },
    refreshFileList: function() {
      var self = this;
      window.api.post("/dir", { path: this.path }).then(res => {
        res = JSON.parse(res);
        if (res.error) return;
        self.files = res.files;
      });
    }
  },
  mounted: function() {
    this.refreshFileList();
  }
};
</script>
