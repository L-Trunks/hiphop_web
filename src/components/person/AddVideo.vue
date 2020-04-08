<template>
  <div style="padding:20px">
    <el-form
      :rules="videoRules"
      ref="videoForm"
      :label-position="'top'"
      :model="videoForm"
      label-width="80px"
    >
      <el-form-item label="视频标题:" prop="videotitle">
        <el-input v-model="videoForm.videotitle"></el-input>
      </el-form-item>
      <el-form-item label="视频分类:" prop="sortid">
        <el-select v-model="videoForm.sortid" placeholder="请选择视频分类">
          <el-option
            v-for="item in sortoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频简介:" prop="introduce">
        <el-input type="textarea" v-model="videoForm.introduce"></el-input>
      </el-form-item>
      <el-form-item label="视频封面:">
        <el-upload
          class="upload-demo"
          :action="uploadImgUrl"
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
      <el-form-item label="上传视频:">
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="width:100%;">
        <div style="margin-top:80px">
          <el-button type="danger" icon="el-icon-s-promotion" @click="submit('videoForm')">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import editor from "../components/editor";
import MarkDownEditor from "../components/MarkDownEditor";
import { AddVideo } from "../../api/video_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { setImgSize } from "../../utils/util";
import { PageConfig } from "../../utils/tools";
export default {
  name: "AddVideo",
  data() {
    return {
      uploadUrl: "/api/upload/video",
      uploadImgUrl: "/api/upload/image",
      fileList: [],
      fileImgList: [],
      dialoading: false,
      dialogVisible: false,
      videoForm: {
        videourl: "",
        userid: "",
        firsturl: ""
      },
      PageConfig,
      videoContent: "",
      videoRules: {
        videotitle: [
          { required: true, message: "请输入视频标题", trigger: "blur" }
        ],
        sortid: [{ required: true, message: "请选择分类", trigger: "blur" }]
      },
      editorType: "0",
      content: "", // 视频内容
      editorOption: {}, // 编辑器选项
      addRange: [],
      sortoptions: [],
      uploadType: "", // 上传的文件类型（图片、视频）
      fullscreenLoading: false
    };
  },
  mounted() {
    this.formatSort();
  },
  methods: {
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllRotationImgList",
      "GetAllVideoList"
    ]),
    handleImgRemove(file, fileList) {
      console.log(file, fileList);
      this.videoForm.firsturl = "";
    },
    handleImgSuccess(file) {
      console.log(file);
      this.videoForm.firsturl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.videoForm.videourl = "";
    },
    handleSuccess(file) {
      console.log(file);
      this.videoForm.videourl = file.data.url;
    },
    handleExceed() {
      this.$message.error("只允许上传一个视频");
    },
    //提交视频
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          if (this.videoForm.firsturl == "") {
            this.$message.error("请上传视频封面");
            return;
          }
          if (this.videoForm.videourl == "") {
            this.$message.error("请上传视频");
            return;
          }
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.videoForm = {
                ...this.videoForm,
                userid: this.userid
              };
              AddVideo(this.videoForm)
                .then(res => {
                  console.log(res);
                  this.videoForm = {
                    videourl: "",
                    userid: "",
                    firsturl: ""
                  };
                  this.fileList = [];
                  this.fileImgList = [];
                  this.GetAllVideoList(this.PageConfig);
                  this.$message.success("发布成功，快去看看吧");
                })
                .catch(err => {
                  console.log(err);
                  this.$message.error("出现错误，请稍候再试");
                });
            })
            .catch(_ => {});
        } else {
          return false;
        }
      });
    },

    //格式化分类列表
    formatSort() {
      this.sortoptions = [];
      this.danceSortList &&
        this.danceSortList.map(i => {
          this.sortoptions.push({ value: i._id, label: i.sortname });
        });

      if (this.sortoptions == 0) {
        this.GetAllDanceSortList();
      }
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
  watch: {
    danceSortList: {
      handler(newval, old) {
        console.log(newval);
        this.formatSort();
      },
      deep: true
    }
  },
  components: {}
};
</script>
<style scoped>
</style>
