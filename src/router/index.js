import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main  from '../views/Main.vue';
import Login  from '../components/Login.vue';
import Register  from '../components/Reister.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'Home',
    component: Home,
    children:[
      {
        path:'',
        component:Main
      },
      {
        path:'/login',
        component:Login
      },
      {
        path:'/register',
        component:Register
      },
      {
        path:'/person',
        component:Register
      },
      {
        path:'/addArticle',
        component:Register
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
