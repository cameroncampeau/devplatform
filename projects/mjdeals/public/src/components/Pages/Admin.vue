<template>
  <div id="adminPage">
    <div id="login" v-if="user == null">
      <div
        class="d-flex position-fixed t-0 l-0 bg-dark layer-max justify-content-center align-items-center w-100 h-100"
      >
        <div class="bg-light p-4 rounded">
          <form @submit.prevent="login">
            <label>Username</label>
            <div class="input-group">
              <input type="text" id="username" />
            </div>
            <label>Password</label>
            <div class="input-group">
              <input type="password" id="password" />
            </div>
            <button class="btn btn-primary float-right mt-3">Login</button>
          </form>
        </div>
      </div>
    </div>
    <admin-dashboard v-if="user != null"></admin-dashboard>
  </div>
</template>
<script>
import AdminDashboard from "../admin/Dashboard.vue";

export default {
  components: { AdminDashboard },
  data: function() {
    return {
      user: null
    };
  },
  methods: {
    checkLogin: function() {
      window.api.get("account/checkLogin").then(res => {
        if (res.user) {
          this.user = res.user;
        }
      });
    },
    login: function() {
      var username = this.$el.querySelector("input#username").value,
        password = this.$el.querySelector("input#password").value;
      window.api.post("account/login", { username, password }).then(res => {
        this.user = res.user;
      });
    }
  },
  mounted: function() {
    this.checkLogin();
  }
};
</script>