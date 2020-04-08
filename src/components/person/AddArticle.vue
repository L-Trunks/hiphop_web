<template>
  <div style="padding:20px">
    <el-form
      :rules="articleRules"
      ref="articleForm"
      :label-position="'top'"
      :model="articleForm"
      label-width="80px"
    >
      <el-form-item label="文章标题:" prop="title">
        <el-input v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文章分类:" prop="sortid">
        <el-select v-model="articleForm.sortid" placeholder="请选择文章分类">
          <el-option
            v-for="item in sortoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:100%;">
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
          <el-button type="danger" icon="el-icon-s-promotion" @click="submit('articleForm')">提交</el-button>
          <el-button type="info" icon="el-icon-view" @click="showArticle">预览</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog title="文章内容预览" :loading="dialoading" :visible.sync="dialogVisible" width="100%">
      <div v-html="articleForm.article"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import editor from "../components/editor";
import MarkDownEditor from "../components/MarkDownEditor";
import { AddArticle } from "../../api/article_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { setImgSize } from "../../utils/util";
import { PageConfig } from "../../utils/tools";
export default {
  name: "AddArticle",
  data() {
    return {
      dialoading: false,
      dialogVisible: false,
      articleForm: {
        nickname: "",
        userid: "",
        articlepermission: ""
      },
      PageConfig,
      articleContent: "",
      articleRules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        sortid: [{ required: true, message: "请选择分类", trigger: "blur" }]
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
    this.formatSort();
  },
  methods: {
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    showArticle() {
      this.dialoading = true;
      console.log(this.articleForm);
      this.dialogVisible = true;
      this.dialoading = false;
    },
    //提交文章
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.articleForm = {
                ...this.articleForm,
                nickname: this.userInfo.nickname,
                userid: this.userid,
                articlepermission: 1
              };
              AddArticle(this.articleForm)
                .then(res => {
                  console.log(res);
                  this.articleForm = {
                    nickname: "",
                    userid: "",
                    articlepermission: ""
                  };

                  this.GetAllArticleList(this.PageConfig);
                  this.$message.success("发布成功，快去看看吧");
                  // this.$router.push({
                  //   path: "/article_detail",
                  //   query: { articleid: res[0]._id }
                  // });
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
    },
    changeEditor(e) {
      console.log(e);
      this.$confirm("已编辑内容将会删除，确认切换吗？")
        .then(_ => {
          this.editorType = e;
        })
        .catch(_ => {});
    },
    showMDContent(val) {
      this.articleForm.article = setImgSize(val, 600, 350);
    },
    showContent(val) {
      this.articleForm.article = setImgSize(val, 600, 350);
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
    danceSortList: {
      handler(newval, old) {
        console.log(newval);
        this.formatSort();
      },
      deep: true
    }
  },
  components: {
    editor,
    MarkDownEditor
  }
};
</script>
<style scoped>
</style>
