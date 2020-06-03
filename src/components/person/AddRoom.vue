<template>
  <div style="padding:20px">
    <el-form
      :rules="roomRules"
      ref="roomForm"
      :label-position="'top'"
      :model="roomForm"
      label-width="80px"
    >
      <el-form-item label="房间标题:" prop="title">
        <el-input v-model="roomForm.title"></el-input>
      </el-form-item>
      <el-form-item label="房间介绍:" prop="introduce">
        <el-input placeholder="请输入房间介绍" v-model="roomForm.introduce"></el-input>
      </el-form-item>
      <el-form-item label="房间海报:">
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :on-success="handleImgSuccess"
          :on-remove="handleImgRemove"
          :file-list="fileImgList"
          list-type="picture"
          :limit="1"
          :on-exceed="handleImgExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1mb</div>
        </el-upload>
      </el-form-item>
      <el-form-item style="width:100%;">
        <div style="margin-top:80px">
          <el-button type="danger" icon="el-icon-s-promotion" @click="submit('roomForm')">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { AddRoom } from "../../api/room_api";
import { GetAllRoomList, UpdateRoom } from "../../api/room_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { setImgSize, dateTimeStamp } from "../../utils/util";
export default {
  name: "AddRoom",
  data() {
    return {
      fileImgList: [],
      dialoading: false,
      dialogVisible: false,
      roomForm: {
        title: "",
        userid: "",
        introduce: "",
        status: "",
        imgurl: ""
      },
      roomContent: "",
      roomRules: {
        title: [{ required: true, message: "请输入房间标题", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }]
      },
      editorType: "0",
      content: "", // 文章内容
      editorOption: {}, // 编辑器选项
      addRange: [],
      sortoptions: [],
      uploadUrl: "/api/upload/image",
      uploadType: "", // 上传的文件类型（图片、视频）
      fullscreenLoading: false
    };
  },
  mounted() {
    if (this.userInfo && this.userInfo.permission !== "2") {
      this.$message.error("您无权访问此网页");
      this.$router.push("/");
    }
  },
  methods: {
    ...mapActions(["GetAllRotationImgList", "GetAllRoomList"]),
    handleImgRemove(file, fileList) {
      this.roomForm.imgurl = "";
    },
    handleImgSuccess(file) {
      this.roomForm.imgurl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    showRoom() {
      this.dialoading = true;

      this.dialogVisible = true;
      this.dialoading = false;
    },
    //提交房间
    submit(formname) {
      GetAllRoomList({ userid: this.userid })
        .then(res => {
          if (res && res.data && res.data.length >= 1) {
            this.$message.error("一个用户仅允许创建一个聊天室");
            return;
          } else {
            this.$refs[formname].validate(valid => {
              if (valid) {
                if (this.roomForm.imgurl == "") {
                  this.$message.error("请上传房间海报");
                  return;
                }
                this.$confirm("确定提交吗？")
                  .then(_ => {
                    this.roomForm = {
                      ...this.roomForm,
                      userid: this.userid
                    };

                    AddRoom(this.roomForm)
                      .then(res => {
                        this.roomForm = {
                          title: "",
                          userid: "",
                          introduce: "",
                          status: "",
                          imgurl: ""
                        };
                        this.fileList = [];
                        this.content = "";
                        this.$message.success("新建成功，快去看看吧");
                        this.GetAllRoomList({});
                      })
                      .catch(err => {
                        this.$message.error("出现错误，请稍候再试");
                      });
                  })
                  .catch(_ => {
                    return;
                  });
              } else {
                return false;
              }
            });
          }
        })
        .catch(err => {});
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList
    })
  },
  watch: {},
  components: {}
};
</script>
<style scoped>
</style>
