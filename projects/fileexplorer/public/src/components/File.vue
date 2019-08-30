<style lang="scss">
</style>

<template>
  <div class="py-1 px-3 bg-light border" @click="onClick">
    <i class="fa fa-fw" v-bind:class="{'fa-file': !directory, 'fa-folder': directory}"></i>
    <p class="d-inline">{{name}}</p>
  </div>
</template>

<script>
export default {
  methods: {
    onClick: function(e) {
      this.$emit("fileClick", this.name);
    }
  },
  props: {
    name: {
      type: String
    },
    directory: {
      type: Boolean
    }
  }
};
</script>