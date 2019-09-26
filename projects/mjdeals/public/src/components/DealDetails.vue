<style lang="scss">
</style>
<template>
  <div class="p-4 shadow-sm row">
    <div class="thumb col-12 col-md-6">
      <img class="img-fluid" v-bind:src="thumb_src" />
    </div>
    <div class="col-12 col-md-6">
      <div class="p-3">
        <h3>{{title}}</h3>
        <span class="text-muted">{{upvotes}} Votes</span>
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
  props: {
    title: {
      type: String
    },
    description: {
      type: String,
      default: ""
    },
    thumb_src: {
      type: String,
      default: ""
    },
    date: {
      type: Object
    },
    url: {
      type: String
    },
    upvotes: {
      type: Number
    },
    categories: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>