<style lang="scss">
</style>
<template>
  <div id="header" class="position-fixed l-0 t-0 px-4 py-3 border-bottom bg-dark w-100 text-white">
    <div class="d-inline-block" id="brand">
      <h2 class="font-weight-bold d-inline">TitleBrand</h2>
      <h5 class="font-weight-light d-inline">
        Canada
        <img
          src="https://www.freepngimg.com/thumb/canada_flag/3-222-canada-flag-transparent-thumb.png"
          width="25"
          height="25"
          alt
        />
      </h5>
    </div>
    <div class="d-inline-block float-right px-3 py-1">
      <button
        @click="navigate('home')"
        class="btn btn-dark border mx-1"
        v-bind:class="{'border-success': currentPage == 'home', 'border-secondary': currentPage != 'home'}"
      >Home</button>
      <button
        @click="navigate('browse')"
        class="btn btn-dark border mx-1"
        v-bind:class="{'border-success': currentPage == 'browse', 'border-secondary': currentPage != 'browse'}"
      >Browse Deals</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigate: function(url) {
      this.$emit("nav", url);
    }
  },
  props: {
    currentPage: {
      type: String,
      default: "home"
    }
  }
};
</script>