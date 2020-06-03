<template>
  <div class>
    <el-row class="reister">
      <el-col class="register_box" :span="16" :offset="4">
        <img style="flex:1" src="../../public/images/p.gif" alt srcset />
        <el-form
          :model="registerForm"
          ref="registerForm"
          :rules="registerRules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm register-container"
        >
          <h3 class="title">在此注册</h3>
          <el-form-item prop="username">
            <el-input
              type="text"
              maxlength="11"
              v-model="registerForm.username"
              auto-complete="off"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input
              type="text"
              v-model="registerForm.nickname"
              auto-complete="off"
              placeholder="请输入昵称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="registerForm.password"
              auto-complete="off"
              placeholder="请设置密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password2">
            <el-input
              type="password"
              v-model="registerForm.password2"
              auto-complete="off"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="birthday">
            <el-date-picker
              type="date"
              placeholder="请选择生日"
              v-model="registerForm.birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="mail">
            <el-input
              type="text"
              v-model="registerForm.mail"
              auto-complete="off"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="introduce">
            <el-input
              type="textarea"
              v-model="registerForm.introduce"
              auto-complete="off"
              placeholder="简单介绍下自己"
            ></el-input>
          </el-form-item>
          <el-form-item style="width:100%;">
            <el-button
              type="danger"
              style="width:100%;"
              @click="userRegister('registerForm')"
              :loading="logining"
            >注册</el-button>
          </el-form-item>
          <router-link to="/login">
            <el-button size="mini" type="info" class="remember">立即登录</el-button>
          </router-link>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  Login,
  VerifyUserName,
  VerifyNickName,
  Register
} from "../api/user_api";
import { dateTimeStamp } from "../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Register",
  data() {
    let checkpassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.password2 !== "") {
          this.$refs.registerForm.validateField("checkconfirmPassWord");
        }
        callback();
      }
    };
    let checkconfirmPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      registerForm: {
        username: "",
        nickname: "",
        mail: ""
      },
      registerRules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" }
        ],
        password: [{ validator: checkpassWord, trigger: "blur" }],
        password2: [{ validator: checkconfirmPassWord, trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.isLogin) {
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
    userRegister(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.logining = true;

          VerifyUserName({ username: this.registerForm.username })
            .then(res => {
              if (res && res.code === "1003") {
                this.$message.error("该手机号已被注册");
                this.logining = false;
                return;
              } else {
                VerifyNickName({ nickname: this.registerForm.nickname })
                  .then(res => {
                    if (res && res.code === "1008") {
                      this.$message.error("昵称已被使用");
                      this.logining = false;
                      return;
                    } else {
                      this.registerForm.password = this.$md5(
                        this.registerForm.password
                      );

                      this.registerForm = {
                        ...this.registerForm,
                        imgurl: "http://localhost:8888/public/images/user1.jpg",
                        birthday: dateTimeStamp(this.registerForm.birthday),
                        permission: "0"
                      };

                      Register(this.registerForm)
                        .then(res => {
                          if (res.data && res.data._id) {
                            this.changeUserId(res.data._id);
                            this.$message.success("注册成功，尝试自动登陆");
                            Login({
                              username: this.registerForm.username,
                              password: this.registerForm.password
                            })
                              .then(res => {
                                if (res.data && res.data.length > 0) {
                                  this.changeToken(res.accessToken);
                                  this.changeUserId(res.data[0]._id);
                                  this.changeUserInfo(res.data[0]);
                                  this.changeIsLogin(true);
                                  this.$message.success("登录成功");
                                  localStorage.setItem(
                                    "accessToken",
                                    res.accessToken
                                  ); //写入token
                                  this.logining = false;
                                  this.$router.push("/");
                                } else {
                                  this.logining = false;
                                  this.$message.error(
                                    "自动登录失败，请手动登录"
                                  );
                                  this.$router.push("/login");
                                }
                              })
                              .catch(err => {
                                this.logining = false;

                                this.$router.push("/login");
                                this.$message.error("登录失败，请手动登录");
                              });
                          }
                        })
                        .catch(err => {});
                    }
                  })
                  .catch(err => {});
              }
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo
    })
  },
  components: {}
};
</script>
<style scoped>
.reister {
  margin: 5px;
}
.register_box {
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
