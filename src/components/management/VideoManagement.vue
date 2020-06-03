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
    <el-dialog title="视频内容预览" :loading="dialoading" :visible.sync="dialogVisible" width="60%">
      <div class="prism-player" id="player-con"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueAliplayer from "vue-aliplayer";
import { GetAllVideoList, DeleteVideo } from "../../api/video_api";
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
          { required: true, message: "请输入视频标题", trigger: "blur" }
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
          prop: "videotitle",
          label: "视频标题",
          align: "center",
          isShow: true
        },
        {
          prop: "videoUser",
          label: "作者",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return row.videoUser[0].nickname || "";
          }
        },
        {
          prop: "introduce",
          label: "视频介绍",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<div style='width:300px;height:100px;'>${row.introduce}}</div>`;
          }
        },
        {
          prop: "firsturl",
          label: "视频封面",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<img style='width:150px;height:150px' src='${row.firsturl}'/>`;
          }
        },
        {
          prop: "videourl",
          label: "视频地址",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return `<a href='${row.videourl}' target='_blank'>${row.videourl}</a>`;
          }
        },
        {
          prop: "articleSort",
          label: "分类",
          align: "center",
          isShow: true,
          formatter: function(row) {
            return row.videoSort[0].sortname;
          }
        },
        {
          prop: "lookscount",
          label: "浏览量",
          align: "center",
          isShow: true
        },
        {
          prop: "commentscount",
          label: "评论数",
          align: "center",
          isShow: true
        },
        {
          prop: "collectscount",
          label: "收藏数",
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
    this.getVideoList({
      page_size: 8,
      page_no: 0,
      total: 0
    });
  },
  methods: {
    setVideo(data) {
      let player = new Aliplayer(
        {
          id: "player-con",
          width: "100%",
          height: "500px",
          autoplay: false,
          isLive: false,
          rePlay: false,
          playsinline: true,
          preload: true,
          controlBarVisibility: "hover",
          showBarTime: 5000,
          source:
            data.videourl || "http://localhost:8888/public/videos/video1.mp4",
          cover: data.firsturl,
          // useH5Prism: true,
          skinLayout: [
            {
              name: "bigPlayButton",
              align: "blabs",
              x: 30,
              y: 80
            },
            {
              name: "H5Loading",
              align: "cc"
            },
            {
              name: "errorDisplay",
              align: "tlabs",
              x: 0,
              y: 0
            },
            {
              name: "infoDisplay"
            },
            {
              name: "tooltip",
              align: "blabs",
              x: 0,
              y: 56
            },
            {
              name: "thumbnail"
            },
            {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 0,
              children: [
                {
                  name: "progress",
                  align: "blabs",
                  x: 0,
                  y: 44
                },
                {
                  name: "playButton",
                  align: "tl",
                  x: 15,
                  y: 12
                },
                {
                  name: "timeDisplay",
                  align: "tl",
                  x: 10,
                  y: 7
                },
                {
                  name: "fullScreenButton",
                  align: "tr",
                  x: 10,
                  y: 12
                },
                {
                  name: "setting",
                  align: "tr",
                  x: 15,
                  y: 12
                },
                {
                  name: "volume",
                  align: "tr",
                  x: 5,
                  y: 10
                }
              ]
            }
          ]
        },
        function(player) {
          
        }
      );
      //   this.videoPlay = player;
    },
    handleDel(index, row) {
      
      this.$confirm("确定删除吗？")
        .then(_ => {
          DeleteVideo({ _id: row._id })
            .then(res => {
              
              this.getVideoList(this.PageConfig);
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
      this.dialogVisible = true;
      setTimeout(() => {
        this.setVideo(row);
      }, 500);

      this.dialoading = false;
    },
    getVideoList(page) {
      this.options.loading = true;
      GetAllVideoList(page)
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
      this.getVideoList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        page_size: this.PageConfig.page_size,
        page_no: val - 1
      };
      this.getVideoList(PageConfig);
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList,
      newVideoList: state => state.newVideoList,
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