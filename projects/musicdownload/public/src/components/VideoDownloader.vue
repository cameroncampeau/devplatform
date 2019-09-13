<style lang="scss">
.videoInfo {
  .thumb {
    width: 200px;
    height: (9 / 16) * 200 + px;
  }
}
.hidden {
  display: none !important;
}
</style>
<template>
  <div class="video-downloader">
    <div class="video-info">
      <form v-on:submit.prevent="getVideoInfo">
        <label>
          Url
          <input type="text" id="videoUrl" />
        </label>
        <button>Get Video Info</button>
      </form>
    </div>
    <div class="videoInfo hidden d-flex justify-content-center align-items-center">
      <form v-on:submit.prevent="downloadVideo">
        <div class="input-group">
          <input type="text" class="title w-100" />
        </div>
        <p class="small desc"></p>
        <img src alt class="thumb" />
        <button type="submit" class="download btn btn-primary">Download</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      videoId: null,
      videoInfo: null
    };
  },
  components: {},
  methods: {
    getVideoInfo: function(e) {
      function urlToId(url) {
        function shorturl() {
          var tokens = url.split("/");
          return tokens[tokens.length - 1];
        }
        var video_id = url.split("v=")[1];
        if (!video_id) return shorturl();
        var ampersandPosition = video_id.indexOf("&");
        if (ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
      }
      var url = e.target.querySelector("input#videoUrl").value;
      this.videoId = urlToId(url);
      $.get("video/" + this.videoId + "/info")
        .then(videoInfo => {
          this.videoInfo = videoInfo;
          this.makeTitleFriendly();
          var container = this.$el.querySelector(".videoInfo");
          container.className = container.className.replace("hidden", "");
          container.querySelector(".title").value = videoInfo.title;
          container.querySelector(".desc").innerHTML = videoInfo.description;
          container.querySelector(".thumb").src = videoInfo.thumbnailUrl;
        })
        .catch(e => {
          console.error(e);
        });
    },
    downloadVideo: function() {
      $.post("video/" + this.videoId + "/download", {
        name: this.$el.querySelector(".videoInfo .title").value
      })
        .then(data => {
          console.log(data);
        })
        .catch(e => {
          console.error(e);
        });
    },
    makeTitleFriendly: function() {
      function removeAll(pattern) {
        str = str.split(pattern).join("");
      }
      function stripBadChars() {
        var newStr = "";
        const MAX_CHAR_VAL = "z".charCodeAt(0),
          MIN_CHAR_VAL = "A".charCodeAt(0);
        for (var i = 0; i < str.length; i++) {
          var code = str.charCodeAt(i);
          if ((code < MIN_CHAR_VAL || code > MAX_CHAR_VAL) && str[i] != " ")
            continue;
          newStr += str[i];
        }
        str = newStr;
      }
      var str = this.videoInfo.title;
      const BAD_SYMBOLS = ["/", "^", "_", "`"];
      BAD_SYMBOLS.forEach(removeAll);
      stripBadChars();
      this.videoInfo.title = str;
      return;
    }
  }
};
</script>