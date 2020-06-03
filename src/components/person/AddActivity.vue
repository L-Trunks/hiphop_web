<template>
  <div style="padding:20px">
    <el-form
      :rules="activityRules"
      ref="activityForm"
      :label-position="'top'"
      :model="activityForm"
      label-width="80px"
    >
      <el-form-item label="活动标题:" prop="title">
        <el-input v-model="activityForm.title"></el-input>
      </el-form-item>
      <el-form-item label="活动地址:" prop="address">
        <el-input placeholder="请从省级开始输入活动详细地址" v-model="activityForm.address"></el-input>
      </el-form-item>
      <el-form-item label="联系方式:" prop="phone">
        <el-input placeholder="手机号或微信号" v-model="activityForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="开始时间:" prop="starttime">
        <el-date-picker
          type="datetime"
          placeholder="请选择开始时间"
          v-model="activityForm.starttime"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间:" prop="endtime">
        <el-date-picker
          type="datetime"
          placeholder="请选择结束时间"
          v-model="activityForm.endtime"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动海报:">
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
      <el-form-item label="活动介绍:" style="width:100%;">
        <el-button-group style="padding-bottom:20px">
          <el-button
            size="small"
            :type="editorType=='0'?'primary':''"
            @click="changeEditor('0')"
          >富文本编辑器</el-button>
          <el-button
            size="small"
            :type="editorType=='1'?'primary':''"
            @click="changeEditor('1')"
          >MarkDown编辑器</el-button>
        </el-button-group>
        <editor
          v-if="editorType==='0'"
          :uploadUrl="uploadUrl"
          @getValue="showContent"
          v-model="content"
        ></editor>
        <mark-down-editor
          :uploadUrl="uploadUrl"
          v-if="editorType==='1'"
          @getValue="showMDContent"
          v-model="content"
        ></mark-down-editor>
      </el-form-item>
      <el-form-item style="width:100%;">
        <div style="margin-top:80px">
          <el-button type="danger" icon="el-icon-s-promotion" @click="submit('activityForm')">提交</el-button>
          <el-button type="info" icon="el-icon-view" @click="showActivity">预览</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog title="活动内容预览" :loading="dialoading" :visible.sync="dialogVisible" width="100%">
      <div v-html="activityForm.article"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import editor from "../components/editor";
import MarkDownEditor from "../components/MarkDownEditor";
import { AddMatch } from "../../api/match_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { setImgSize, dateTimeStamp } from "../../utils/util";
export default {
  name: "AddActivity",
  data() {
    return {
      fileImgList: [],
      dialoading: false,
      dialogVisible: false,
      activityForm: {
        title: "",
        userid: "",
        address: "",
        article: "",
        imgurl: "",
        phone: ""
      },
      activityContent: "",
      activityRules: {
        title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
        address: [
          { required: true, message: "请输入活动地址", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        starttime: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        endtime: [
          { required: true, message: "请选择结束时间", trigger: "blur" }
        ]
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
    if (
      this.userInfo &&
      this.userInfo.permission !== "1" &&
      this.userInfo.permission !== "2"
    ) {
      this.$message.error('您无权访问此网页')
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions(["GetAllRotationImgList", "GetAllMatchList"]),
    handleImgRemove(file, fileList) {
      
      this.activityForm.imgurl = "";
    },
    handleImgSuccess(file) {
      
      this.activityForm.imgurl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    showActivity() {
      this.dialoading = true;
      
      this.dialogVisible = true;
      this.dialoading = false;
    },
    //提交活动
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          if (this.activityForm.imgurl == "") {
            this.$message.error("请上传活动海报");
            return;
          }
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.activityForm = {
                ...this.activityForm,
                starttime: dateTimeStamp(this.activityForm.starttime),
                endtime: dateTimeStamp(this.activityForm.endtime),
                userid: this.userid
              };
              
              AddMatch(this.activityForm)
                .then(res => {
                  
                  this.activityForm = {
                    title: "",
                    userid: "",
                    address: "",
                    article: "",
                    imgurl: "",
                    phone: ""
                  };
                  this.fileList = [];
                  this.content = "";
                  this.$message.success("发布成功，快去看看吧");
                  this.GetAllMatchList({});
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
    },
    changeEditor(e) {
      
      this.$confirm("已编辑内容将会删除，确认切换吗？")
        .then(_ => {
          this.editorType = e;
        })
        .catch(_ => {});
    },
    showMDContent(val) {
      this.activityForm.article = setImgSize(val, 600, 350);
    },
    showContent(val) {
      this.activityForm.article = setImgSize(val, 600, 350);
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList,
      newActivityList: state => state.newActivityList,
      newVideoList: state => state.newVideoList,
      messageList: state => state.messageList,
      videoResult: state => state.videoResult,
      activityResult: state => state.activityResult,
      rotationImgList: state => state.rotationImgList,
      activityCollectList: state => state.activityCollectList,
      videoCollectList: state => state.videoCollectList
    })
  },
  watch: {},
  components: {
    editor,
    MarkDownEditor
  }
};
</script>
<style scoped>
</style>