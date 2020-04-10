<template>
  <div class>
    <el-row class="login">
      <el-col class="login_box" :span="16" :offset="4">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          label-width="0px"
          class="demo-ruleForm login-container"
        >
          <h3 class="title">在此登录</h3>
          <el-form-item prop="username">
            <el-input type="text" maxlength="11" placeholder="请输入手机号" v-model="loginForm.username" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" />
          </el-form-item>
          <el-form-item style="width:100%;">
            <el-button
              type="danger"
              style="width:100%;"
              @click="userLogin('loginForm')"
              :loading="logining"
            >登录</el-button>
          </el-form-item>
          <router-link to="/register">
            <el-button size="mini" type="info" class="remember">立即注册</el-button>
          </router-link>
        </el-form>
        <img src="../../public/images/breaking.jpg" alt srcset />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Login, VerifyUserName, VerifyNickName } from "../api/user_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { permissionMap } from "../utils/tools";

export default {
  name: "Login",
  data() {
    return {
      logining: false,
      loginForm: {
        username: "",
        password: ""
      },
      permissionMap,
      loginRules: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (localStorage.getItem("accessToken")) {
      this.$router.push("/");
    }
  },
  methods: {
    ...mapMutations([
      "changeUserId",
      "changeUserInfo",
      "changeToken",
      "changeIsLogin"
    ]),
    userLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.logining = true;
          this.loginForm.password = this.$md5(this.loginForm.password);
          
          Login(this.loginForm)
            .then(res => {
              
              if (res.data && res.data.length > 0) {
                console.log(res.data[0].permission)
                if (
                  res.data[0].permission != "3" &&
                  res.data[0].permission != "4" &&
                  res.data[0].permission != "5"
                ) {
                  this.changeToken(res.accessToken);
                  this.changeUserId(res.data[0]._id);
                  this.changeUserInfo(res.data[0]);
                  this.changeIsLogin(true);
                  this.$message.success(
                    `您好，${res.data[0].nickname}，权限：${
                      permissionMap[res.data[0].permission]
                    }`
                  );
                  localStorage.setItem("accessToken", res.accessToken); //写入token
                  this.logining = false;
                  this.$router.push("/");
                } else {
                  this.$router.push("/");
                  this.$message.error("您已被封禁，恢复帐号请联系网站管理员");
                }
              } else {
                this.logining = false;
                this.$message.error("登录失败，请检查输入格式或稍后再试");
                return;
              }
            })
            .catch(err => {
              
              this.logining = false;
              this.$message.error("登录失败，请检查输入格式或稍后再试");
            });
        } else {
          return false;
        }
      });
    }
  },
  components: {}
};
</script>
<style scoped>
.login {
  margin: 5px;
}
.login_box {
  display: flex;
  flex-direction: row;
}
.login-container,
.register-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 30%;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  /* height: 500px; */
}
</style>
