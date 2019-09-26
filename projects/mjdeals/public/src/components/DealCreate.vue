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
          <input name="name" type="text" id="title" v-bind:value="title" />
        </div>
        <label>Description</label>
        <div class="input-group">
          <input type="text" id="description" v-bind:value="description" />
        </div>
        <label>URL</label>
        <div class="input-group">
          <input type="text" id="url" v-bind:value="url" />
        </div>
        <label>Thumbnail URL</label>
        <div class="input-group">
          <input type="text" id="thumbUrl" v-bind:value="thumb_url" />
        </div>
        <label>Dates</label>
        <div>
          <div class="row">
            <div class="col-6">
              <label>Start</label>
              <div class="input-group">
                <input type="date" id="startDate" v-bind:value="startDate" />
              </div>
            </div>
            <div class="col-6">
              <label>End</label>
              <div class="input-group">
                <input type="date" id="endDate" v-bind:value="endDate" />
              </div>
            </div>
          </div>
        </div>
        <category-manager v-on:categoryChange="onCategoryChange"></category-manager>
        <div class="float-right m-2">
          <button v-if="_id" class="btn btn-danger" @click="deleteDeal">
            <i class="fa fa-trash mr-2"></i>Delete Deal
          </button>
          <button type="submit" class="btn btn-primary">{{_id && 'Update' || 'Post'}}</button>
        </div>
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
  computed: {
    startDate: function() {
      if (!this.date.start) return "";
      return new Date(this.date.start).toISOString().slice(0, 10);
    },
    endDate: function() {
      if (!this.date.end) return "";
      return new Date(this.date.end).toISOString().slice(0, 10);
    }
  },
  data: function() {
    return { selectedCategories: [] };
  },
  methods: {
    dateToDateStr: function(date) {},
    deleteDeal: function() {
      if (!this._id || !confirm("Are you sure you want to delete this deal?"))
        return;
      window.api.DELETE("deal/" + this._id).then(res => {
        this.$emit("created", {});
      });
    },
    modifyDeal: function(title, url, description, thumb_url, start, end) {
      window.api
        .patch("deal/" + this._id, {
          title,
          url,
          categories: this.selectedCategories,
          description,
          thumb_url,
          start,
          end
        })
        .then(res => {
          this.$emit("created", {});
        });
    },
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
      if (this._id)
        return this.modifyDeal(title, url, description, thumb_url, start, end);
      window.api
        .post("deal/" + title, {
          description,
          url,
          categories: this.selectedCategories,
          thumb_url,
          start,
          end
        })
        .then(res => {
          this.$emit("created", {
            title,
            description,
            categories,
            url,
            thumb_url,
            date: { start, end }
          });
        });
    },
    onCategoryChange: function(selectedCategories) {
      this.selectedCategories = selectedCategories;
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
    categories: {
      type: Array,
      default: function() {
        return [];
      }
    },
    url: {
      type: String,
      default: ""
    },
    thumb_url: {
      type: String,
      default: ""
    },
    date: {
      type: Object,
      default: function() {
        return {};
      }
    },
    _id: {
      type: String,
      default: ""
    }
  }
};
</script>