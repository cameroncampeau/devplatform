<style lang="scss">
</style>
<template>
  <div class="p-4 shadow-sm">
    <h1>{{title}}</h1>
    <p>{{description}}</p>
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