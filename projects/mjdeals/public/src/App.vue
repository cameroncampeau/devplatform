<style lang="scss">
@import "./global.scss";
</style>
<template>
  <div id="app">
    <site-header></site-header>
    <div class="container">
      <div v-if="page=='home'" id="topDeals">
        <h5>Top Deals</h5>
        <div class="row">
          <deal-card v-for="deal in topDeals" v-bind="deal" v-bind:url="'/deal/' + deal._id"></deal-card>
        </div>
      </div>
      <div id="dealCategories">
        <h4 class="text-center">Search by Category</h4>
        <div class="row">
          <div
            v-for="category in categories"
            class="col-6 col-md-4 col-lg-3 d-flex justify-content-center align-items-center shadow-sm"
          >
            <div class="h-100 py-5">{{category.name}}</div>
          </div>
        </div>
      </div>
      <deal-browser></deal-browser>
      <deal-create></deal-create>
    </div>
  </div>
</template>

<script>
import SiteHeader from "./components/Header.vue";
import DealCard from "./components/DealCard.vue";
import DealCreate from "./components/DealCreate.vue";
import DealBrowser from "./components/DealBrowser.vue";

export default {
  name: "app",
  components: {
    SiteHeader,
    DealCard,
    DealCreate,
    DealBrowser
  },
  data: function() {
    return {
      topDeals: [],
      page: "home",
      categories: []
    };
  },
  methods: {
    getTopDeals: function() {
      window.api.get("deal/top").then(res => {
        this.topDeals = res.deals;
      });
    },
    getCategories: function() {
      window.api.get("category").then(res => {
        this.categories = res.categories;
      });
    }
  },
  mounted: function() {
    var self = this;
    this.getTopDeals();
    this.getCategories();
  }
};
</script>
