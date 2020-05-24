<template>
  <div>
    <el-row class>
      <el-col style="background:#fff" class="article" :span="12" :offset="4">
        <el-breadcrumb
          style="margin-top:20px;margin-left:10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="article_header">
          <h1>{{articleInfo.title}}</h1>
          <div class="article_info_user">
            <div>
              <i class="el-icon-user-solid"></i>
              作者:{{articleInfo.activityUser && articleInfo.activityUser[0].nickname ||''}}
              <i
                class="el-icon-timer"
              ></i>
              发布时间:{{articleInfo.createtime}}
            </div>
            <div>
              <i class="el-icon-view"></i>
              浏览量:{{articleInfo.lookscount}}
            </div>
          </div>
        </div>
        <div class="article_info">
          <h2>活动海报</h2>
          <img width="650px" height="800px" :src="articleInfo.imgurl" alt="暂无图片" />
        </div>
        <div class="article_bottom">
          <div>
            <i class="el-icon-collection-tag" style="font-size:26px"></i>
            <el-tooltip class="item" effect="dark" content="活动＆比赛" placement="right-start">
              <span @click="goListBySort">活动&比赛</span>
            </el-tooltip>
          </div>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label">
              <i class="el-icon-date"></i> 活动信息
            </span>
            <div class="video_info">
              <div v-html="articleInfo.article"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <i class="el-icon-s-home"></i> 活动地址
            </span>
            <div style="padding:20px">{{articleInfo.address}}</div>
            <div style="text-align:right">
              <a
                :href="addressUrl+articleInfo.address"
                target="_blank"
                rel="noopener noreferrer"
              >
                <el-button type="danger" size="small">查看地址详情</el-button>
              </a>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col class :span="4">
        <div class="new_article">
          <el-card shadow="never" class="box-card">
            <div slot="header" class="clearfix">
              <span>推荐文章</span>
            </div>
            <el-card
              class="card"
              v-for="(item, index) in articleList"
              :key="index"
              v-if="index<4"
              @click.native="showDetail(item)"
              :body-style="{ padding: '0px' }"
            >
              <div
                :style="{ background: 'url('+item.imgurl+') no-repeat center center', backgroundSize: '100% 100%',width:'100%',height:'200px'}"
              >
                <div class="demo"></div>
              </div>
              <div style="padding: 14px;">
                <span class="title_art">{{item.title}}</span>
                <div class="bottom clearfix">
                  <time class="time">
                    {{ item.createtime }}
                    <br />
                    发布者：{{ item.nickname }}
                  </time>
                </div>
              </div>
            </el-card>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  GetArticleListByUser,
  GetArticleInfoById,
  AddArticleLook
} from "../api/article_api";
import { mapState, mapMutations, mapActions } from "vuex";
import {
  dateTimeStamp,
  formatDateTime,
  getFirstPic,
  setImgSize
} from "../utils/util";
import { GetMarchInfoByInfo } from "../api/match_api";
import { PageConfig } from "../utils/tools";
export default {
  name: "ArticleDetail",
  data() {
    return {
      loading: false,
      collectStatus: false,
      matchid: "",
      addressUrl:'http://localhost:8080/#/address?address=',
      articleList: [],
      articleInfo: {},
      PageConfig,
      commentInfo: "",
      secondCommentInfo: "",
      firstCommentList: [],
      secondCommentList: [],
      collectId: ""
    };
  },
  created() {
    this.matchid = this.$route.query.matchid;
  },
  mounted() {
    this.getArticleInfo();
    this.formatArticleList();
  },
  methods: {
    ...mapActions(["ArticleGetCollectList", "VideoGetCollectList"]),
    // address() {
    //   this.$router.push({
    //     path: "/address",
    //     query: { address: this.articleInfo.address }
    //   });
    // },
    getArticleInfo() {
      GetMarchInfoByInfo({ _id: this.matchid })
        .then(res => {
          
          if (res) {
            this.articleInfo = (res && res.data[0]) || {};
            this.articleInfo.createtime = formatDateTime(
              dateTimeStamp(this.articleInfo.createtime)
            );
            this.articleInfo.article = setImgSize(
              this.articleInfo.article,
              600,
              350
            );
          } else {
            this.getArticleInfo();
          }
        })
        .catch(err => {
          
        });
    },
    showDetail(data) {
      
      // this.matchid = data._id;
      this.$router.push({
        path: "/article_detail",
        query: { matchid: data._id }
      });
    },
    //格式化推荐文章
    formatArticleList() {
      let list = (this.newArticleList && this.newArticleList.data) || [];
      this.articleList = [];
      list.map(i => {
        i.imgurl =
          getFirstPic(i.article) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        i.nickname = (i.articleUser[0] && i.articleUser[0].nickname) || "";
        i.sortname = i.articleSort[0].sortname || "";
        this.articleList.push(i);
      });
      
    },
    goListBySort(data) {
      
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
      articleCollectList: state => state.articleCollectList
    })
  },
  watch: {
    matchid: {
      handler(newval, old) {
        this.getArticleInfo();
      },
      deep: true
    },
    newArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.title_art {
  font-size: 14px;
  color: #3a3a3a;
  height: 50px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.article {
  padding: 20px;
}
h1 {
  text-align: center;
}
.article_header {
  padding: 10px;
  border-bottom: 1px solid rgb(7, 7, 7);
}
.article_info {
  padding: 20px 20px 50px 20px;
  /* border-bottom: 1px solid rgb(7, 7, 7); */
}
.article_info_user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: #999;
  font-size: 12px;
}
.article_bottom {
  padding: 20px;
  color: #999;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.article_bottom:hover {
  color: brown;
  transition: all 0.5s;
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
  margin: 20px;
  /* width: 20%; */
}
.time {
  font-size: 13px;
  color: #999;
}

.comment_header {
  padding: 20px;
  font-size: 26px;
  font-weight: 900;
  border-bottom: 1px solid #000;
}
.top_model_top {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 20px 0;
}
.search_btn {
  background: #3e3c3a;
  transition: all 1s;
}
.search_btn:hover {
  background: #e74141;
  border: solid #e74141 1px;
  transition: all 1s;
}
.user_comment {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment_info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.comment_box {
  border-bottom: solid #999 1px;
}
.demo {
  text-align: center;
  width: 100%;
  height: 160px;
  z-index: 999;
}
.demo:hover {
  border-top: 40px solid rgba(17, 2, 2, 0.5);
  color: #fff;
  transition: all 0.5s;
}
</style>
