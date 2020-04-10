<template>
  <div>
    <el-button icon="el-icon-plus" @click="addKeyword" size="small" type="warning">新增</el-button>
    <factory-table
      :list="list"
      :options="options"
      :columns="columns"
      :operates="operates"
      :pageShow="false"
    ></factory-table>
    <el-dialog
      :title="dialogType=='add'?'添加':'编辑'"
      :loading="dialoading"
      :visible.sync="editDialogVisible"
      width="60%"
    >
      <el-form
        :rules="activityRules"
        ref="editForm"
        :label-position="'top'"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="关键词:" prop="keyword">
          <el-input v-model="editForm.keyword"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <div style="margin-top:80px">
            <el-button
              type="danger"
              icon="el-icon-s-promotion"
              @click="dialogType=='add'?addSubmit('editForm'):updateSubmit('editForm')"
            >提交</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddKeyword,
  UpdateKeyword,
  GetAllKeywords,
  DeleteKeyword
} from "../../api/keyword_api";
import editor from "../components/editor";
import { setImgSize } from "../../utils/util";
import FactoryTable from "../components/FactoryTable";
import { formatDateTime } from "../../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "AcitivityManagement",
  data() {
    return {
      editForm: {},
      content: "",
      uploadUrl: "/api/upload/image",
      dialogType: "",
      editDialogVisible: false,
      dialoading: false,
      dialogVisible: false,
      showIntroduce: "",
      list: [], // table数据
      fileImgList: [],
      addForm: {},
      activityRules: {
        sortname: [{ required: true, message: "请输入分类名", trigger: "blur" }]
      },
      updateForm: {},
      options: {
        // table样式参数
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数结束
      columns: [
        {
          prop: "keyword",
          label: "分类名",
          align: "center",
          isShow: true
        },
        {
          prop: "createtime",
          label: "创建时间",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return formatDateTime(row.createtime);
          }
        }
      ], // 需要展示的列结束
      operates: {
        //操作栏
        // width: 400,
        fixed: "right",
        list: [
          {
            id: "1",
            label: "编辑",
            show: true, //是否显示按钮
            className: "primary", //样式类名
            type: "primary",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleEdit(index, row);
            }
          },
          {
            id: "2",
            label: "删除",
            show: true,
            className: "searchAll",
            type: "danger",
            disabled: false,
            method: (index, row) => {
              this.handledel(index, row);
            }
          }
        ]
      } // 列操作按钮
    };
  },
  created() {
    this.getKeywordList();
  },
  methods: {
    handledel(index, row) {
      
      this.$confirm("确定删除吗？")
        .then(_ => {
          DeleteKeyword({ _id: row._id })
            .then(res => {
              
              this.getKeywordList();
              this.$message.success("删除成功");
            })
            .catch(err => {
              
              this.$message.error("删除失败");
            });
        })
        .catch(_ => {});
    },
    updateStatus(index, row) {
      this.$confirm("确定更新状态吗？")
        .then(_ => {
          let status = "";
          if (row && row.status == "0") {
            status = "1";
          } else if (row && row.status == "1") {
            status = "0";
          }
          UpdateKeyword({ _id: row._id, status: status })
            .then(res => {
              
              this.$message.success("更新成功");
              this.getKeywordList();
            })
            .catch(err => {
              
              this.$message.error("更新失败");
            });
        })
        .catch(_ => {});
    },
    handleEdit(index, row) {
      
      this.dialogType = "update";
      this.editForm = row;
      this.editDialogVisible = true;
      
    },
    showContent(val) {
      this.editForm.introduce = setImgSize(val, 600, 350);
    },
    addKeyword() {
      this.dialogType = "add";
      this.editForm = {};
      this.editDialogVisible = true;
    },
    addSubmit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.editForm = {
                ...this.editForm,
                userid: this.userInfo._id || "",
                status: "0"
              };
              AddKeyword(this.editForm)
                .then(res => {
                  
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.getKeywordList();
                  this.$message.success("添加成功");
                })
                .catch(err => {
                  
                  this.$message.error("出现错误，请稍候再试");
                });
            })
            .catch(_ => {});
        } else {
          return false;
        }
      });
    },
    updateSubmit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.editForm = {
                ...this.editForm,
                userid: this.userInfo._id || "",
                status: "0"
              };
              UpdateKeyword(this.editForm)
                .then(res => {
                  
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.getKeywordList();
                  this.$message.success("更新成功");
                })
                .catch(err => {
                  
                  this.$message.error("出现错误，请稍候再试");
                });
            })
            .catch(_ => {});
        } else {
          return false;
        }
      });
    },
    getKeywordList() {
      this.options.loading = true;
      GetAllKeywords({})
        .then(res => {
          
          if (res && res.data) {
            this.list = res.data;
            setTimeout(() => {
              this.options.loading = false;
            }, 500);
          }
        })
        .catch(err => {
          
          this.$message.error("出现错误，请稍候重试");
          this.options.loading = false;
        });
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceKeywordList: state => state.danceKeywordList,
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
  components: {
    FactoryTable,
    editor
  }
};
</script>

<style>
</style>