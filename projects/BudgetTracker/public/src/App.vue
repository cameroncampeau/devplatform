<template>
  <div id="app" class="bg-light">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app,
body,
html {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  top: 0;
}
</style>
