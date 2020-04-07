<template>
  <div>
    <el-row class>
      <el-col class="article" :span="16" :offset="4">
        <el-breadcrumb
          style="margin-top:20px;margin-left:10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">活动列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div :loading="activityLoading" class="my_activity">
          <el-card
            class="card"
            v-for="(item, index) in matchList"
            :key="index"
            :body-style="{ padding: '0px' }"
          >
            <div
              @click="showDetail(item)"
              :style="{ background: 'url('+item.imgurl+') no-repeat center center', backgroundSize: '100% 100%',width:'100%',height:'200px'}"
            >
              <div class="demo"></div>
              <span class="match_title">{{item.title}}</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { GetAllMatchList, DeleteMatch } from "../api/match_api";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg
} from "../utils/util";
export default {
  name: "ActivityList",
  data() {
    return {
      list: [],
      activityLoading: false,
      activityList: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(["GetAllRotationImgList", "GetAllMatchList"]),
    showDetail(data) {
      this.$router.push({
        path: "/activity_detail",
        query: { matchid: data._id }
      });
    }
  },
  watch: {},
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
      danceSortList: state => state.danceSortList,
      newVideoList: state => state.newVideoList,
      matchList: state => state.matchList
    })
  }
};
</script>
<style scoped>
.demo {
  text-align: center;
  width: 100%;
  height: 150px;
  z-index: 999;
  border-top: 50px solid rgba(17, 2, 2, 0.5);
}
.card:hover .demo {
  border-top: 0px solid rgba(17, 2, 2, 0.5);
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
.my_activity {
  padding: 20px;
  display: flex;
  /* justify-content: space-around; */
  flex-direction: row;
  flex-wrap: wrap;
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
