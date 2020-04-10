<template>
  <div class="home">
    <el-row class="top">
      <el-col class="top_search" :span="16" :offset="4">
        <div class="top_left">
          <router-link to="/">
            <el-image style="width:150px;height:150px" src="../images/logo.png" fit="cover"></el-image>
          </router-link>
        </div>
        <div class="top_model">
          <div class="top_model_top">
            <el-input style="width:50%" placeholder="请输入内容" v-model="searchWord">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button type="primary" @click="getSearch" class="search_btn" size="big">搜索</el-button>
          </div>
          <div class="top_model_bottom">
            <span>文章</span>
            <span>视频</span>
            <span>用户</span>
            <span>资讯</span>
          </div>
        </div>
        <div class="top_right">
          <router-link to="/person">
            <el-button v-if="isLogin" type="info" icon="el-icon-user-solid" class size="small">个人中心</el-button>
          </router-link>
          <el-button
            style="margin-left:10px"
            v-if="isLogin"
            @click="logout"
            type="danger"
            icon="el-icon-delete"
            class
            size="small"
          >退出登录</el-button>
          <router-link to="/login">
            <el-button v-if="!isLogin" type="info" icon="el-icon-user" class size="small">登录</el-button>
          </router-link>
          <router-link to="/register">
            <el-button
              v-if="!isLogin"
              style="margin-left:10px"
              type="primary"
              icon="el-icon-more-outline"
              class
              size="small"
            >注册</el-button>
          </router-link>
        </div>
      </el-col>
    </el-row>
    <router-view class="box"></router-view>
    <Hfooter></Hfooter>
  </div>
</template>

<script>
import { GetVideoResultList, GetArticleResultList } from "../api/search_api";
import { GetUserInfoByToken } from "../api/user_api";
import { PageConfig } from "../utils/tools";
import Hfooter from "../components/Hfooter";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      searchWord: "",
      logoUrl: "../images/logo.png",
      PageConfig
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
    this.GetAllDanceSortList({ status: "1" });
    this.GetAllVideoList(this.PageConfig);
    this.GetAllArticleList(this.PageConfig);
    this.GetAllRotationImgList({ status: "1" });
    this.GetAllMatchList({});
    this.GetAllRoomList({ status: "0" });
    this.GetAllAnnouncementList({ status: "3" });
  },
  mounted() {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "overflow: scroll !important");
    if (this.userid) {
      this.GetMessageListByUser({ userid: this.userid });
      this.ArticleGetCollectList({
        ...this.PageConfig,
        userid: this.userid,
        type: "1"
      });
      this.VideoGetCollectList({
        ...this.PageConfig,
        userid: this.userid,
        type: "1"
      });
    }
  },
  methods: {
    ...mapMutations([
      "changeVideoResult",
      "changeArticleResult",
      "changeToken",
      "changeIsLogin",
      "changeUserId",
      "changeUserInfo",
      "changeKeyword"
    ]),
    ...mapActions([
      "GetMessageListByUser",
      "GetAllRoomList",
      "GetAllMatchList",
      "GetAllAnnouncementList",
      "ArticleGetCollectList",
      "VideoGetCollectList",
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    getSearch() {
      this.changeKeyword(this.searchWord);
      this.$router.push({
        path: "/search",
        query: { keyword: this.searchWord }
      });
    },
    logout() {
      this.$confirm("确定退出登录吗？")
        .then(_ => {
          localStorage.setItem("accessToken", "");
          this.changeIsLogin(false);
          this.changeUserInfo({});
          this.changeUserId("");
          this.$router.push("/");
        })
        .catch(_ => {});
    }
  },
  watch: {
    userid: {
      handler(newval, old) {
        if (newval) {
          this.GetMessageListByUser({ userid: newval });
          this.ArticleGetCollectList({
            ...this.PageConfig,
            userid: newval,
            type: "1"
          });
          this.VideoGetCollectList({
            ...this.PageConfig,
            userid: newval,
            type: "1"
          });
        }
      },
      deep: true
    },
    userInfo: {
      handler(newval, old) {
        if (newval && newval.permission === "4") {
          this.$message.error("您已被封禁，恢复帐号请联系网站管理员");
          localStorage.setItem("accessToken", "");
          this.changeIsLogin(false);
          this.changeUserInfo({});
          this.changeUserId("");
          this.$router.push("/");
        }
      },
      deep: true
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
      roomList: state => state.roomList,
      rotationImgList: state => state.rotationImgList,
      matchList: state => state.matchList,
      announcementList: state => state.announcementList
    })
  },
  components: {
    Hfooter
  }
};
</script>
<style scoped>
.box {
  background: url("../../public/images/1.svg") no-repeat 120% 60%;
}
.top_search {
  padding: 10px;
  align-items: center;
  border-bottom: 1px #3e3c3a solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.top_model {
  flex: 40%;
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  justify-content: center;
}
.top_model_top,
.top_model_bottom {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
.top_model_bottom span {
  margin: 10px 8% 0 0;
  color: rgb(107, 107, 107);
  font-size: 14px;
  cursor: pointer;
}
.top {
  background: url("../../public/images/1.svg") no-repeat 100% 100%;
}
.top_right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.search_btn {
  background: #3e3c3a;
  transition: all 1s;
}
.search_btn:hover {
  background: #c94f20;
  border: solid #c94f20 1px;
  transition: all 1s;
}
</style>
