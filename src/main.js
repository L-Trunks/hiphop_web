import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import md5 from 'js-md5';
import { vueBaberrage } from 'vue-baberrage'
Vue.use(vueBaberrage)
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false

Vue.config.productionTip = false

const whiteList = ['/','/login','/register','/list_by_sort','/article_detail','/video_detail','/rotation_img_detail']// 免登录白名单

router.beforeEach((to, from, next) => {
  let accessToken = localStorage.getItem("accessToken") || "";
  console.log(accessToken)
  if (accessToken) {
    next()
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
