<template>
  <div id="app">
    <navbar></navbar>
    <header></header>
    <div class="container">
      <project-explorer v-bind:projects="projects"></project-explorer>
    <contact-form></contact-form>
    </div>
    <footer></footer>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import ProjectExplorer from "./components/Projects.vue";
import ContactForm from "./components/ContactForm.vue";

export default {
  name: "app",
  components: {
    Navbar,
    Footer,
    Header,
    ProjectExplorer,
    ContactForm
  },
  data: function() {
    return { projects: [] };
  },
  mounted: function() {
    fetch("/projects").then(function(t) {
      return t.text();
    }).then(function(text) {
      var projects = JSON.parse(text);
      this.projects = projects;
    }.bind(this)).catch(function(e) {

    })
  }
};
</script>
