<template>
  <div>
    <el-row class>
      <el-col style="background:#fff" class="article" :span="12" :offset="4">
        <el-breadcrumb
          style="margin-top:20px;margin-left:10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">资讯&文章区</el-breadcrumb-item>
          <el-breadcrumb-item>文章详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="article_header">
          <h1>{{articleInfo.title}}</h1>
          <div class="article_info_user">
            <div>
              <i class="el-icon-user-solid"></i>
              作者:{{articleInfo.articleUser && articleInfo.articleUser[0].nickname ||''}}
              <i
                class="el-icon-timer"
              ></i>
              发布时间:{{articleInfo.createtime}}
            </div>
            <div>
              <i class="el-icon-chat-dot-square"></i>
              评论数:{{articleInfo.commentscount}}
              <i class="el-icon-view"></i>
              浏览量:{{articleInfo.lookscount}}
              <i class="el-icon-thumb"></i>
              点赞数:{{articleInfo.goodscount}}
            </div>
          </div>
        </div>
        <div  class="article_info">
          <div v-html="articleInfo.article"></div>
        </div>
        <div class="article_bottom">
          <div>
            <i class="el-icon-collection-tag" style="font-size:26px"></i>
            <el-tooltip class="item" effect="dark" content="文章分类" placement="right-start">
              <span
                @click="goListBySort"
              >{{articleInfo.articleSort && articleInfo.articleSort[0].sortname}}</span>
            </el-tooltip>
          </div>
          <div>
            <el-button
              @click="collectArticle"
              type="danger"
              :icon="collectStatus ? 'el-icon-star-on':'el-icon-star-off'"
              plain
            >{{collectStatus ? '已收藏':'收藏'}}</el-button>
          </div>
        </div>
        <div class="comment">
          <div v-loading="loading" class="comment_header">评论</div>
          <div class="top_model_top">
            <el-input style="width:50%" placeholder="请输入内容" v-model="commentInfo">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button
              type="primary"
              icon="el-icon-position"
              @click="addComment"
              class="search_btn"
              size="big"
            >发表</el-button>
          </div>
          <div>
            <div class="comment_box" v-for="(item,index) in firstCommentList">
              <div class="user_comment">
                <el-avatar
                  :src="item.fromUser[0].imgurl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                ></el-avatar>
                {{item.fromUser[0].nickname}} &nbsp;
                <span
                  style="font-size:12px;#999;margin-left:10px"
                >{{item.createtime}}</span>
              </div>
              <div class="comment_info">
                <p style="color:#4d4d4d;font-size:14px">{{item.commentinfo}}</p>
                <div>
                  <el-button
                    type="info"
                    class="no_btn"
                    size="mini"
                    @click="showComment(item,index)"
                  >查看回复({{item.childList && item.childList.length||0}})</el-button>
                  <el-button
                    type="primary"
                    class="no_btn"
                    @click="showAddComment(index)"
                    icon="el-icon-chat-dot-square"
                    size="mini"
                  >回复</el-button>
                </div>
              </div>
              <div
                v-if="item.showChild"
                style="padding:0 20px"
                class="comment_box"
                v-for="(itemchild,indexchild) in item.childList"
              >
                <div class="user_comment">
                  <el-avatar
                    :src="itemchild.fromUser[0].imgurl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                  ></el-avatar>
                  <span style="font-size:14px">
                    {{itemchild.fromUser[0].nickname}} &nbsp;
                    <span
                      style="font-size:12px;#999;margin-left:10px"
                    >{{itemchild.createtime}}</span>
                  </span>
                </div>
                <div class="comment_info">
                  <p style="color:#4d4d4d;font-size:12px">{{itemchild.commentinfo}}</p>
                </div>
              </div>
              <div v-if="item.addShow" class="top_model_top">
                <el-input style="width:50%;" placeholder="请输入回复内容" v-model="secondCommentInfo">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button
                  slot="reference"
                  type="primary"
                  icon="el-icon-position"
                  class="search_btn"
                  size="big"
                  @click="addSecondComment(item,index)"
                >发表</el-button>
              </div>
            </div>
          </div>
        </div>
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
import {
  ArticleAddGoods,
  ArticleRemoveGoods,
  ArticleGetGoodsStatus,
  ArticleAddCollect,
  ArticleRemoveCollect,
  ArticleAddComments,
  ArticleSelectComments,
  SelectSecondComments,
  AddSecondComments,
  GetCounts
} from "../api/article_info_api";
import { PageConfig } from "../utils/tools";
export default {
  name: "ArticleDetail",
  data() {
    return {
      loading: false,
      collectStatus: false,
      articleid: "",
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
    this.articleid = this.$route.query.articleid;
    this.ArticleGetCollectList({
      ...this.PageConfig,
      userid: this.userid,
      type: "1"
    });
  },
  mounted() {
    this.getArticleInfo();
    this.formatArticleList();
    this.getCommentsList();
    this.addArticleLook();
    this.getCollectstatus();
  },
  methods: {
    ...mapActions(["ArticleGetCollectList", "VideoGetCollectList"]),
    //获取收藏状态
    getCollectstatus() {
      console.log(this.articleCollectList);
      this.collectStatus = false;
      this.articleCollectList &&
        this.articleCollectList.data &&
        this.articleCollectList.data.map(i => {
          if (i.articleid == this.articleid) {
            this.collectStatus = true;
            this.collectId = i._id;
          }
        });
    },
    //收藏文章
    collectArticle() {
      if (this.userid == 0) {
        this.$message.error("请登录");
        return;
      }
      if (this.collectStatus) {
        this.$confirm("确定取消收藏吗？")
          .then(res => {
            ArticleRemoveCollect({ _id: this.collectId })
              .then(res => {
                if (res && res.code == "200") {
                  this.$message.success("取消收藏成功");
                  this.collectStatus = true;
                  this.ArticleGetCollectList({
                    ...this.PageConfig,
                    userid: this.userid,
                    type: "1"
                  });
                } else {
                  this.$message.error("出现错误，请稍候再试");
                }
              })
              .catch(err => {
                console.log(err);
                this.$message.error("出现错误，请稍候再试");
              });
          })
          .catch(err => {
            return;
          });
      } else {
        ArticleAddCollect({
          userid: this.userid,
          articleid: this.articleid,
          type: "1"
        })
          .then(res => {
            console.log(res);
            if (res && res.code == "200") {
              this.$message.success("收藏成功");
              this.collectStatus = true;
              this.collectId = res.data._id;
              this.ArticleGetCollectList({
                ...this.PageConfig,
                userid: this.userid,
                type: "1"
              });
            } else {
              this.$message.error("出现错误，请稍候再试");
            }
          })
          .catch(err => {
            console.log(err);
            this.$message.error("出现错误，请稍候再试");
          });
      }
    },
    //浏览量加一
    addArticleLook() {
      console.log(this.articleInfo.lookscount);
      if (this.articleInfo.lookscount) {
        AddArticleLook({
          _id: this.articleid,
          lookscount: +this.articleInfo.lookscount
        })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // this.addArticleLook()
      }
    },
    //更新点赞收藏评论数
    getCounts() {
      GetCounts({ articleid: this.articleid })
        .then(res => {
          console.log(res);
          if (res) {
            this.getArticleInfo();
          } else {
            this.getCounts();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showAddComment(index) {
      this.loading = true;
      this.firstCommentList.map((i, j) => {
        i.addShow = false;
        if (j == index) {
          i.addShow = true;
        }
      });
      this.secondCommentInfo = "";
      this.loading = false;
    },
    showComment(data, index) {
      this.loading = true;
      this.firstCommentList.map((i, j) => {
        i.showChild = false;
        if (j == index) {
          i.showChild = true;
        }
      });
      this.secondCommentInfo = "";
      this.loading = false;
    },
    addComment(data) {
      if (this.userid == 0) {
        this.$message.error("请登录");
        return;
      }
      if (this.commentInfo === "") {
        this.$message.error("请输入评论");
        return;
      }
      ArticleAddComments({
        articleid: this.articleid,
        from: this.userid,
        to: this.articleInfo.userid,
        commentinfo: this.commentInfo,
        parentid: "0",
        type: "2"
      })
        .then(res => {
          console.log(res);
          this.commentInfo = "";
          this.getCommentsList();
          this.getCounts();
        })
        .catch(err => {
          console.log(err);
        });
    },
    addSecondComment(data, index) {
      if (this.userid == 0) {
        this.$message.error("请登录");
        return;
      }
      if (this.secondCommentInfo === "") {
        this.$message.error("请输入评论");
        return;
      }
      AddSecondComments({
        articleid: this.articleid,
        from: this.userid,
        to: this.articleInfo.userid,
        commentinfo: this.secondCommentInfo,
        parentid: data._id
      })
        .then(res => {
          console.log(res);
          this.secondCommentInfo = "";
          this.firstCommentList[index].addShow = false;
          this.getCommentsList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取评论列表
    getCommentsList() {
      ArticleSelectComments({
        type: "2",
        articleid: this.articleid,
        ...PageConfig
      })
        .then(res => {
          console.log(res);
          if (res) {
            this.firstCommentList = (res && res.data.data) || [];
            SelectSecondComments({
              articleid: this.articleid
            })
              .then(res => {
                console.log(res);
                this.secondCommentList = (res && res.data) || [];
                this.formatComment();
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.getCommentsList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //格式化评论列表
    formatComment() {
      this.loading = true;
      this.firstCommentList &&
        this.firstCommentList.map(i => {
          i.childList = [];
          i.addShow = false;
          i.showChild = false;
          let timestamp = new Date();
          let time = timestamp.getTime() - dateTimeStamp(i.createtime);
          if (time < 3600000) {
            i.createtime = Math.round(time / 1000 / 60) + "分钟前";
          } else if (time >= 3600000 && time < 86400000) {
            i.createtime = Math.round(time / 1000 / 60 / 60) + "小时前";
          } else if (time >= 86400000) {
            i.createtime = Math.round(time / 1000 / 60 / 60 / 24) + "天前";
          }
          this.secondCommentList &&
            this.secondCommentList.map(j => {
              let timestamp = new Date();
              let time = timestamp.getTime() - dateTimeStamp(j.createtime);
              if (time < 3600000) {
                j.createtime = Math.round(time / 1000 / 60) + "分钟前";
              } else if (time >= 3600000 && time < 86400000) {
                j.createtime = Math.round(time / 1000 / 60 / 60) + "小时前";
              } else if (time >= 86400000) {
                j.createtime = Math.round(time / 1000 / 60 / 60 / 24) + "天前";
              }
              if (i._id == j.parentid) {
                i.childList.push(j);
              }
            });
        });
      this.loading = false;
      console.log(this.firstCommentList);
    },
    getArticleInfo() {
      GetArticleInfoById({ _id: this.articleid })
        .then(res => {
          console.log(res);
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
          console.log(err);
        });
    },
    showDetail(data) {
      console.log(data);
      this.articleid = data._id;
      // this.$router.push({
      //   path: "/article_detail",
      //   query: { articleid: data._id}
      // });
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
      console.log(this.articleList);
    },
    goListBySort(data) {
      console.log(data);
      this.$router.push({
        path: "/list_by_sort",
        query: {
          sortid: this.articleInfo.sortid,
          sortname: this.articleInfo.articleSort[0].sortname
        }
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
      articleCollectList: state => state.articleCollectList
    })
  },
  watch: {
    articleCollectList: {
      handler(newval, old) {
        this.getCollectstatus();
      },
      deep: true
    },
    newArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true
    },
    articleInfo: {
      handler(newval, old) {
        this.addArticleLook();
      },
      deep: true
    },
    articleid: {
      handler(newval, old) {
        this.getArticleInfo();
        this.getCommentsList();
        this.getCollectstatus();
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
