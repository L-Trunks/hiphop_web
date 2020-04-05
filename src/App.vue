<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
    
  }
}
</script>

<style>
#app{
  font-family: 'Courier New', Courier, monospace
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
.el-pagination{
  text-align: center
}
.el-carousel button{
background: #000
}
</style>
