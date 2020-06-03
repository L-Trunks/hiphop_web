<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {}
};
</script>

<style>
body {
  /* background: rgb(250, 250, 250); */
  background-size: 100% 100%;
  
}
#app {
  font-family: "Courier New", Courier, monospace;
}
.router-link {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
a {
  text-decoration: none;
}
.el-pagination {
  text-align: center;
}
.el-carousel button {
  background: #000;
}
.baberrage-stage {
  height: 400px !important;
}
.el-loading-parent--hidden{
  overflow: scroll !important;
}
</style>
