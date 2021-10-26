<template>
  <div id="app">
    <router-link to="/">hello world</router-link>
    <router-link to="/swim">swim</router-link>
    <router-link to="/table">table</router-link>
    <router-link to="/add">add</router-link>
    <router-link to="/panel">Panel</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
