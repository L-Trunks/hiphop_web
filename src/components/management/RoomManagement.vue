<template>
  <div>
    <factory-table
      :list="list"
      :options="options"
      :columns="columns"
      :operates="operates"
      :pageShow="false"
    ></factory-table>
  </div>
</template>

<script>
import { GetAllRoomList, DeleteRoom } from "../../api/room_api";
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
          label: "房间标题",
          align: "center",
          isShow: true
        },
        {
          prop: "introduce",
          label: "房间介绍",
          align: "center",
          isShow: true
        },
        {
          prop: "roomUser",
          label: "创建者",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return row.roomUser[0].nickname;
          }
        },
        {
          prop: "imgurl",
          label: "房间封面",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<img style='width:150px;height:150px' src='${row.imgurl}'/>`;
          }
        },
        {
          prop: "status",
          label: "当前状态",
          align: "center",
          isShow: true,
          formatter: function(row) {
            let statusMap = {
              "1": "关闭中",
              "0": "开启中"
            };
            return statusMap[row.status];
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
        // width: 400,
        fixed: "right",
        list: [
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
    this.getRoomList();
  },
  methods: {
    handleDel(index, row) {
      
      this.$confirm("确定删除吗？")
        .then(_ => {
          DeleteRoom({ _id: row._id })
            .then(res => {
              
              this.getRoomList();
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
    getRoomList() {
      this.options.loading = true;
      GetAllRoomList()
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
      newRoomList: state => state.newRoomList,
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