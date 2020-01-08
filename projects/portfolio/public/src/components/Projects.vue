<template>
  <div id="projects">
    <div id="filter"></div>
    <div id="project-list">
      <div class="project m-3 p-3 shadow-sm" v-for="project in projects">
        <h4>{{project.title}}</h4>
        <p>{{project.description}}</p>
        <div class="tags">
          <div class="tag" v-for="tag in project.tags.slice(0,3)"></div>
        </div>
        <div class="text-center">
          <a v-bind:href="project.url" class="btn btn-primary">View Project</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    
  },
  data: function() {
    return {
      
    };
  },
  mounted: function() {
    console.log(this.projects)
  },
  props: {
    projects: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
};
</script>