<template>
  <div class>
    <el-row class>
      <el-col class :span="16" :offset="4">
        <el-carousel height="450px" class="img_card">
          <el-carousel-item v-for="(item,index) in imgList" :key="index">
            <img
              title="点击查看详情"
              :src="item && item.imgurl ||''"
              width="100%"
              height="500px"
              alt
              srcset
            />
            <div class="img_title">{{ item && item.imgtitle ||'' }}</div>
          </el-carousel-item>
        </el-carousel>
        <div class="sort_card">
          <el-card
            @click.native="goListBySort(item)"
            class="sort"
            v-for="(item,index) in sortList"
            :key="index"
            shadow="hover"
          >{{item.sortname}}</el-card>
        </div>
        <content-list style="margin-top:35px" :type="'article'" :title="articleTitle" :list="articleList"></content-list>
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
        <content-list style="margin-top:50px" :type="'video'" :title="videoTitle" :list="videoList"></content-list>
        <el-pagination
          style="margin:15px"
          background
          @size-change="handleVideoSizeChange"
          @current-change="handleVideoCurrentChange"
          :current-page="VideoPageConfig.page_no"
          :page-sizes="[8, 16, 32, 64]"
          :page-size="VideoPageConfig.page_size"
          layout="total,sizes, prev, pager, next"
          :total="VideoPageConfig.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <div id="box_video" style="display:none"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ContentList from "../components/ContentList";
// import {PageConfig} from '../utils/tools'
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg
} from "../utils/util";
export default {
  name: "Main",
  data() {
    return {
      sortList: [],
      imgLoading: false,
      videoTitle: "视频区",
      articleTitle: "资讯&文章区",
      articleList: [],
      videoList: [],
      imgList: [],
      isHidden: true,
      PageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      VideoPageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      }
    };
  },
  mounted() {
    this.setImgList();
    this.formatArticleList();
    this.formatVideoList();
    this.setSortList();
  },

  methods: {
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    //
    goListBySort(data) {
      console.log(data);
      this.$router.push({
        path: "/list_by_sort",
        query: { sortid: data._id, sortname: data.sortname }
      });
    },
    //设置轮播图列表
    setImgList() {
      this.imgLoading = true;
      this.imgList = this.rotationImgList || [];
      console.log(this.imgList);
      this.imgLoading = false;
    },
    //设置分类
    setSortList() {
      this.sortList = this.danceSortList || [];
      console.log(this.sortList);
    },
    //格式化文章列表
    formatArticleList() {
      let list = (this.newArticleList && this.newArticleList.data) || [];
      this.PageConfig.total =
        (this.newArticleList && this.newArticleList.total) || 0;
      this.articleList = [];
      list.map(i => {
        i.imgurl =
          getFirstPic(i.article) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        i.nickname = i.articleUser[0]&& i.articleUser[0].nickname || "";
        i.sortname = i.articleSort[0].sortname || "";
        this.articleList.push(i);
      });
      console.log(this.articleList);
    },
    //格式化视频列表
    formatVideoList() {
      let list = this.newVideoList && this.newVideoList.data || [];
      this.VideoPageConfig.total =
        (this.newVideoList && this.newVideoList.total) || 0;
      this.videoList = [];
      list.map(i => {
        i.imgurl = i.firsturl || "";
        i.title = i.videotitle || "";
        i.nickname = i.videoUser[0].nickname || "";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        i.sortname = i.videoSort[0].sortname || "";
        this.videoList.push(i)
      });
    },
    handleSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.PageConfig.page_no - 1
      };
      this.GetAllArticleList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        page_size: this.PageConfig.page_size,
        page_no: val - 1
      };
      this.GetAllArticleList(PageConfig);
    },
    handleVideoSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.VideoPageConfig.page_no - 1
      };
      this.GetAllArticleList(PageConfig);
    },
    handleVideoCurrentChange(val) {
      let PageConfig = {
        page_size: this.VideoPageConfig.page_size,
        page_no: val - 1
      };
      this.GetAllArticleList(PageConfig);
    }
  },
  components: { ContentList },
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
      rotationImgList: state => state.rotationImgList
    })
  },
  watch: {
    rotationImgList: {
      handler(newval, old) {
        console.log(newval);
        this.setImgList();
      },
      deep: true
    },
    danceSortList: {
      handler(newval, old) {
        console.log(newval);
        this.setSortList();
      },
      deep: true
    },
    newArticleList: {
      handler(newval, old) {
        console.log(newval);
        this.formatArticleList();
      },
      deep: true
    },
    newVideoList: {
      handler(newval, old) {
        console.log(newval);
        this.formatVideoList();
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.sort_card {
  cursor: pointer;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.sort {
  margin: 5px;
  flex: 1;
  background: #3e3c3a;
  text-align: center;
  color: #fff;
  margin-top: 5px;
}
.sort:hover {
  background: #fff;
  color: #3e3c3a;
  transition: 0.5s;
}
.img_card {
  height: 500px;
  margin-top: 35px;
  padding: 0 15px;
}
.img_title {
  position: absolute;
  bottom: 5px;
  right: 100px;
  width: 475px;
  height: 190px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 20;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
