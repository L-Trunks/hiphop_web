<template>
  <div>
    <el-row class="person_top">
      <el-col class="video" :span="16">
        <div class="person_box">
          <div class="user_img_box">
            <img
              :src="userInfo && userInfo.imgurl || 'http://localhost:8888/public/images/user1.jpg'"
              class="user_img"
              alt="找不到图片"
              srcset
            />
          </div>
          <div class="user_info_box">
            <span
              style="font-size:24px;color:#fff;margin-left: 15px;"
            >{{userInfo && userInfo.nickname ||'未知用户，请登录'}}</span>
            <span
              style="font-size:12px;color:#999;margin: 10px 15px;"
            >权限：{{permissionMap[userInfo && userInfo.permission ||'0']}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff">
      <div style="padding:20px 0;">
        <el-col :span="4">
          <el-breadcrumb
            style="margin:20px 0;margin-left:10px"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/person' }">个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>后台管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-menu :default-active="'1-1'" active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>论坛配置</span>
              </template>
              <router-link to="/management/announce_management">
                <el-menu-item index="1-1">公告管理</el-menu-item>
              </router-link>
              <router-link to="/management/rotation_management">
                <el-menu-item index="1-2">轮播图管理</el-menu-item>
              </router-link>
              <router-link to="/management/sort_management">
                <el-menu-item index="1-3">分类管理</el-menu-item>
              </router-link>
              <router-link to="/management/keyword_management">
                <el-menu-item index="1-4">关键词管理</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
              <router-link to="/management/user_management">
                <el-menu-item index="2-1">用户管理</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-folder-opened"></i>
                <span>内容管理</span>
              </template>
              <router-link to="/management/article_management">
                <el-menu-item index="3-1">文章管理</el-menu-item>
              </router-link>
              <router-link to="/management/video_management">
                <el-menu-item index="3-2">视频管理</el-menu-item>
              </router-link>
              <router-link to="/management/room_management">
                <el-menu-item index="3-3">聊天室管理</el-menu-item>
              </router-link>
              <router-link to="/management/activity_management">
                <el-menu-item index="3-4">活动&比赛管理</el-menu-item>
              </router-link>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="18">
          <router-view class="personbox"></router-view>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { UpdateUserInfo, GetUserInfoByToken } from "../api/user_api";
import { permissionMap } from "../utils/tools";
export default {
  name: "Management",
  data() {
    return {
      dialoading: false,
      dialogVisible: false,
      updateUserForm: {
        phone: "",
        introduce: ""
      },
      updateUserContent: "",
      updateUserRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "请输入个人介绍", trigger: "blur" }
        ]
      },
      collectcounts: 0,
      permissionMap
    };
  },
  created() {
    let accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken) {
      this.changeToken(accessToken);
      GetUserInfoByToken({ accessToken: accessToken })
        .then(res => {
          if (res && res.code === "200") {
            
            this.changeIsLogin(true);
            this.changeUserId(res.data[0]._id);
            this.changeUserInfo(res.data[0]);
          } else {
            if (res.code == "1005") {
              this.$message.error("token失效，请重新登录");
            }
          }
        })
        .catch(err => {
          this.$router.push("/login");
          this.$message.error("token失效，请重新登录");
        });
    }
  },
  mounted() {
    
    if (this.userInfo && this.userInfo.permission !== "1") {
      this.$message.error("您无权访问此网页");
      this.$router.push("/");
    }
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
      "GetUserInfoById",
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ])
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
        
        if (this.userInfo && this.userInfo.permission !== "1") {
          this.$message.error("您无权访问此网页");
          this.$router.push("/");
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.personbox {
  padding: 20px;
}
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
