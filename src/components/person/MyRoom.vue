<template>
  <div>
    <div class="chat_box">
      <el-switch
        style="margin:20px 0"
        v-if="userRoomList!=0"
        v-model="status"
        active-value="0"
        @change="updateStatus"
        inactive-value="1"
        active-text="开启"
        inactive-text="关闭"
      ></el-switch>
      <div :loading="activityLoading" class="my_activity">
        <el-card
          class="activity_card"
          v-for="(item, index) in userRoomList"
          :key="index"
          :body-style="{ padding: '0px' }"
        >
          <div
            :style="{ background: 'url('+item.imgurl||''+') no-repeat center center', backgroundSize: '100% 100%',width:'100%',height:'200px'}"
          >
            <div class="room_title">{{item.title || ''}}</div>
            <div class="demo"></div>
            <div
              style="z-index:999; margin-top:5px;display:flex;flex-direction:row; justify-content:space-around;"
            >
              <el-button type="info" @click="updateRoom(item)" size="mini">编辑</el-button>
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
                  <el-button type="danger" size="mini">进入</el-button>
                </a>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog title="编辑房间信息" :loading="dialoading" :visible.sync="dialogVisible" width="60%">
      <div style="padding:20px">
        <el-form
          :rules="roomRules"
          ref="roomForm"
          :label-position="'top'"
          :model="roomForm"
          label-width="80px"
        >
          <el-form-item label="房间标题:" prop="title">
            <el-input v-model="roomForm.title"></el-input>
          </el-form-item>
          <el-form-item label="房间介绍:" prop="introduce">
            <el-input placeholder="请输入房间介绍" v-model="roomForm.introduce"></el-input>
          </el-form-item>
          <el-form-item label="房间海报:">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-success="handleImgSuccess"
              :on-remove="handleImgRemove"
              :file-list="fileImgList"
              list-type="picture"
              :limit="1"
              :on-exceed="handleImgExceed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1mb</div>
            </el-upload>
          </el-form-item>
          <el-form-item style="width:100%;">
            <div style="margin-top:80px">
              <el-button type="danger" icon="el-icon-s-promotion" @click="submit('roomForm')">提交</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { GetAllMatchList, DeleteMatch } from "../../api/match_api";
import { GetAllRoomList, UpdateRoom } from "../../api/room_api";
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
      fileImgList: [],
      dialoading: false,
      dialogVisible: false,
      roomForm: {
        title: "",
        userid: "",
        introduce: "",
        status: "",
        imgurl: ""
      },
      roomContent: "",
      roomRules: {
        title: [{ required: true, message: "请输入房间标题", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }]
      },
      editorType: "0",
      content: "", // 文章内容
      editorOption: {}, // 编辑器选项
      addRange: [],
      sortoptions: [],
      uploadUrl: "/api/upload/image",
      uploadType: "", // 上传的文件类型（图片、视频）
      fullscreenLoading: false,
      list: [],
      activityLoading: false,
      userRoomList: [],
      status: ""
    };
  },
  created() {
    this.getRoom();
  },
  mounted() {
        if (
      this.userInfo &&
      this.userInfo.permission !== "2"
    ) {
      this.$message.error('您无权访问此网页')
      this.$router.push('/')
    }
    this.formatRoomList();
  },
  methods: {
    ...mapActions([
      "GetAllRotationImgList",
      "GetAllMatchList",
      "GetAllRoomList"
    ]),
    handleImgRemove(file, fileList) {
      
      this.roomForm.imgurl = "";
    },
    handleImgSuccess(file) {
      
      this.roomForm.imgurl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    updateRoom(data) {
      this.dialoading = true;
      this.roomForm = data;
      
      this.fileList = [{ name: "", url: data.imgurl }];
      this.dialogVisible = true;
      this.dialoading = false;
    },
    //更新房间
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          if (this.roomForm.imgurl == "") {
            this.$message.error("请上传房间海报");
            return;
          }
          this.$confirm("确定提交吗？")
            .then(_ => {
              this.roomForm = {
                ...this.roomForm,
                userid: this.userid
              };
              
              UpdateRoom(this.roomForm)
                .then(res => {
                  
                  this.roomForm = {
                    title: "",
                    userid: "",
                    introduce: "",
                    status: "",
                    imgurl: ""
                  };
                  this.fileList = [];
                  this.content = "";
                  this.$message.success("编辑成功，快去看看吧");
                  this.getRoom({});
                  this.dialogVisible = false;
                  this.GetAllRoomList();
                })
                .catch(err => {
                  
                  this.$message.error("出现错误，请稍候再试");
                  this.dialogVisible = false;
                });
            })
            .catch(_ => {
              return;
            });
        } else {
          return false;
        }
      });
    },
    updateStatus() {
      UpdateRoom({ _id: this.userRoomList[0]._id, status: this.status })
        .then(res => {
          
          this.getRoom();
          this.GetAllRoomList();
          if (res) {
            this.$message.success("更新房间状态成功");
          }
        })
        .catch(err => {
          
          this.getRoom();
          this.$message.success("更新房间状态失败");
        });
    },
    //获取聊天室列表
    getRoom() {
      GetAllRoomList({ userid: this.userid })
        .then(res => {
          
          this.userRoomList = (res && res.data) || "";
          this.status = (res && res.data && res.data[0].status) || "";
        })
        .catch(err => {
          
        });
    },
    deleteRoom(data) {
      this.$confirm("确定删除该聊天室”" + data.title + "“吗？")
        .then(_ => {
          DeleteMatch({ _id: data._id })
            .then(res => {
              
              this.getRoom();
              this.$message.success("删除成功");
            })
            .catch(err => {
              
              this.$message.error("删除失败，请稍候再试");
            });
        })
        .catch(_ => {});
    },
    formatRoomList() {
      this.activityLoading = true;
      let list = (this.activityList && this.activityList) || [];
      this.list = this.userRoomList;
      // list.map(i => {
      //   i.createtime = formatDateTime(dateTimeStamp(i.createtime));
      //   // i.nickname = (i.matchUser[0] && i.matchUser[0].nickname) || "";
      //   this.list.push(i);
      // });
      // 
      this.activityLoading = false;
    }
  },
  watch: {
    userRoomList: {
      handler(newval, old) {
        
        this.formatRoomList();
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
.chat_box {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #ebeef5;
  background: #fff;
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
