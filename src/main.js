import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false

Vue.config.productionTip = false

const whiteList = ['/','/login','/register']// 免登录白名单

router.beforeEach((to, from, next) => {
  console.log(store.state)
  if (store.state.token) {
    next()
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      Vue.$message.error('请登录')
      next('/login') // 否则全部重定向到登录页
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
