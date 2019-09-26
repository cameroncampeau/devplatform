<template>
  <div id="homePage">
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
</template>
<script>
import DealCard from "../DealCard.vue";
import DealBrowser from "../DealBrowser.vue";
export default {
  components: {
    DealCard,
    DealBrowser
  }
};
</script>