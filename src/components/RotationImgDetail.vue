<template>
  <div>
    <el-row class>
      <el-col style="background:#fff" :loading="loading" class="img" :span="12" :offset="4">
        <el-breadcrumb
          style="margin-top:20px;margin-left:10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ path: '/' }"
          >{{imgInfo.status && imgInfo.status=='3'?'公告' :'活动＆文章'}}</el-breadcrumb-item>
          <el-breadcrumb-item>内容详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="img_header">
          <h1>{{imgInfo.imgtitle}}</h1>
          <div class="img_info_user">
            <div>
              <i class="el-icon-user-solid"></i>
              作者:{{imgInfo.imgUser &&imgInfo.imgUser[0] && imgInfo.imgUser[0].nickname ||''}}
              <i
                class="el-icon-timer"
              ></i>
              发布时间:{{imgInfo.createtime}}
            </div>
            <div>
              <i class="el-icon-star-on"></i>
              浏览量:{{lookscount}}
            </div>
          </div>
          <div class="img_info">
            <div v-html="imgInfo.introduce"></div>
          </div>
          <div class="img_bottom">
            <i class="el-icon-collection-tag" style="font-size:26px"></i>
            <el-tooltip class="item" effect="dark" content="文章分类" placement="right-start">
              <span>{{imgInfo.status && imgInfo.status=='3'?'公告' :'活动＆文章'}}</span>
            </el-tooltip>
          </div>
        </div>
      </el-col>
      <el-col class :span="4">
        <div class="new_img">
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
                    发布者：{{ item && item.nickname ||'' }}
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
import { GetRotationImgListByInfo } from "../api/rotatin_img_api";
import { mapState, mapMutations, mapActions } from "vuex";
import {
  dateTimeStamp,
  formatDateTime,
  getFirstPic,
  setImgSize
} from "../utils/util";
import { PageConfig } from "../utils/tools";
export default {
  name: "RotationImgDetail",
  data() {
    return {
      loading: false,
      imgid: "",
      lookscount: 58,
      articleList: [],
      imgInfo: {},
      PageConfig,
      commentInfo: "",
      secondCommentInfo: "",
      firstCommentList: [],
      secondCommentList: []
    };
  },
  created() {
    this.imgid = this.$route.query.imgid;
  },
  mounted() {
    this.getImgInfo("look");
    this.formatArticleList();
  },
  methods: {
    getImgInfo(type) {
      this.loading = true;

      GetRotationImgListByInfo({ _id: this.imgid })
        .then(res => {
          
          if (res) {
            this.imgInfo = (res && res.data[0]) || {};
            this.imgInfo.createtime = formatDateTime(
              dateTimeStamp(this.imgInfo.createtime)
            );
            this.imgInfo.introduce = setImgSize(
              this.imgInfo.introduce,
              600,
              350
            );
            this.loading = false;
          } else {
            this.getImgInfo();
          }
        })
        .catch(err => {
          this.loading = false;
          
        });
    },
    showDetail(data) {
      
      this.$router.push({
        path: "/article_detail",
        query: { articleid: data._id }
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
      imgResult: state => state.imgResult,
      rotationImgList: state => state.rotationImgList
    })
  },
  watch: {
    newArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true
    },
    imgid: {
      handler(newval, old) {
        this.getImgInfo();
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
.img {
  padding: 20px;
}
h1 {
  text-align: center;
}
.img_header {
  padding: 10px;
  border-bottom: 1px solid rgb(7, 7, 7);
}
.img_info {
  padding: 20px 20px 50px 20px;
  /* border-bottom: 1px solid rgb(7, 7, 7); */
}
.img_info_user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: #999;
  font-size: 12px;
}
.img_bottom {
  padding: 20px;
  color: #999;
  font-size: 16px;
}
.img_bottom:hover {
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
