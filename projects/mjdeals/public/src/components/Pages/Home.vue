<template>
  <div id="homePage">
    <div id="topDeals" class="p-5">
      <h5>Top Deals</h5>
      <div class="row">
        <deal-card
          v-for="deal in topDeals"
          v-bind="deal"
          v-bind:url="'#'"
          class="col-6 col-md-4 col-lg-3 bg-dark text-white"
        ></deal-card>
      </div>
    </div>
    <div id="dealCategories">
      <h4 class="text-center">Search by Category</h4>
      <div class="row">
        <router-link v-for="category in categories" v-bind:to="'/browse?category=' + category.name">
          <div
            class="col-6 col-lg-3 d-flex justify-content-center align-items-center shadow-sm category-card"
          >
            <div class="h-100 py-5">{{category.name}}</div>
          </div>
        </router-link>
      </div>
    </div>
    <div id="newDeals" class="p-5">
      <h3 class="text-center">Newest Deals</h3>
      <div class="row">
        <deal-card
          v-for="deal in newDeals"
          v-bind="deal"
          v-bind:url="'#'"
          class="col-6 col-md-4 col-lg-3 bg-dark text-white"
        ></deal-card>
      </div>
    </div>
    <div id="contact" class="w-100 bg-light">
      <div class="p-5">
        <div class="d-inline-block">
          <div class="d-flex justify-content-center align-items-center">
            <i class="h1 fa fa-xl fa-info"></i>
          </div>
        </div>
        <div class="d-inline-block">
          <h2>Did we miss one?</h2>
          <h5>Tell us about it!</h5>
          <button class="btn btn-primary">Contact Us</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DealCard from "../DealCard.vue";
import DealBrowser from "../DealBrowser.vue";
export default {
  components: {
    DealCard,
    DealBrowser
  },
  data: function() {
    return {
      topDeals: [],
      newDeals: []
    };
  },
  methods: {
    getTopDeals: function() {
      window.api.get("deal?sort=upvotes").then(res => {
        this.topDeals = res.deals;
      });
    },
    getNewDeals: function() {
      window.api.get("deal?limit=5").then(res => {
        this.newDeals = res.deals;
      });
    }
  },
  mounted: function() {
    this.getTopDeals();
    this.getNewDeals();
  }
};
</script>