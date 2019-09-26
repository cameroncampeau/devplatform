<style lang="scss">
</style>
<template>
  <div class="deal-card m-3 shadow-sm px-3 py-1">
    <img v-bind:src="thumb_url" alt class="img-fluid" />
    <div class="details">
      <h4>{{title}}</h4>
      <small class="span">{{upvotes}} votes</small>
      <p>{{description}}</p>
      <a v-if="url != '#'" v-bind:href="url" class="btn btn-primary">View Deal</a>
      <router-link v-if="url == '#'" v-bind:to="'deal/' + _id" class="btn btn-primary">Select</router-link>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    select: function() {
      this.$emit("selected", { title: this.title, _id: this._id });
    }
  },
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
      type: String,
      default: "#"
    },
    thumb_url: {
      type: String,
      default: "/images/default-deal.png"
    },
    upvotes: {
      type: Number,
      default: 0
    },
    _id: {
      type: String
    }
  },
  mounted: function() {}
};
</script>