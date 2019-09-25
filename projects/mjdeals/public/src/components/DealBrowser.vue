<style lang="scss">
</style>
<template>
  <div>
    <div class="controls">
      <label>Sort By</label>
      <select id="sortType" @change="changeSort()">
        <option value="date">Date</option>
        <option value="upvotes">Upvotes</option>
      </select>
      <label>Category</label>
      <select id="category" @change="changeCategory()">
        <option v-for="category in categories" v-bind:value="category._id">{{category.name}}</option>
      </select>
    </div>
    <div class="results">
      <deal-card v-for="deal in deals" v-bind="deal"></deal-card>
      <p v-if="deals.length == 0" class="text-muted">No deals found</p>
    </div>
  </div>
</template>
<script>
import DealCard from "./DealCard.vue";

export default {
  components: {
    DealCard
  },
  data: function() {
    return {
      deals: [],
      sort: "date.posted",
      categories: []
    };
  },
  methods: {
    changeSort: function() {
      var sort = this.getSelectedOption("#sortType");
      this.sort = sort;
      this.fetchDeals();
    },
    changeCategory: function() {
      this.category = this.getSelectedOption("#category");
      this.fetchDeals();
    },
    getSelectedOption: function(elSelector) {
      var el = this.$el.querySelector(elSelector);
      return el.options[el.selectedIndex].value;
    },
    fetchDeals: function() {
      var fetchURL = "deal?sort=" + this.sort;
      if (this.category) {
        fetchURL += "&category=" + this.category;
      }
      window.api.get(fetchURL).then(res => {
        this.deals = res.deals;
      });
    },
    fetchCategories: function() {
      window.api.get("category").then(res => {
        this.categories = res.categories;
      });
    }
  },
  mounted: function() {
    this.sort = this.initialSort;
    this.category = this.initialCategory;
    this.fetchCategories();
    this.fetchDeals();
  },
  props: {
    initialSort: {
      type: String,
      default: "date.posted"
    },
    initialCategory: {
      type: String,
      default: null
    }
  }
};
</script>