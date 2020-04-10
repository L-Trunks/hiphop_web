<template>
  <div>
    <el-button icon="el-icon-plus" @click="addAnnouncement" size="small" type="warning">新增</el-button>
    <factory-table
      :list="list"
      :options="options"
      :columns="columns"
      :operates="operates"
      :pageShow="false"
    ></factory-table>
    <el-dialog title="内容预览" :loading="dialoading" :visible.sync="dialogVisible" width="60%">
      <div v-html="showIntroduce"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
        <el-form-item label="标题:" prop="imgtitle">
          <el-input v-model="editForm.imgtitle"></el-input>
        </el-form-item>
        <el-form-item label="封面:">
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
        <el-form-item v-if="dialogType=='add'" label="内容:" style="width:100%;">
          <editor :uploadUrl="uploadUrl" @getValue="showContent" :content="content"></editor>
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
  GetAllMatchList,
  DeleteMatch,
  UpdateMatch,
  AddMatch
} from "../../api/match_api";
import {
  GetAllRotationImgList,
  AddRotationImg,
  UpdateRotationImg,
  DeleteRotationImg
} from "../../api/rotatin_img_api";
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
        imgtitle: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ]
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
          prop: "imgtitle",
          label: "标题",
          align: "center",
          isShow: true
        },
        {
          prop: "introduce",
          label: "内容",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<div style='width:200px;height:100px;'>${row.introduce}}</div>`;
          }
        },
        {
          prop: "imgurl",
          label: "封面",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<img style='width:150px;height:150px' src='${row.imgurl}'/>`;
          }
        },
        {
          prop: "createtime",
          label: "创建时间",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return formatDateTime(row.createtime);
          }
        },
        {
          prop: "status",
          label: "当前状态",
          align: "center",
          isShow: true,
          formatter: function(row) {
            let statusMap = {
              "1": "已上架",
              "0": "已下架"
            };
            return statusMap[row.status];
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
          },
          {
            id: "3",
            label: "预览",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "danger",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleShow(index, row);
            }
          },
          {
            id: "4",
            label: "上下架",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "success",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.updateStatus(index, row);
            }
          }
        ]
      } // 列操作按钮
    };
  },
  created() {
    this.getAnnouncementList();
  },
  methods: {
    handleImgRemove(file, fileList) {
      
      this.editForm.imgurl = "";
    },
    handleImgSuccess(file) {
      
      this.editForm.imgurl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    handleEdit(index, row) {
      
      this.dialogType = "update";
      this.editForm = row;
      this.fileImgList = [{ name: "xx.jpg", url: row.imgurl }];
      this.content = row.introduce;
      this.editDialogVisible = true;
      
    },
    handledel(index, row) {
      
      this.$confirm("确定删除吗？")
        .then(_ => {
          DeleteRotationImg({ _id: row._id })
            .then(res => {
              
              this.getAnnouncementList()
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
          UpdateRotationImg({ _id: row._id, status: status })
            .then(res => {
              
              this.$message.success("更新成功");
              this.getAnnouncementList();
            })
            .catch(err => {
              
              this.$message.error("更新失败");
            });
        })
        .catch(_ => {});
    },
    handleShow(index, row) {
      
      this.dialoading = true;
      this.showIntroduce = (row && row.introduce) || "";
      this.dialogVisible = true;
      this.dialoading = false;
    },
    showContent(val) {
      this.editForm.introduce = setImgSize(val, 600, 350);
    },
    addAnnouncement() {
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
                status: "4"
              };
              AddRotationImg(this.editForm)
                .then(res => {
                  
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.getAnnouncementList();
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
              UpdateRotationImg(this.editForm)
                .then(res => {
                  
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.getAnnouncementList();
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
    getAnnouncementList() {
      this.options.loading = true;
      GetAllRotationImgList({})
        .then(res => {
          
          if (res && res.data) {
            this.list = [];
            res.data.map(i => {
              if (i.status == "0" || i.status == "1") {
                this.list.push(i);
              }
            });
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
  components: {
    FactoryTable,
    editor
  }
};
</script>

<style>
</style>