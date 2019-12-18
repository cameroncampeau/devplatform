<template>
  <div id="app">
    <navbar></navbar>
    <header></header>
    <projects v-bind:projects="projects"></projects>
    <footer></footer>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import Projects from "./components/Projects.vue";

export default {
  name: "app",
  components: {
    Navbar,
    Footer,
    Header,
    Projects
  },
  data: function() {
    return { projects: [] };
  },
  mounted: function() {
    fetch("/projects").then(function(t) {
      return t.text();
    }).then(function(text) {
      var projects = JSON.parse(text).projects;
      this.data.projects = projects;
    }.bind(this)).catch(function(e) {

    })
  }
};
</script>
