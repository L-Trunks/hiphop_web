<template>
  <div :loading="loading" style="padding:20px">
    <div class="user_img">
      <img
        class="image"
        :src="userForm &&userForm.imgurl||'http://localhost:8888/public/images/user1.jpg'"
        alt
      />
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :limit="1"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button
          :style="disabled?'display:none':'display:block'"
          size="small"
          :disabled="disabled"
          type="primary"
        >点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <div class="user_info">
      <el-form :label-position="'left'" ref="userForm" v-model="userForm" label-width="80px">
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="userForm.nickname" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="userForm.mail" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="个人简介:">
          <el-input v-model="userForm.introduce" type="textarea" :disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="user_btn">
      <el-button v-if="disabled" @click="disabled=false" type="primary">编辑</el-button>
      <el-button v-if="!disabled" @click="submit" type="danger">提交</el-button>
      <el-button v-if="!disabled" @click="disabled=false" type="primary">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { UpdateUserInfo, VerifyNickName } from "../../api/user_api";
export default {
  name: "UpdateUserInfo",
  data() {
    return {
      uploadUrl: "/api/upload/image",
      userForm: {
        imgurl: "",
        nickname: "",
        mail: "",
        introduce: ""
      },
      disabled: true,
      fileList: [],
      loading: false
    };
  },
  created() {},
  mounted() {
    this.userInfo ? (this.userForm = this.userInfo) : "";
    
  },
  methods: {
    ...mapActions(["GetUserInfoById"]),
    ...mapMutations([
      "changeVideoResult",
      "changeArticleResult",
      "changeToken",
      "changeIsLogin",
      "changeUserId",
      "changeUserInfo"
    ]),
    submit() {
      this.loading = true;
      if (this.userForm && this.userForm.nickname == 0) {
        this.loading = false;
        this.$message.error("请填写昵称");
        return;
      }
      VerifyNickName({ nickname: this.userForm.nickname })
        .then(res => {
          
          if (
            res &&
            res.code === "1008" &&
            res.data[0].nickname !== this.userInfo.nickname
          ) {
            this.loading = false;
            this.$message.error("昵称已被使用");
            return;
          } else {
            UpdateUserInfo({ ...this.userForm, _id: this.userid })
              .then(res => {
                
                if (res && res.code == "200") {
                  this.loading = false;
                  this.fileList = [];
                  this.GetUserInfoById({ _id: this.userid });
                  this.$message.success("修改成功");
                  this.disabled = true;
                  
                } else {
                  this.loading = false;
                  this.$message.error("出现错误，请稍候重试");
                }
              })
              .catch(err => {
                
                this.loading = false;
                this.$message.error("出现错误，请稍候重试");
              });
          }
        })
        .catch(err => {
          this.loading = false;
          
          this.$message.error("昵称验证失败，请稍候重试");
        });
    },
    beforeUpload() {
      this.loading = true;
    },
    handleRemove(file, fileList) {
      this.loading = true;
      
      this.userForm.imgurl =
        this.userInfo.imgurl || "http://localhost:8888/public/images/user1.jpg";
      this.loading = false;
    },
    handleSuccess(file) {
      
      this.userForm.imgurl = file.data.url;
      this.loading = false;
    },
    handleExceed() {
      this.$message.error("只允许上传一张图片,请删除后再上传");
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo
    })
  },
  watch: {
    userInfo: {
      handler(newval, old) {
        
        this.userForm = newval;
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.user_img {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.upload-demo {
  text-align: center;
}
.user_info {
  padding: 20px 0;
}
.user_btn {
  padding: 20px 0;
}
</style>
