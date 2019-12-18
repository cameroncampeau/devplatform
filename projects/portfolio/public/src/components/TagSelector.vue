<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
<template>
  <div id="template">
    <div class="selected-tags">
      <div
        v-for="tag in selectedTags"
        class="d-inline-block m-1 px-3 py-1 bg-dark rounded text-white small"
      >
        {{tag.name}}
        <i
          @click="removeTag($event, tag)"
          class="fa fa-times fa-lg text-danger ml-1 cursor-pointer"
        ></i>
      </div>
    </div>
    <div class="tag-search">
      <div class="input-group">
        <input type="text" v-on:keyup="updateSearch" placeholder="Search for a tag" />
      </div>
      <div class="relevant-tags">
        <div
          v-for="tag in searchTags"
          class="d-inline-block m-1 px-3 py-1 bg-dark rounded text-white small"
        >
          {{tag.name}}
          <i
            @click="selectTag(tag.name)"
            class="fa fa-plus fa-lg text-success ml-1 cursor-pointer"
          ></i>
        </div>
      </div>
    </div>
    <div class="tag-find">
      <div
        class="py-1 px-3 bg-light border cursor-pointer"
        v-if="this.currentCategory"
        @click="changeFindCategory('..')"
      >
        <i class="fa fa-folder mr-2"></i>..
      </div>
      <tag
        v-for="tag in findTags"
        v-bind:name="tag.name"
        v-bind:isFolder="!!tagStruct[tag.name].length"
        v-bind:selected="tag.selected"
        v-on:selected="selectTag"
        v-on:selectedFolder="changeFindCategory"
      ></tag>
    </div>
  </div>
</template>

<script>
import Tag from "./Tag.vue";

var tags = require("../data/ProjectTags.json");

export default {
  components: {
    Tag
  },
  data: function() {
    function addChildTag(parent, child) {
      if (tagStruct[parent]) tagStruct[parent].push(child);
      else tagStruct[parent] = [child];
    }

    var tagStruct = {},
      topLevelCategories = [];
    tags.forEach(t => {
      if (!t.parentCategory) {
        topLevelCategories.push(t);
        if (!tagStruct[t.name]) tagStruct[t.name] = [];
      } else {
        if (typeof t.parentCategory == "object") {
          t.parentCategory.forEach(p => addChildTag(p, t));
        } else addChildTag(t.parentCategory, t);
      }
      if (!tagStruct[t.name]) tagStruct[t.name] = [];
    });

    return {
      tags,
      searchTags: [],
      findTags: [],
      selectedTags: [],
      currentCategory: null,
      topLevelCategories,
      categoryPath: [],
      tagStruct
    };
  },
  methods: {
    updateSearchTags: function(search) {
      if (!search || search.length == 0) return (this.searchTags = []);
      var selectedTags = this.selectedTags;
      this.searchTags = this.tags.filter(function(tag) {
        return (
          !tag.selected &&
          tag.name.toLowerCase().indexOf(search.toLowerCase()) > -1 &&
          !selectedTags.find(t => t.name == tag.name)
        );
      });
      console.log(this.searchTags);
    },
    updateFindTags: function() {
      function fileFolderSorter(arr) {}
      this.findTags =
        (this.currentCategory && this.tagStruct[this.currentCategory]) ||
        this.topLevelCategories;
      this.findTags.forEach(tag => {
        if (this.selectedTags.find(t => t == tag)) tag.selected = true;
        else tag.selected = false;
      });
    },
    updateSearch: function() {
      this.updateSearchTags(this.$el.querySelector(".tag-search input").value);
    },
    changeFindCategory: function(category) {
      if (category == "..") {
        this.currentCategory = this.categoryPath.pop();
        if (!this.currentCategory) this.currentCategory = null;
        this.updateFindTags();
        return;
      }
      if (!this.tagStruct[category].length) return;
      else if (
        this.currentCategory &&
        !this.tagStruct[this.currentCategory].find(t => t.name == category)
      )
        return;
      else if (
        !this.currentCategory &&
        !this.topLevelCategories.find(c => c.name == category)
      )
        return;
      if (this.currentCategory) this.categoryPath.push(this.currentCategory);
      this.currentCategory = category;
      this.updateFindTags();
    },
    selectTag: function(tag) {
      tag = this.tags.find(t => t.name == tag);
      this.selectedTags.push(tag);
      tag.selected = true;
      this.updateSearch();
      this.$emit("change", this.selectedTags);
    },
    removeTag: function(e, tag) {
      this.selectedTags = this.selectedTags.filter(t => t != tag);
      var findTag = this.findTags.find(t => t == tag);
      if (findTag) findTag.selected = false;
      this.updateSearch();
      this.$emit("change", this.selectedTags);
    }
  },
  mounted: function() {
    this.updateFindTags();
  },
  props: {}
};
</script>

