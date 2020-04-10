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
            <span
              style="font-size:12px;color:#999;margin: 10px 15px;"
            >权限：{{permissionMap[userData && userData.permission ||'0']}}</span>
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
              <el-button
                style="margin-left:15px;"
                size="small"
                v-if="userInfo && userInfo.permission =='0'"
                @click="verifyUser"
                type="danger"
              >申请认证</el-button>
              <router-link to="/management">
                <el-button
                  style="margin-left:15px;"
                  size="small"
                  v-if="userInfo && userInfo.permission =='1'"
                  type="primary"
                >后台管理 >></el-button>
              </router-link>
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
            <el-submenu
              v-if="userInfo && userInfo.permission =='1' || userInfo && userInfo.permission =='2'"
              index="4"
            >
              <template slot="title">
                <i class="el-icon-s-flag"></i>
                <span>我的活动&比赛</span>
              </template>
              <router-link to="/person/add_activity">
                <el-menu-item index="4-1">发布活动</el-menu-item>
              </router-link>
              <router-link to="/person/my_activity">
                <el-menu-item index="4-2">我的活动&比赛</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu v-if="userInfo && userInfo.permission =='２'" index="5">
              <template slot="title">
                <i class="el-icon-s-comment"></i>
                <span>我的聊天室</span>
              </template>
              <router-link to="/person/add_room">
                <el-menu-item index="5-1">新建聊天室</el-menu-item>
              </router-link>
              <router-link to="/person/my_room">
                <el-menu-item index="5-2">我的聊天室</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>我的账户</span>
              </template>
              <router-link to="/person/update_user_info">
                <el-menu-item index="6-1">修改个人信息</el-menu-item>
              </router-link>
              <el-menu-item @click="logout" index="6-2">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="12">
          <router-view class="personbox"></router-view>
        </el-col>
      </div>
    </el-row>
    <el-dialog title="申请认证" :loading="dialoading" :visible.sync="dialogVisible" width="60%">
      <div style="padding:20px">
        <el-form
          :rules="updateUserRules"
          ref="updateUserForm"
          :label-position="'top'"
          :model="updateUserForm"
          label-width="80px"
        >
          <el-form-item label="手机号:" prop="phone">
            <el-input placeholder="请输入11位手机号" maxlength="11" v-model="updateUserForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="个人介绍:" prop="introduce">
            <el-input placeholder="请输入个人介绍" v-model="updateUserForm.introduce"></el-input>
          </el-form-item>
          <el-form-item style="width:100%;">
            <div style="margin-top:80px">
              <el-button
                type="danger"
                icon="el-icon-s-promotion"
                @click="submit('updateUserForm')"
              >提交</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { UpdateUserInfo } from "../api/user_api";
import { permissionMap } from "../utils/tools";
export default {
  name: "UserPerson",
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
      userData: {},
      permissionMap
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
      "GetUserInfoById",
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    //更新房间
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          if (this.updateUserForm.imgurl == "") {
            this.$message.error("请上传房间海报");
            return;
          }
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.updateUserForm = {
                ...this.updateUserForm,
                permission: "6",
                _id: this.userid
              };
              
              UpdateUserInfo(this.updateUserForm)
                .then(res => {
                  
                  this.updateUserForm = {
                    phone: "",
                    introduce: ""
                  };
                  this.fileList = [];
                  this.content = "";
                  this.$message.success("申请认证成功");
                  this.dialogVisible = false;
                  this.GetUserInfoById({ _id: this.userid });
                })
                .catch(err => {
                  
                  this.$message.error("出现错误，请稍候再试");
                  this.dialogVisible = false;
                });
            })
            .catch(_ => {
              return;
            });
        } else {
          return false;
        }
      });
    },
    verifyUser() {
      this.dialoading = true;
      
      this.dialogVisible = true;
      this.dialoading = false;
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
        
        if (newval && newval.permission === "4") {
          this.$message.error("您已被封禁，恢复帐号请联系网站管理员");
          localStorage.setItem("accessToken", "");
          this.changeIsLogin(false);
          this.changeUserInfo({});
          this.changeUserId("");
          this.$router.push("/");
        }
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
