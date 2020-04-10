<template>
  <div>
    <factory-table
      :list="list"
      :options="options"
      :columns="columns"
      :operates="operates"
      :pageShow="false"
    ></factory-table>
    <el-dialog title="活动&比赛内容预览" :loading="dialoading" :visible.sync="dialogVisible" width="60%">
      <div v-html="showIntroduce"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllMatchList, DeleteMatch } from "../../api/match_api";
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
      PageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      activityRules: {
        imgtitle: [
          { required: true, message: "请输入活动&比赛标题", trigger: "blur" }
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
          prop: "title",
          label: "活动&比赛标题",
          align: "center",
          isShow: true
        },
        {
          prop: "matchUser",
          label: "创建者",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return row.matchUser[0].nickname || "";
          }
        },
        {
          prop: "article",
          label: "活动&比赛内容",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<div style='width:200px;height:100px;'>${row.article}}</div>`;
          }
        },
        {
          prop: "starttime",
          label: "开始时间",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return formatDateTime(+row.starttime);
          }
        },
        {
          prop: "starttime",
          label: "截至时间",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return formatDateTime(+row.endtime);
          }
        },
        {
          prop: "address",
          label: "活动地址",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<a
                href="${row.address}"
                target="_blank"
                rel="noopener noreferrer"
              >
                ${row.address}
              </a>`;
          }
        },
        {
          prop: "phone",
          label: "联系电话",
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
            label: "预览",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "info",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleShow(index, row);
            }
          },
          {
            id: "2",
            label: "删除",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "danger",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleDel(index, row);
            }
          }
        ]
      } // 列操作按钮
    };
  },
  created() {
    this.getActivityList();
  },
  methods: {
    handleDel(index, row) {
      
      this.$confirm("确定删除吗？")
        .then(_ => {
          DeleteMatch({ _id: row._id })
            .then(res => {
              
              this.getActivityList(this.PageConfig);
              this.$message.success("删除成功");
            })
            .catch(err => {
              
              this.$message.error("删除失败");
            });
        })
        .catch(_ => {});
    },
    handleShow(index, row) {
      
      this.dialoading = true;
      this.showIntroduce = (row && row.article) || "";
      this.dialogVisible = true;
      this.dialoading = false;
    },
    getActivityList(page) {
      this.options.loading = true;
      GetAllMatchList(page)
        .then(res => {
          
          if (res && res.data) {
            this.list = res.data || [];
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
      newActivityList: state => state.newActivityList,
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