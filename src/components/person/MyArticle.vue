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
              分类:{{item.sortname}}
            </time>
            <br />
            <div style="margin-top:5px">
              <el-button type="info" @click="showDetail(item)" size="mini">查看</el-button>
              <el-button type="danger" @click="deleteArticle(item)" size="mini">删除</el-button>
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
import { mapState, mapMutations, mapActions } from "vuex";
import { GetArticleListByUser, DeleteArticle } from "../../api/article_api";
import { PageConfig } from "../../utils/tools";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg
} from "../../utils/util";
export default {
  name: "MyArticle",
  data() {
    return {
      articlePageConfig: {
        page_size: 8,
        page_no: 1,
        total: 0
      },
      PageConfig,
      list: [],
      articleLoading:false
    };
  },
  created() {
    if (this.userid) {
      this.GetArticleListByUser({ ...this.PageConfig, userid: this.userid });
    }
  },
  mounted() {
    this.formatArticleList();
  },
  methods: {
    ...mapActions(["GetArticleListByUser","GetAllArticleList"]),
    updateArticle(data) {
      this.$router.push({
        path: "/person/update_article",
        query: { articleid: data._id }
      });
    },
    deleteArticle(data) {
      this.$confirm("确定删除该文章”" + data.title + "“吗？")
        .then(_ => {
          DeleteArticle({ _id: data._id })
            .then(res => {
              console.log(res);
              this.$message.success("删除成功");
              this.GetArticleListByUser({
                ...this.PageConfig,
                userid: this.userid
              });
            })
            .catch(err => {
              console.log(err);
              this.$message.error("删除失败，请稍候再试");
            });
        })
        .catch(_ => {});
    },
    showDetail(data) {
      this.$router.push({
        path: "/article_detail",
        query: { articleid: data._id }
      });
    },
    formatArticleList() {
      this.articleLoading = true;
      let list = (this.articleList && this.articleList.data) || [];
      this.PageConfig.total = (this.articleList && this.articleList.total) || 0;
      this.list = [];
      list.map(i => {
        i.imgurl =
          getFirstPic(i.article) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        i.nickname = (i.articleUser[0] && i.articleUser[0].nickname) || "";
        i.sortname = i.articleSort[0].sortname || "";
        this.list.push(i);
      });
      console.log(this.list);
      this.articleLoading = false;
    },
    handleSizeChange(val) {
      let PageConfig = {
        page_size: val,
        page_no: this.articlePageConfig.page_no - 1
      };
      this.GetArticleListByUser({ ...PageConfig, userid: this.userid });
    },
    handleCurrentChange(val) {
      let PageConfig = {
        page_size: this.articlePageConfig.page_size,
        page_no: val - 1
      };
      this.GetArticleListByUser({ ...PageConfig, userid: this.userid });
    }
  },
  watch: {
    articleList: {
      handler(newval, old) {
        console.log(newval);
        this.formatArticleList();
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
      newVideoList: state => state.newVideoList
    })
  }
};
</script>
<style scoped>
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
  line-height: 12px;
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
