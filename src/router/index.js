import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue';
import Login from '../components/Login.vue';
import Register from '../components/Reister.vue';
import ListBySort from '../components/ListBySort.vue';
import ArticleDetail from '../components/ArticleDetail.vue';
import VideoDetail from '../components/VideoDetail.vue';
import RotationImgDetail from '../components/RotationImgDetail.vue';
import UserPerson from '../components/UserPerson.vue';
import AddArticle from '../components/AddArticle.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        component: Main
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/register',
        component: Register
      },
      {
        path: '/person',
        component: UserPerson
      },
      {
        path: '/addArticle',
        component: AddArticle
      },
      {
        path: '/list_by_sort',
        component: ListBySort
      },
      {
        path: '/article_detail',
        component: ArticleDetail
      },
      {
        path: '/video_detail',
        component: VideoDetail
      },
      {
        path:'rotation_img_detail',
        component:RotationImgDetail
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
