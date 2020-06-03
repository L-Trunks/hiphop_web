<template>
  <div>
    <factory-table
      :list="list"
      :options="options"
      :columns="columns"
      :operates="operates"
      :pageShow="false"
    ></factory-table>
    <el-pagination
      style="margin:15px"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="PageConfig.page_no"
      :page-sizes="[8, 16, 32, 64]"
      :page-size="PageConfig.page_size"
      layout="total,sizes, prev, pager, next"
      :total="PageConfig.total"
    ></el-pagination>
    <el-dialog title="发送消息通知" :loading="dialoading" :visible.sync="dialogVisible" width="60%">
      <el-form
        :rules="sendRules"
        ref="sendForm"
        :label-position="'top'"
        :model="sendForm"
        label-width="80px"
      >
        <el-form-item label="接收用户:" prop="nickname">
          <el-input disabled v-model="sendForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="消息内容:" prop="message">
          <el-input v-model="sendForm.message"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <div style="margin-top:80px">
            <el-button type="danger" icon="el-icon-s-promotion" @click="sendSubmit('sendForm')">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllUserList, UnBanUser, BanUser } from "../../api/user_api";
import { AddMessage } from "../../api/message_api";
import editor from "../components/editor";
import { setImgSize } from "../../utils/util";
import FactoryTable from "../components/FactoryTable";
import { formatDateTime } from "../../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
import { permissionMap } from "../../utils/tools";
export default {
  name: "AcitivityManagement",
  data() {
    return {
      sendForm: {},
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
      PageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      sendRules: {
        message: [
          { required: true, message: "请输入通知信息", trigger: "blur" }
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
          prop: "nickname",
          label: "用户昵称",
          align: "center",
          isShow: true
        },
        {
          prop: "username",
          label: "用户帐号",
          align: "center",
          isShow: true
        },
        {
          prop: "introduce",
          label: "用户简介",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<div style='width:200px;height:100px;'>${row.introduce}</div>`;
          }
        },
        {
          prop: "imgurl",
          label: "用户头像",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<img style='width:80px;height:80px;border-radius:50%' src='${row.imgurl}'/>`;
          }
        },
        {
          prop: "mail",
          label: "邮箱",
          align: "center",
          isShow: true
        },
        {
          prop: "phone",
          label: "手机号",
          align: "center",
          isShow: true
        },
        {
          prop: "permission",
          label: "用户权限",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<span style='padding:2px;color:#f13f40;font-size:12px'>${
              permissionMap[row.permission]
            }</span> `;
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
        }
      ], // 需要展示的列结束
      operates: {
        //操作栏
        width: 400,
        fixed: "right",
        list: [
          {
            id: "1",
            label: "发送消息通知",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "info",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.sendMessage(index, row);
            }
          },
          {
            id: "2",
            label: "封禁",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "danger",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleBan(index, row);
            }
          },
          {
            id: "3",
            label: "解禁",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "primary",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleUnBan(index, row);
            }
          },
          {
            id: "4",
            label: "认证操作",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "warning",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.verify(index, row);
            }
          },
          {
            id: "4",
            label: "设为管理员",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "primary",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.setManagement(index, row);
            }
          }
        ]
      } // 列操作按钮
    };
  },
  created() {
    this.getUserList({
      page_size: 8,
      page_no: 0,
      total: 0
    });
  },
  methods: {
    sendSubmit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.sendForm = {
                ...this.sendForm,
                from: this.userInfo._id || "",
                status: "0"
              };
              AddMessage(this.sendForm)
                .then(res => {
                  this.sendForm = {};
                  this.dialogVisible = false;
                  this.$message.success("发送成功");
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
    handleUnBan(index, row) {
      if (row.permission !== "4") {
        this.$message.error("该用户未被封禁");
        return;
      }
      this.$confirm("确定解禁该用户吗？")
        .then(_ => {
          UnBanUser({ _id: row._id, permission: "0" })
            .then(res => {
              this.getUserList({
                page_size: 8,
                page_no: 0,
                total: 0
              });
              this.$message.success("操作成功");
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
        })
        .catch(_ => {});
    },
    verify(index, row) {
      if (row.permission !== "6") {
        this.$message.error("该用户未申请认证");
        return;
      }
      this.$confirm("确定认证该用户吗？")
        .then(_ => {
          BanUser({ _id: row._id, permission: "2" })
            .then(res => {
              this.getUserList({
                page_size: 8,
                page_no: 0,
                total: 0
              });
              this.$message.success("操作成功");
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
        })
        .catch(_ => {});
    },
    setManagement(index, row) {
      if (row.permission == "1") {
        this.$message.error("该用户已是管理员");
        return;
      }
      this.$confirm("确定设置该用户为管理员？")
        .then(_ => {
          BanUser({ _id: row._id, permission: "1" })
            .then(res => {
              this.getUserList({
                page_size: 8,
                page_no: 0,
                total: 0
              });
              this.$message.success("操作成功");
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
        })
        .catch(_ => {});
    },
    handleBan(index, row) {
      if (row.permission == "4") {
        this.$message.error("该用户已被封禁");
        return;
      }
      this.$confirm("确定封禁该用户吗？")
        .then(_ => {
          BanUser({ _id: row._id, permission: "4" })
            .then(res => {
              this.getUserList({
                page_size: 8,
                page_no: 0,
                total: 0
              });
              this.$message.success("操作成功");
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
        })
        .catch(_ => {});
    },
    sendMessage(index, row) {
      this.dialoading = true;
      this.sendForm = {
        nickname: row.nickname || "",
        message: "",
        to: row._id || ""
      };
      this.dialogVisible = true;
      this.dialoading = false;
    },
    getUserList(page) {
      this.options.loading = true;
      GetAllUserList(page)
        .then(res => {
          if (res && res.data) {
            this.PageConfig.total = res.data.total || 0;
            this.list = res.data.data || [];
            setTimeout(() => {
              this.options.loading = false;
            }, 500);
          }
        })
        .catch(err => {
          this.$message.error("出现错误，请稍候重试");
          this.options.loading = false;
        });
    },
    handleSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.PageConfig.page_no - 1
      };
      this.getUserList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        page_size: this.PageConfig.page_size,
        page_no: val - 1
      };
      this.getUserList(PageConfig);
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList,
      newUserList: state => state.newUserList,
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