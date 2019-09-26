<style lang="scss">
</style>
<template>
  <div>
    <div class="row" v-if="page == 'home'">
      <div class="col-6 col-md-4 col-lg-3 justify-content-center align-items-center">
        <h2 class="cursor-pointer" v-on:click="manageDeals()">CryptoMill</h2>
      </div>
      <div class="col-6 col-md-4 col-lg-3 justify-content-center align-items-center">
        <h2 class="cursor-pointer" v-on:click="changePage('deal-create')">OpenText</h2>
      </div>
    </div>
    <div id="dealManage" v-if="page=='deal-manage'">
      <div v-if="pageSection == null">
        <button class="btn btn-success" @click="createDeal">
          <i class="fa fa-plus mr-2"></i>Create
        </button>
        <div class="row">
          <deal-card
            v-for="deal in deals"
            v-bind="deal"
            v-bind:url="'#'"
            v-on:selected="editDeal(deal)"
          ></deal-card>
        </div>
      </div>
      <div v-if="pageSection == 'edit' || pageSection == 'create'">
        <button class="btn btn-primary m-3" @click="manageDeals">
          <i class="fa fa-arrow-left mr-2"></i>Back to Deals
        </button>
        <deal-create v-on:created="manageDeals" v-bind="selectedDeal || {}"></deal-create>
      </div>
    </div>
  </div>
</template>
<script>
import DealCreate from "./../DealCreate.vue";
import DealCard from "./../DealCard.vue";

export default {
  components: {
    DealCreate,
    DealCard
  },
  data: function() {
    return {
      page: "home",
      pageSection: null,
      deals: [],
      selectedDeal: null
    };
  },
  methods: {
    changePage: function(page) {
      this.page = page;
      this.pageSection = null;
      if (page in pageListeners) pageListeners[page]();
    },
    createDeal: function() {
      this.selectedDeal = null;
      this.pageSection = "create";
    },
    editDeal: function(deal) {
      this.pageSection = "edit";
      this.selectedDeal = deal;
    },
    fetchDeals: function() {
      window.api.get("deal").then(res => {
        this.deals = res.deals;
      });
    },
    manageDeals: function() {
      this.pageSection = null;
      this.page = "deal-manage";
      this.fetchDeals();
      this.selectedDeal = null;
    }
  }
};
</script>