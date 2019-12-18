// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";

import HomePage from "./components/Pages/Home.vue";
import BrowsePage from "./components/Pages/Browse.vue";
import DealPage from "./components/Pages/Deal.vue";
import AdminPage from "./components/Pages/Admin.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomePage },
  { path: "/browse", component: BrowsePage },
  { path: "/deal/:id", component: DealPage },
  { path: "/deal/:id/:name", component: DealPage },
  { path: "/admin", component: AdminPage }
];
const router = new VueRouter({ routes });
require("./api.js");
new Vue({
  // eslint-disable-line no-new
  el: "#app",
  router,
  render: h => h(App)
});