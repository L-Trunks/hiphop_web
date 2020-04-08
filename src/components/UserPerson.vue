<template>
  <div>
    <el-row class="person_top">
      <el-col class="video" :span="16" :offset="4">
        <div class="person_box">
          <div class="user_img_box">
            <img
              :src="userData && userData.imgurl || 'http://localhost:8888/public/images/user1.jpg'"
              class="user_img"
              alt="找不到图片"
              srcset
            />
          </div>
          <div class="user_info_box">
            <span
              style="font-size:24px;color:#fff;margin-left: 15px;"
            >{{userData && userData.nickname ||'未知用户，请登录'}}</span>
            <div>
              <el-badge :value="0" class="item">
                <el-button size="small">私信</el-button>
              </el-badge>
              <el-badge :value="0" class="item">
                <el-button size="small">关注</el-button>
              </el-badge>
              <el-badge :value="messageList &&messageList.length || 0" class="item">
                <el-button size="small">通知</el-button>
              </el-badge>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff">
      <div style="padding:20px 0;">
        <el-col :span="4" :offset="4">
          <el-breadcrumb
            style="margin:20px 0;margin-left:10px"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          </el-breadcrumb>
          <el-menu active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>我的文章</span>
              </template>
              <router-link to="/person/add_article">
                <el-menu-item index="1-1">发布文章</el-menu-item>
              </router-link>
              <router-link to="/person/my_article">
                <el-menu-item index="1-2">我的文章</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-video-camera"></i>
                <span>我的视频</span>
              </template>
              <router-link to="/person/add_video">
                <el-menu-item index="2-1">上传视频</el-menu-item>
              </router-link>
              <router-link to="/person/my_video">
                <el-menu-item index="2-2">我的视频</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-star-off"></i>
                <span>我的收藏</span>
              </template>
              <router-link to="/person/collect_article">
                <el-menu-item index="3-1">收藏文章</el-menu-item>
              </router-link>
              <router-link to="/person/collect_video">
                <el-menu-item index="3-2">收藏视频</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu v-if="userInfo.permission =='1' || userInfo.permission =='2'" index="4">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>我的活动&比赛</span>
              </template>
              <router-link to="/person/add_activity">
                <el-menu-item index="4-1">发布活动</el-menu-item>
              </router-link>
              <router-link to="/person/my_activity">
                <el-menu-item index="4-2">我的活动&比赛</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>我的账户</span>
              </template>
              <router-link to="/person/update_user_info">
                <el-menu-item index="5-1">修改个人信息</el-menu-item>
              </router-link>
              <el-menu-item @click="logout" index="5-2">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="12">
          <router-view class="personbox"></router-view>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "UserPerson",
  data() {
    return {
      collectcounts: 0,
      userData: {}
    };
  },
  created() {},
  mounted() {
    this.userData = this.userInfo;
    this.$router.push("/person");
  },
  methods: {
    ...mapMutations([
      "changeVideoResult",
      "changeArticleResult",
      "changeToken",
      "changeIsLogin",
      "changeUserId",
      "changeUserInfo"
    ]),
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    logout() {
      localStorage.setItem("accessToken", "");
      this.changeIsLogin(false);
      this.changeUserInfo({});
      this.changeUserId("");
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList,
      newArticleList: state => state.newArticleList,
      newVideoList: state => state.newVideoList,
      messageList: state => state.messageList,
      videoResult: state => state.videoResult,
      articleResult: state => state.articleResult,
      rotationImgList: state => state.rotationImgList,
      articleCollectList: state => state.articleCollectList,
      videoCollectList: state => state.videoCollectList
    })
  },
  watch: {
    userInfo: {
      handler(newval, old) {
        console.log(newval);
        this.userData = newval;
      },
      deep: true
    }
  }
};
</script>
<style scoped>
/* .personbox {
  background: url("../../public/images/1.svg") no-repeat 10% 100%;
} */
.person_box {
  display: flex;
  flex-direction: row;
}
.person_top {
  margin-top: -1px;
  background: url("http://localhost:8888/public/images/background.jpg")
    no-repeat;
  background-size: 100% 100%;
  padding: 20px;
}
.user_img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #3d3d3d;
  box-shadow: 6px 6px 5px rgb(112, 112, 112);
}
.user_info_box {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.item {
  margin-left: 15px;
}
</style>
