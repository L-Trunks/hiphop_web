<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>{{title}}</span>
      </div>
      <div class="text item">
        <div v-if="list.length>0" class="card_box">
          <el-card
            class="card"
            v-for="(item, index) in list"
            :key="index"
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
        </div>
        <div v-else class="no_data">暂无数据</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { formatDateTime } from "../utils/util";
export default {
  name: "ContentList",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    }
    // leftList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // },
    // rightList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // }
  },
  methods: {
    showDetail(data) {
      console.log(data);
      if (this.type === "article") {
        this.$router.push({
          path: "/article_detail",
          query: { articleid: data._id}
        });
      } else if (this.type === "video") {
        this.$router.push({
          path: "/video_detail",
          query: { videoid: data._id }
        });
      }
    }
  }
};
</script>
<style scoped>
.sign {
  padding: 1px 3px;
  font-size: 12px;
  background: rgb(235, 190, 190);
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
.image_ {
  /* position: absolute; */
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.no_data {
  width: 100%;
  height: 180px;
  font-size: 28px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #999;
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
.card_box {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
}

.card {
  margin: 10px;
  width: 20%;
}
.box-card {
  margin: 5px;
}
.title {
  font-size: 20px;
  font-family: "Courier New", Courier, monospace;
  font-weight: 800;
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
</style>
