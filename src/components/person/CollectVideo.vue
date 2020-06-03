<template>
  <div>
    <div :loading="articleLoading" class="my_article">
      <el-card
        class="card"
        v-for="(item, index) in list"
        :key="index"
        :body-style="{ padding: '0px' }"
      >
        <div
          @click="showDetail(item)"
          :style="{ background: 'url('+item.imgurl+') no-repeat center center', backgroundSize: '100% 100%',width:'100%',height:'200px'}"
        >
          <div class="demo"></div>
        </div>
        <div style="padding: 14px;">
          <span class="title_art">{{item.title}}</span>
          <div class="bottom clearfix">
            <time class="time">
              作者：{{ item.nickname }}
              <br />
              收藏时间：{{ item.createtime }}
              <br />
            </time>
            <br />
            <div style="margin-top:5px">
              <el-button type="info" @click="showDetail(item)" size="mini">查看</el-button>
              <el-button type="danger" @click="deleteVideo(item)" size="mini">删除</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

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
      :hide-on-single-page="true"
    ></el-pagination>
  </div>
</template>

<script>
import { VideoRemoveCollect } from "../../api/video_info_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { PageConfig } from "../../utils/tools";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg
} from "../../utils/util";
export default {
  name: "CollectVideo",
  data() {
    return {
      articlePageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      PageConfig,
      list: [],
      articleLoading: false
    };
  },
  created() {
    this.VideoGetCollectList({
      ...this.PageConfig,
      userid: this.userid,
      type: "1"
    });
  },
  mounted() {
    this.formatVideoList();
  },
  methods: {
    ...mapActions(["GetVideoListByUser", "VideoGetCollectList"]),
    deleteVideo(data) {
      this.$confirm("确定取消收藏吗？")
        .then(res => {
          VideoRemoveCollect({ _id: data._id })
            .then(res => {
              if (res && res.code == "200") {
                this.$message.success("取消收藏成功");
                this.VideoGetCollectList({
                  ...this.PageConfig,
                  userid: this.userid,
                  type: "1"
                });
              } else {
                this.$message.error("出现错误，请稍候再试");
              }
            })
            .catch(err => {
              
              this.$message.error("出现错误，请稍候再试");
            });
        })
        .catch(err => {
          return;
        });
    },
    showDetail(data) {
      this.$router.push({
        path: "/video_detail",
        query: { videoid: data.videoid }
      });
    },
    formatVideoList() {
      this.articleLoading = true;
      let list = (this.videoCollectList && this.videoCollectList.data) || [];
      this.PageConfig.total =
        (this.videoCollectList && this.videoCollectList.total) || 0;
      this.list = [];
      list.map(i => {
        i.imgurl =
          (i.videoUser && i.videoUser[0] && i.videoUser[0].firsturl) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        i.nickname = (i.collectUser[0] && i.collectUser[0].nickname) || "";
        this.list.push(i);
      });
      
      this.articleLoading = false;
    },
    handleSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.articlePageConfig.page_no - 1
      };
      this.VideoGetCollectList({ ...PageConfig, userid: this.userid });
    },
    handleCurrentChange(val) {
      let PageConfig = {
        page_size: this.articlePageConfig.page_size,
        page_no: val - 1
      };
      this.VideoGetCollectList({ ...PageConfig, userid: this.userid });
    }
  },
  watch: {
    videoCollectList: {
      handler(newval, old) {
        
        this.formatVideoList();
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList,
      articleList: state => state.articleList,
      newVideoList: state => state.newVideoList,
      videoCollectList: state => state.videoCollectList
    })
  }
};
</script>
<style scoped>
.demo {
  text-align: center;
  width: 100%;
  height: 100％;
  z-index: 999;
}
.demo:hover {
  border-top: 40px solid rgba(17, 2, 2, 0.5);
  color: #fff;
  transition: all 0.5s;
}

.no_data {
  width: 100%;
  height: 180px;
  font-size: 28px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
}
.title_art {
  font-size: 14px;
  color: #3a3a3a;
  height: 50px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card {
  margin: 10px;
  width: 21%;
}

.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 10px;
  line-height: 18px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 200px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.my_article {
  display: flex;
  /* justify-content: space-around; */
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
