<template>
  <div id="app">
    <navbar></navbar>
    <header></header>
    
    <footer></footer>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
var projects = [
  {
    title: "First Project",
    description: "This is my first project",
    url: "/project/the-first-project",
    tags: ["node", "vuejs", "mongodb", "reactjs", "js", "expressjs"]
  },
  {
    title: "Second Project",
    description: "This is the second project.",
    url: "/project/the-second-project",
    tags: ["php", "nodejs", "reactjs", "expressjs", "js"]
  }
];

export default {
  name: "app",
  components: {
    Navbar,
    Footer,
    Header
  },
  data: function() {
    return { projects };
  }
};
</script>
