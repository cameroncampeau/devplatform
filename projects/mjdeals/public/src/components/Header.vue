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
      <router-link to="/home" active-class="border-success" class="btn btn-dark border mx-1">Home</router-link>
      <router-link
        to="/browse"
        active-class="border-success"
        class="btn btn-dark border mx-1"
      >Browse Deals</router-link>
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