<template>
  <div class>
    <el-row class="box">
      <el-col class :span="16" :offset="4">
        <el-carousel :loading="imgLoading" height="450px" class="img_card">
          <el-carousel-item v-for="(item,index) in imgList" :key="index">
            <img
              title="点击查看详情"
              :src="item && item.imgurl ||''"
              width="100%"
              height="500px"
              alt
              srcset
              @click="goRotationImgDetail(item)"
            />
            <div class="img_title">{{ item && item.imgtitle ||'' }}</div>
          </el-carousel-item>
        </el-carousel>
        <div :loading="sortLoading" class="sort_card">
          <el-card
            @click.native="goListBySort(item)"
            class="sort"
            v-for="(item,index) in sortList"
            :key="index"
            shadow="hover"
          >{{item.sortname}}</el-card>
        </div>
        <div class="match_and_announcement">
          <div class="announcement">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <div style="text-align:center">公告</div>
              </div>
              <div class="announcement_item">
                <div
                  class="ano_text"
                  @click="goRotationImgDetail(item)"
                  v-for="(item,index) in announcementList"
                  :key="index"
                >{{item.imgtitle}}</div>
              </div>
            </el-card>
          </div>
          <div style="width: 100%;">
            <el-card shadow="never" class="box-card">
              <div slot="header" class="clearfix">
                <span>活动</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  @click="showMoreMatchList"
                  type="text"
                >查看更多>>></el-button>
              </div>
              <div class="my_activity">
                <el-card
                  class="activity_card"
                  v-for="(item, index) in matchList"
                  :key="index"
                  :body-style="{ padding: '0px' }"
                >
                  <div
                    @click="showMatchDetail(item)"
                    :style="{ background: 'url('+item.imgurl+') no-repeat center center', backgroundSize: '100% 100%',width:'100%',height:'200px'}"
                  >
                    <div class="demo"></div>
                    <span class="match_title">{{item.title}}</span>
                  </div>
                </el-card>
              </div>
            </el-card>
          </div>
        </div>
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
          :current-page="PageConfig.page_no"
          :page-sizes="[8, 16, 32, 64]"
          :page-size="PageConfig.page_size"
          layout="total,sizes, prev, pager, next"
          :total="PageConfig.total"
        ></el-pagination>
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
        <el-card shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 20px;font-weight:800;">聊天室</span>
            <div class="chat_box">
              <div class="my_activity">
                <el-card
                  class="activity_card"
                  v-for="(item, index) in roomList"
                  :key="index"
                  :body-style="{ padding: '0px' }"
                >
                  <div
                    :style="{ background: 'url('+item.imgurl+') no-repeat center center', backgroundSize: '100% 100%',width:'100%',height:'200px'}"
                  >
                    <div class="room_title">{{item.title || ''}}</div>
                    <div class="demo"></div>
                    <div style="text-align:center">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'房间介绍：'+item.introduce"
                        placement="right-start"
                      >
                        <a
                          :href="'http://localhost:8080/#/chat_room?roomid='+item._id+'&imgurl='+item.imgurl+'&roomname='+item.title"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <el-button type="danger" size="small">进入房间</el-button>
                        </a>
                      </el-tooltip>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
      articleLoading: false,
      videoLoading: false,
      sortLoading: false,
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
    showMoreMatchList() {
      this.$router.push({
        path: "/activity_list"
      });
    },
    showMatchDetail(data) {
      this.$router.push({
        path: "/activity_detail",
        query: { matchid: data._id }
      });
    },
    goListBySort(data) {
      console.log(data);
      this.$router.push({
        path: "/list_by_sort",
        query: { sortid: data._id, sortname: data.sortname }
      });
    },
    goRotationImgDetail(data) {
      console.log(data);
      this.$router.push({
        path: "/rotation_img_detail",
        query: { imgid: data._id }
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
      this.sortLoading = true;
      this.sortList = this.danceSortList || [];
      console.log(this.sortList);
      this.sortLoading = true;
    },
    //格式化文章列表
    formatArticleList() {
      this.articleLoading = true;
      let list = (this.newArticleList && this.newArticleList.data) || [];
      this.PageConfig.total =
        (this.newArticleList && this.newArticleList.total) || 0;
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
      this.articleLoading = false;
    },
    //格式化视频列表
    formatVideoList() {
      this.videoLoading = true;
      let list = (this.newVideoList && this.newVideoList.data) || [];
      this.VideoPageConfig.total =
        (this.newVideoList && this.newVideoList.total) || 0;
      this.videoList = [];
      list.map(i => {
        i.imgurl = i.firsturl || "";
        i.title = i.videotitle || "";
        i.nickname = i.videoUser[0].nickname || "";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        i.sortname = i.videoSort[0].sortname || "";
        this.videoList.push(i);
      });
      this.videoLoading = true;
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
      rotationImgList: state => state.rotationImgList,
      announcementList: state => state.announcementList,
      matchList: state => state.matchList,
      roomList: state => state.roomList
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
  width: 23%;
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
.chat_box {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #ebeef5;
  background: #fff;
  border-radius: 5px;
  box-shadow: 1px 1px 1px rgb(212, 212, 212);
}
.btn_chat {
  background: #fff;
  padding: 9px 15px;
}
.btn_chat:hover {
  background: #fff;
  padding: 9px 15px;
}
.room_title {
  float: left;
  color: #fff;
  padding: 10px;
}
</style>
