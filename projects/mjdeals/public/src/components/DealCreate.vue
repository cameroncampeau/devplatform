<style lang="scss">
.deal-create {
  max-width: 460px;
}
</style>
<template>
  <div class="deal-create p-4 shadow-sm clearfix">
    <h3></h3>
    <div class="form">
      <form @submit.prevent="postDeal" id="deal">
        <label>Title</label>
        <div class="input-group">
          <input name="name" type="text" id="title" />
        </div>
        <label>Description</label>
        <div class="input-group">
          <input type="text" id="description" />
        </div>
        <label>URL</label>
        <div class="input-group">
          <input type="text" id="url" />
        </div>
        <label>Thumbnail URL</label>
        <div class="input-group">
          <input type="text" id="thumbUrl" />
        </div>
        <label>Dates</label>
        <div>
          <div class="row">
            <div class="col-6">
              <label>Start</label>
              <div class="input-group">
                <input type="date" id="startDate" />
              </div>
            </div>
            <div class="col-6">
              <label>End</label>
              <div class="input-group">
                <input type="date" id="endDate" />
              </div>
            </div>
          </div>
        </div>
        <category-manager v-on:categoryChange="onCategoryChange"></category-manager>
        <button class="btn btn-primary float-right m-2">Post</button>
      </form>
    </div>
  </div>
</template>
<script>
import CategoryManager from "./CategoryManager.vue";
export default {
  components: {
    CategoryManager
  },
  data: function() {
    return { selectedCategories: [] };
  },
  methods: {
    postDeal: function() {
      function getInput(id) {
        return self.$el.querySelector("input#" + id).value;
      }
      var self = this;
      var title = getInput("title"),
        description = getInput("description"),
        url = getInput("url"),
        thumb_url = getInput("thumbUrl"),
        start = getInput("startDate"),
        end = getInput("endDate");

      window.api.post("deal/" + title, {
        description,
        url,
        categories: this.selectedCategories,
        thumb_url,
        start,
        end
      });
    },
    onCategoryChange: function(selectedCategories) {
      this.selectedCategories = selectedCategories;
    }
  }
};
</script>