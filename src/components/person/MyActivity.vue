<template>
  <div>
    <div :loading="activityLoading" class="my_activity">
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
          <div
            style="margin-top:5px;display:flex;flex-direction:row; justify-content: space-around;"
          >
            <el-button type="info" @click="showDetail(item)" size="mini">查看</el-button>
            <el-button type="danger" @click="deleteActivity(item)" size="mini">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { GetAllMatchList, DeleteMatch } from "../../api/match_api";
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
      list: [],
      activityLoading: false,
      activityList: []
    };
  },
  created() {
    this.getActivity();
  },
  mounted() {
    this.formatActivityList();
  },
  methods: {
    ...mapActions(["GetAllRotationImgList", "GetAllMatchList"]),
    //获取活动列表
    getActivity() {
      GetAllMatchList({ userid: this.userid })
        .then(res => {
          console.log(res);
          this.activityList = (res && res.data) || "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteActivity(data) {
      this.$confirm("确定删除该活动”" + data.title + "“吗？")
        .then(_ => {
          DeleteMatch({ _id: data._id })
            .then(res => {
              console.log(res);

              this.getActivity();
              this.GetAllMatchList();
              this.$message.success("删除成功");
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
        path: "/activity_detail",
        query: { matchid: data._id }
      });
    },
    formatActivityList() {
      this.activityLoading = true;
      let list = (this.activityList && this.activityList) || [];
      this.list = [];
      list.map(i => {
        i.createtime = formatDateTime(dateTimeStamp(i.createtime));
        // i.nickname = (i.matchUser[0] && i.matchUser[0].nickname) || "";
        this.list.push(i);
      });
      console.log(this.list);
      this.activityLoading = false;
    }
  },
  watch: {
    activityList: {
      handler(newval, old) {
        console.log(newval);
        this.formatActivityList();
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
      newVideoList: state => state.newVideoList
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
  display: flex;
  /* justify-content: space-around; */
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
