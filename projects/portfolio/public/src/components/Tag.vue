<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.small {
  font-size: 0.6em;
}
</style>
<template>
  <div
    @click="changeFolder()"
    class="py-1 px-3 bg-light border"
    v-bind:class="{'cursor-pointer': isFolder}"
  >
    <i v-bind:class="{'fa-folder': isFolder, 'fa-code': !isFolder}" class="fa"></i>
    {{name}}
    <p
      v-if="!selected"
      class="d-inline-block bg-primary text-white small px-2 py-1 rounded my-0 ml-1 cursor-pointer"
      @click="select($event)"
    >Select</p>
    <i v-if="selected" class="fa fa-check text-success ml-2"></i>
  </div>
</template>

<script>
export default {
  methods: {
    select: function(e) {
      e.stopPropagation();
      this.$emit("selected", this.name);
    },
    changeFolder: function() {
      this.$emit("selectedFolder", this.name);
    }
  },
  props: {
    name: {
      type: String
    },
    isFolder: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>