<template>
  <div class>
    <el-row class>
      <el-col :loading="loading" class :span="16" :offset="4">
        <el-breadcrumb style="margin:20px 0;margin-left:10px" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>搜索结果</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label">
              <i class="el-icon-date"></i> 资讯&文章结果
            </span>
            <content-list
              :loading="articleLoading"
              style="margin-top:35px"
              :type="'article'"
              :title="articleTitle"
              :list="articleList"
            ></content-list>
            <el-pagination
              style="margin:15px"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="ArticlePageConfig.page_no"
              :page-sizes="[8, 16, 32, 64]"
              :page-size="ArticlePageConfig.page_size"
              layout="total,sizes, prev, pager, next"
              :total="ArticlePageConfig.total"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <i class="el-icon-s-home"></i> 视频结果
            </span>
            <content-list
              :loading="videoLoading"
              style="margin-top:50px"
              :type="'video'"
              :title="videoTitle"
              :list="videoList"
            ></content-list>
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
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ContentList from "../components/ContentList";
import { GetVideoResultList, GetArticleResultList } from "../api/search_api";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg
} from "../utils/util";
import { PageConfig } from "../utils/tools";
export default {
  name: "Main",
  data() {
    return {
      sortList: [],
      imgLoading: false,
      articleLoading: false,
      videoLoading: false,
      sortLoading: false,
      loading: false,
      videoTitle: "",
      articleTitle: "",
      articleList: [],
      videoList: [],
      imgList: [],
      isHidden: true,
      ArticlePageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      PageConfig,
      searchWord: "",
      VideoPageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      }
    };
  },
  created() {
    this.searchWord = this.$route.query.keyword;
  },
  mounted() {
    this.getSearch();
    this.formatArticleList();
    this.formatVideoList();
  },

  methods: {
    ...mapMutations(["changeVideoResult", "changeArticleResult", ""]),
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    getSearch() {
      this.loading = true;

      if (this.searchWord === "") {
        this.loading = false;
        this.$message.error("请输入要搜索的内容");
        return;
      } else {
        GetVideoResultList({ keyword: this.searchWord, ...PageConfig })
          .then(res => {
            
            this.changeVideoResult(res.data || []);
            this.loading = false;
          })
          .catch(err => {
            
          });
        GetArticleResultList({ keyword: this.searchWord, ...PageConfig })
          .then(res => {
            this.changeArticleResult(res.data || []);
            this.loading = false;
            
          })
          .catch(err => {
            
          });
      }
      this.$router.push("/search");
    },
    //格式化文章列表
    formatArticleList() {
      this.articleLoading = true;
      let list = (this.articleResult && this.articleResult.data) || [];
      this.ArticlePageConfig.total =
        (this.articleResult && this.articleResult.total) || 0;
      this.articleList = [];
      list.map(i => {
        i.imgurl =
          getFirstPic((i.article && i.article) || "") ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        this.articleList.push(i);
      });
      
      this.articleLoading = false;
    },
    //格式化视频列表
    formatVideoList() {
      this.videoLoading = true;
      
      let list = (this.videoResult && this.videoResult.data) || [];
      this.VideoPageConfig.total =
        (this.videoResult && this.videoResult.total) || 0;
      this.videoList = [];
      list.map(i => {
        i.imgurl = i.firsturl || "";
        i.title = i.videotitle || "";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        this.videoList.push(i);
      });
      this.videoLoading = true;
    },
    handleSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.ArticlePageConfig.page_no - 1
      };

      GetArticleResultList({ keyword: this.searchWord, ...PageConfig })
        .then(res => {
          this.changeArticleResult(res.data || []);
          this.formatArticleList();
          
        })
        .catch(err => {
          
        });
    },
    handleCurrentChange(val) {
      let PageConfig = {
        page_size: this.ArticlePageConfig.page_size,
        page_no: val - 1
      };
      GetArticleResultList({ keyword: this.searchWord, ...PageConfig })
        .then(res => {
          this.changeArticleResult(res.data || []);
          
          this.formatArticleList();
        })
        .catch(err => {
          
        });
    },
    handleVideoSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.VideoPageConfig.page_no - 1
      };
      GetVideoResultList({ keyword: this.searchWord, ...PageConfig })
        .then(res => {
          
          this.changeVideoResult(res.data || []);
          this, formatVideoList();
        })
        .catch(err => {
          
        });
    },
    handleVideoCurrentChange(val) {
      let PageConfig = {
        page_size: this.VideoPageConfig.page_size,
        page_no: val - 1
      };
      GetVideoResultList({ keyword: this.searchWord, ...PageConfig })
        .then(res => {
          
          this.changeVideoResult(res.data || []);
          this, formatVideoList();
        })
        .catch(err => {
          
        });
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
      rotationImgList: state => state.rotationImgList,
      announcementList: state => state.announcementList,
      matchList: state => state.matchList,
      keyword: state => state.keyword
    })
  },
  watch: {
    keyword: {
      handler(newval, old) {
        
        this.searchWord = newval;
      },
      deep: true
    },
    searchWord: {
      handler(newval, old) {
        
        this.getSearch();
      },
      deep: true
    },
    articleResult: {
      handler(newval, old) {
        
        this.formatArticleList();
      },
      deep: true
    },
    videoResult: {
      handler(newval, old) {
        
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
.match_and_announcement {
  padding: 5px;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}
.announcement {
  width: 32%;
}
.announcement_item {
  width: 100%;
  display: flex;
  padding: 5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #141414;
}
.ano_text {
  width: 100%;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
  color: #535251;
  white-space: nowrap;
}
.ano_text:hover {
  color: #1f1f1f;
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
.my_activity {
  width: 100%;
  display: flex;
  /* justify-content: space-around; */
  flex-direction: row;
  flex-wrap: wrap;
}
.activity_card {
  margin: 0 5px;
  width: 25%;
}
.demo {
  text-align: center;
  width: 100%;
  height: 150px;
  z-index: 999;
  border-top: 50px solid rgba(17, 2, 2, 0.5);
}
.activity_card:hover .demo {
  border-top: 0px solid rgba(17, 2, 2, 0.5);
  transition: all 0.5s;
}
.match_title {
  margin-top: 5px;
  display: flex;
  padding: 2px;
  white-space: nowrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
}
</style>
