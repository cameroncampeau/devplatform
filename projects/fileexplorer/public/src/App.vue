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
    getParentPath: function () {
      for (var i = 1; i <= this.path.length; i++) {
        if (this.path[this.path.length - i] == "/" || this.path[this.path.length - i] == "\\") {
          return this.path.substring(0, this.path.length - i);
        }
      }
    },

    onFileClick: function a(filename) {
      var file = this.files.find(f => f.name == filename);
      if (!file.directory) return;
      this.path = file.path;
      this.refreshFileList();
    },
    refreshFileList: function() {
      var self = this;
      window.api.post("/dir", { path: this.path }).then(res => {
        res = JSON.parse(res);
        if (res.error) return;
        self.files = [{name: "..", directory:true, path: this.getParentPath()}].concat(res.files);
      });
    }
  },
  mounted: function() {
    this.refreshFileList();
  }
};
</script>
