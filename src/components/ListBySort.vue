<template>
  <div>
    <el-row class>
      <el-col class :span="16" :offset="4">
        <el-breadcrumb style="margin-top:20px;margin-left:10px" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{sortname}}</el-breadcrumb-item>
        </el-breadcrumb>
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
  </div>
</template>

<script>
import { GetArticleListByUser } from "../api/article_api";
import { GetVideoListByUser } from "../api/video_api";
import { getFirstPic, dateTimeStamp, formatDateTime } from "../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
import ContentList from "../components/ContentList";
import { PageConfig } from "../utils/tools";
export default {
  name: "ListBySort",
  data() {
    return {
      sortid: "",
      sortname:'',
      videoTitle: "视频区",
      articleTitle: "资讯&文章区",
      articleList: [],
      videoList: [],
      PageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      VideoPageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      videoListBysort: [],
      articleListBysort: []
    };
  },
  created() {
    this.sortid = this.$route.query.sortid;
    this.sortname = this.$route.query.sortname;
  },
  mounted() {
    this.getArticleList(this.PageConfig);
    this.getVideoList(this.VideoPageConfig);
  },
  methods: {
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    getArticleList(PageConfig) {
        
      let ArticlePageConfig = {
        ...PageConfig,
        page_no: PageConfig.page_no - 1
      };
      GetArticleListByUser({ ...ArticlePageConfig, sortid: this.sortid })
        .then(res => {
          
          this.articleListBysort = res.data;
          this.formatArticleList();
        })
        .catch(err => {
          
        });
    },
    getVideoList(PageConfig) {
      let VideoPageConfig = {
        ...PageConfig,
        page_no: PageConfig.page_no - 1
      };
      GetVideoListByUser({ ...VideoPageConfig, sortid: this.sortid })
        .then(res => {
          
          this.videoListBysort = res.data;
          this.formatVideoList();
        })
        .catch(err => {
          
        });
    },
    //格式化文章列表
    formatArticleList() {
      let list = (this.articleListBysort && this.articleListBysort.data) || [];
      this.PageConfig.total =
        (this.articleListBysort && this.articleListBysort.total) || 0;
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
      
    },
    //格式化视频列表
    formatVideoList() {
      let list = (this.videoListBysort && this.videoListBysort.data) || [];
      this.VideoPageConfig.total =
        (this.videoListBysort && this.videoListBysort.total) || 0;

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
        page_no: this.PageConfig.page_no
      };
      this.getArticleList(PageConfig);
    },
    handleCurrentChange(val) {
    let PageConfig = {
        page_size: this.PageConfig.page_size,
        page_no: val
      };
      this.getArticleList(PageConfig);
    },
    handleVideoSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.VideoPageConfig.page_no
      };
      this.getVideoList(PageConfig);
    },
    handleVideoCurrentChange(val) {
      let PageConfig = {
        page_size: this.VideoPageConfig.page_size,
        page_no: val
      };
      this.getVideoList(PageConfig);
    }
  },
  components: { ContentList },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo
    })
  },
  watch: {
    articleListBysort: {
      handler(newval, old) {
        
        this.formatArticleList();
      },
      deep: true
    },
    videoListBysort: {
      handler(newval, old) {
        
        this.formatVideoList();
      },
      deep: true
    }
  }
};
</script>
<style>
</style>
