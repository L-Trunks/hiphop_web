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
import AddArticle from '../components/person/AddArticle.vue';
import MyArticle from '../components/person/MyArticle.vue';
import AddVideo from '../components/person/AddVideo.vue';
import MyVideo from '../components/person/MyVideo.vue';
import AddActivity from '../components/person/AddActivity.vue';
import MyActivity from '../components/person/MyActivity.vue';
import AddRoom from '../components/person/AddRoom.vue';
import MyRoom from '../components/person/MyRoom.vue';
import CollectArticle from '../components/person/CollectArticle.vue';
import CollectVideo from '../components/person/CollectVideo.vue';
import UpdateUserInfo from '../components/person/UpdateUserInfo.vue';
import UpdateArticle from '../components/person/UpdateArticle.vue';
import ActivityDetail from '../components/ActivityDetail.vue';
import ActivityList from '../components/ActivityList.vue';
import BaiduMap from '../components/BaiduMap.vue';
import SearchResult from '../components/SearchResult.vue';
import ChatRoom from '../components/ChatRoom.vue';
import Management from '../components/Management.vue';
import ActivityManagement from '../components/management/ActivityManagement.vue';
import AnnounceManagement from '../components/management/AnnounceManagement.vue';
import ArticleManagement from '../components/management/ArticleManagement.vue';
import KeywordManagement from '../components/management/KeywordManagement.vue';
import RoomManagement from '../components/management/RoomManagement.vue';
import RotationManagement from '../components/management/RotationManagement.vue';
import SortManagement from '../components/management/SortManagement.vue';
import UserManagement from '../components/management/UserManagement.vue';
import VideoManagement from '../components/management//VideoManagement.vue';

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
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
        component: UserPerson,
        children: [
          {
            path: '/person/add_article',
            component: AddArticle
          },
          {
            path: '/person/my_article',
            component: MyArticle
          },
          {
            path: '/person/add_video',
            component: AddVideo
          },
          {
            path: '/person/my_video',
            component: MyVideo
          },
          {
            path: '/person/add_activity',
            component: AddActivity
          },
          {
            path: '/person/my_activity',
            component: MyActivity
          },
          {
            path: '/person/add_room',
            component: AddRoom
          },
          {
            path: '/person/my_room',
            component: MyRoom
          },
          {
            path: '/person/collect_article',
            component: CollectArticle
          },
          {
            path: '/person/collect_video',
            component: CollectVideo
          },
          {
            path: '/person/update_user_info',
            component: UpdateUserInfo
          },
          {
            path: '/person/update_article',
            component: UpdateArticle
          },
        ]
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
        path: '/rotation_img_detail',
        component: RotationImgDetail
      },
      {
        path: '/activity_list',
        component: ActivityList
      },
      {
        path: '/activity_detail',
        component: ActivityDetail
      },
      {
        path: '/search',
        component: SearchResult
      },
      {
        path: '/chat_room',
        component: ChatRoom
      }
    ]
  },
  {
    path: '/address',
    component: BaiduMap
  },
  {
    path: "/management",
    component: Management,
    children: [
      {
        path: '/management/activity_management',
        component: ActivityManagement,
      },
      {
        path: '/management/announce_management',
        component: AnnounceManagement,
      },
      {
        path: '/management/article_management',
        component: ArticleManagement,
      },
      {
        path: '/management/keyword_management',
        component: KeywordManagement,
      },
      {
        path: '/management/room_management',
        component: RoomManagement,
      },
      {
        path: '/management/rotation_management',
        component: RotationManagement,
      },
      {
        path: '/management/sort_management',
        component: SortManagement,
      },
      {
        path: '/management/user_management',
        component: UserManagement,
      },
      {
        path: '/management/video_management',
        component: VideoManagement,
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
