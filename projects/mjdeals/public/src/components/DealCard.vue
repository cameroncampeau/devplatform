<style lang="scss">
</style>
<template>
  <div class="deal-card m-3 shadow-sm px-3 py-1">
    <img v-bind:src="thumb_url" alt class="img-fluid" />
    <div class="details">
      <h4>{{title}}</h4>
      <small class="span">{{upvotes}} votes</small>
      <p>{{description}}</p>
      <a v-bind:href="url" class="btn btn-primary">View Deal</a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    date: {
      type: Object,
      default: function() {
        return {};
      }
    },
    url: {
      type: String
    },
    thumb_url: {
      type: String,
      default: "/images/default-deal.png"
    },
    upvotes: {
      type: Number,
      default: 0
    }
  }
};
</script>