<style lang="scss">
</style>
<template>
  <div class="border p-3">
    <div class="create">
      <div v-on:click="createWindowOpen = !createWindowOpen">
        <div v-if="!createWindowOpen" class="cursor-pointer">
          <i class="fa fa-plus text-success mr-2"></i>Create
        </div>
        <div v-if="createWindowOpen" class="cursor-pointer">
          <i class="fa fa-times text-danger mr-2"></i>Close
        </div>
      </div>
      <div v-if="createWindowOpen" class="body">
        <form @submit.prevent="createCategory">
          <label for>Name</label>
          <div class="input-group">
            <input type="text" id="categoryName" />
          </div>
          <button class="btn btn-success m-3">Create</button>
        </form>
      </div>
    </div>
    <div class="selected-categories">
      <div
        v-for="category in selectedCategories"
        class="category d-inline-block px-3 py-2 mx-1 my-1 bg-success text-white rounded"
      >{{category.name}}</div>
    </div>
    <div class="category-search">
      <form @submit.prevent="searchCategories">
        <input type="text" id="search" placeholder="Search for a category" />
      </form>
    </div>
    <div class="category-explorer">
      <div
        v-for="category in categories"
        v-on:click="selectCategory(category)"
        class="category d-inline-block px-3 py-2 bg-light rounded mx-2 my-1"
      >{{category.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      categories: [],
      createWindowOpen: false,
      selectedCategories: []
    };
  },
  methods: {
    createCategory: function() {
      var categoryName = this.$el.querySelector("input#categoryName").value;
      window.api.post("category/" + categoryName).then(res => {
        this.createWindowOpen = false;
        this.$el.querySelector("div.create form").reset();
        this.updateCategories();
      });
    },
    updateCategories: function() {
      window.api
        .get("category")
        .then(res => {
          this.categories = res.categories;
        })
        .catch(e => {
          console.error(e);
        });
    },
    selectCategory: function(category) {
      this.selectedCategories.push(category);
      this.categories = this.categories.filter(c => c.name != category.name);
      this.$emit("categoryChange", this.selectedCategories);
    }
  },
  mounted: function() {
    this.updateCategories();
  }
};
</script>