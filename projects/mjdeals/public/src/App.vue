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
      <div id="homePage" v-if="page=='home'" class="container">
        <div id="topDeals">
          <h5>Top Deals</h5>
          <div class="row">
            <deal-card
              v-for="deal in topDeals"
              v-bind="deal"
              v-bind:url="'/deal/' + deal._id + '/' + deal.title"
            ></deal-card>
          </div>
        </div>
        <div id="dealCategories">
          <h4 class="text-center">Search by Category</h4>
          <div class="row">
            <div
              v-for="category in categories"
              @click="browseCategory(category.name)"
              class="col-6 col-lg-3 d-flex justify-content-center align-items-center shadow-sm category-card"
            >
              <div class="h-100 py-5">{{category.name}}</div>
            </div>
          </div>
        </div>
        <deal-browser></deal-browser>
      </div>
      <div id="browsePage" v-if="page=='browse'">
        <deal-browser></deal-browser>
      </div>
      <div id="adminPage" v-if="page == 'admin'">
        <admin-dashboard v-bind:initialCategory="selectedCategory"></admin-dashboard>
      </div>
    </div>
  </div>
</template>

<script>
import SiteHeader from "./components/Header.vue";
import DealCard from "./components/DealCard.vue";
import DealBrowser from "./components/DealBrowser.vue";
import AdminDashboard from "./components/admin/Dashboard.vue";

export default {
  name: "app",
  components: {
    SiteHeader,
    DealCard,
    AdminDashboard,
    DealBrowser
  },
  data: function() {
    return {
      topDeals: [],
      page: "home",
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
