<template>
  <div>
    <div id="details" class="row">
      <div class="col-12 col-md-6 p-5 d-flex justify-content-center align-items-center">
        <img v-bind:src="thumb_url" alt class="img-fluid" />
      </div>
      <div class="col-12 col-md-6 p-5">
        <h2>
          {{title}}
          <button v-if="!upvoted" @click="upvote" class="btn btn-success px-3 align-top">
            <i class="fa fa-thumbs-up fa-lg fa-fw"></i>
          </button>
        </h2>
        <span>{{upvotes}} Votes</span>
        <p>{{description}}</p>
        <div class="text-center">
          <a v-bind:href="url" class="btn btn-primary">View Deal</a>
        </div>
      </div>
    </div>
    <div id="related">
      <deal v-for="deal in relatedDeals" v-bind="deal"></deal>
    </div>
  </div>
</template>
<script>
import Deal from "../DealCard.vue";

var NUM_RELATED_DEALS = 3;
export default {
  computed: {},
  components: { Deal },
  data: function() {
    var data = {
      title: "",
      description: "",
      categories: [],
      url: "",
      upvotes: 0,
      upvoted: this.$route.params.id in this.fetchUpvoteHistory(),
      thumb_url: "",
      date: {
        start: 0,
        end: 0,
        created: 0
      },
      relatedDeals: [],
      id: this.$route.params.id
    };
    return data;
  },
  methods: {
    fetchDetails: function() {
      window.api.get("deal/" + this.$route.params.id).then(res => {
        this.updateDetails(res.deal);
      });
    },
    fetchUpvoteHistory: function() {
      return JSON.parse(localStorage.getItem("deal-upvote-history")) || {};
    },
    fetchRelatedDeals: function() {
      window.api.get("deal/" + this.id + "/related").then(res => {
        this.relatedDeals = res.deals;
      });
    },
    updateDetails: function(deal) {
      this.title = deal.title;
      this.description = deal.description;
      this.categories = deal.categories;
      this.url = deal.url;
      this.thumb_url = deal.thumb_url;
      this.date = deal.date;
      this.upvotes = deal.upvotes;
    },
    upvote: function() {
      if (this.upvoted) return;
      window.api.post("deal/" + this.id + "/upvote").then(res => {
        var history = this.fetchUpvoteHistory();
        history[this.id] = Date.now();
        localStorage.setItem("deal-upvote-history", JSON.stringify(history));
        this.upvoted = true;
        this.fetchDetails();
      });
    }
  },
  mounted: function() {
    this.fetchDetails();
    this.fetchRelatedDeals();
  }
};
</script>