<template>
  <div>
    <el-row class="person_top">
      <el-col class="video" :span="16" :offset="4">
        <div class="box">
          <div class="user_img_box">
            <img
              :src="userInfo&&userInfo.imgurl || 'http://localhost:8888/public/images/user1.jpg'"
              class="user_img"
              alt
              srcset
            />
          </div>
          <div class="user_info_box">
            <span style="font-size:24px;color:#fff;margin-left: 15px;">{{userInfo && userInfo.nickname ||'未知用户，请登录'}}</span>
            <div>
              <el-badge :value="0" class="item">
                <el-button size="small">私信</el-button>
              </el-badge>
              <el-badge :value="0" class="item">
                <el-button size="small">关注</el-button>
              </el-badge>
              <el-badge :value="collectcounts" class="item">
                <el-button size="small">收藏</el-button>
              </el-badge>
              <el-badge :value="messageList &&messageList.length || 0" class="item">
                <el-button size="small">通知</el-button>
              </el-badge>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div style="padding:20px 0">
        <el-col :span="4" :offset="4">
          <el-menu :default-active="'1-1'" active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>我的文章</span>
              </template>
              <el-menu-item index="1-1">发布文章</el-menu-item>
              <el-menu-item index="1-2">我的文章</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-video-camera"></i>
                <span>我的视频</span>
              </template>
              <el-menu-item index="2-1">上传视频</el-menu-item>
              <el-menu-item index="2-2">我的视频</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-star-off"></i>
                <span>我的收藏</span>
              </template>
              <el-menu-item index="3-1">收藏文章</el-menu-item>
              <el-menu-item index="3-2">收藏视频</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>我的账户</span>
              </template>
              <el-menu-item index="4-1">修改个人信息</el-menu-item>
              <el-menu-item index="4-2">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
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
      collectcounts: 0
    };
  },
  created() {
    this.collectcounts =
      this.articleCollectList.length + this.videoCollectList.length;
  },
  methods: {
    ...mapActions([
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
    articleCollectList: {
      handler(newval, old) {
        this.collectcounts = newval.length + this.videoCollectList.length;
      },
      deep: true
    },
    videoCollectList: {
      handler(newval, old) {
        this.collectcounts = newval.length + this.videoCollectList.length;
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.box {
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
