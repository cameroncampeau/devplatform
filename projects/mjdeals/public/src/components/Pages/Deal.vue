<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6">
        <img v-bind:src="thumb_url" alt class="img-fluid" />
      </div>
      <div class="col-12 col-md-6">
        <h2>{{title}}</h2>
        <span>{{upvotes}} Votes</span>
        <p>{{description}}</p>
        <div class="text-center">
          <a v-bind:href="url" class="btn btn-primary"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      title: "",
      description: "",
      categories: [],
      url: "",
      upvotes: 0,
      thumb_url: "",
      date: {
        start: 0,
        end: 0,
        created: 0
      }
    };
  },
  methods: {
    fetchDetails: function() {
      window.api.get("deal/" + this.$route.params.id).then(res => {
        this.title = res.deal.title;
        this.description = res.deal.description;
        this.categories = res.deal.categories;
        this.url = res.deal.url;
        this.thumb_url = res.deal.thumb_url;
        this.date = res.deal.date;
      });
    }
  },
  mounted: function() {
    this.fetchDetails();
  }
};
</script>