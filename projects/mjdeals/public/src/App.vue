<style lang="scss">
@import "./global.scss";
#app {
  min-height: 100vh;
  padding-top: 140px;
}
</style>
<template>
  <div id="app" class="bg-lightgreen">
    <site-header v-on:nav="changePage" v-bind:currentPage="page"></site-header>
    <div class="page-body container p-5 bg-light shadow rounded">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SiteHeader from "./components/Header.vue";

function getPage() {
  var path = window.location.pathname;
  switch (path) {
    case "/browse":
      return "browse";
    case "/":
    case "/index.html":
    default:
      return "home";
  }
}
export default {
  name: "app",
  components: {
    SiteHeader
  },
  data: function() {
    return {
      topDeals: [],
      page: getPage(),
      categories: [],
      selectedCategory: null
    };
  },
  methods: {
    browseCategory: function(category) {
      this.selectedCategory = category;
      this.page = "browse";
    },
    getTopDeals: function() {
      window.api.get("deal/top").then(res => {
        this.topDeals = res.deals;
      });
    },
    getCategories: function() {
      window.api.get("category").then(res => {
        this.categories = res.categories;
      });
    },
    changePage: function(page) {
      this.page = page;
    }
  },
  mounted: function() {
    var self = this;
    this.getTopDeals();
    this.getCategories();
  }
};
</script>
