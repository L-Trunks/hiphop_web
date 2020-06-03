<template>
  <el-row class="box hidden_tar">
    <el-col class :span="16" :offset="4">
      <el-breadcrumb style="margin:20px 0;margin-left:10px" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">聊天室列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{roomname}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="c-chat">
        <div class="chat-top">
          <img class="top-head" :src="imgurl" />
          <span class="top-name">{{roomname}} &nbsp; &nbsp; &nbsp;</span>
          <router-link to="/">
            <el-button
              type="danger"
              style="position:relative; left:60%;bottom:10px"
              size="small"
            >退出房间</el-button>
          </router-link>
        </div>
        <div class="chat-log">
          <li
            class="mes-li"
            v-for="chat in chatLog"
            :class="chat.chatType === 'tips' ? 'mes-li-center' : (userid === chat.userid ? 'mes-li-right' : 'mes-li-left')"
          >
            <div class="li-head" v-if="chat.chatType === 'chat'">
              <img :src="chat.userurl ||'http://localhost:8888/public/images/noimage.jpg'" />
            </div>
            <div class="li-box" v-if="chat.chatType === 'chat'">
              <p class="box-name">
                {{chat&&chat.nickname&&chat.nickname||''}}
                <span class="time">{{chat.chatTime}}</span>
              </p>
              <p class="box-mes">{{chat.chatMes}}</p>
            </div>
            <p class="li-text" v-if="chat.chatType === 'tips'">{{chat.userid}} {{chat.chatMes}}</p>
          </li>
        </div>
        <div class="top_model_top">
          <el-input
            ref="r_editText"
            v-model="editText"
            @keyup.13="sendEnTer"
            style="width:50%"
            placeholder="请输入内容"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button
            type="primary"
            @click="sendEnTer"
            icon="el-icon-position"
            class="search_btn"
            size="big"
          >发送</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import axios from "axios";
import io from "socket.io-client";
import { formatDateTime } from "../utils/util";
export default {
  data() {
    return {
      showGroup: false,
      editText: "",
      nickname: "",
      socket: null,
      groupNickName: "",
      chatLog: [],
      groupNumber: [],
      groupState: {},
      roomid: "",
      imgurl: "",
      roomname: ""
    };
  },
  created() {
    this.roomid = this.$route.query.roomid;
    this.roomname = this.$route.query.roomname;
    this.imgurl =
      this.$route.query.imgurl ||
      "http://localhost:8888/public/images/noimage.jpg";
    this.joinRoom();
    
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "overflow: scroll !important");
  },
  mounted() {
    this.talk();
    this.$refs.r_editText.focus();
    let oldTime = 1504509461000;
    let old = new Date(oldTime);
    let test = Date.parse(new Date()); // Date.parse(datestring) 是一个静态函数，可以直接调用
    this.getChatLog()
    setInterval(() => {
      this.getChatLog();
    }, 5000);
  },
  methods: {
    getChatLog() {
      axios({
        url: "/chatapi/get_chat_log",
        method: "GET"
      }).then(res => {
        let data = res.data;
        if (data.code === 200) {
          this.chatLog = [];
          data.chatLog.map(i => {
            i.chatTime = formatDateTime(i.chatTime);
            if (i.chatToGroup === this.roomid) {
              this.chatLog.push(i);
            }
          });
        } else {
          // 提示获取失败
          
        }
      });
    },
    joinRoom() {
      // 1.连接websocket
      this.socket = io.connect("http://localhost:7788");
      // 1.组织数据
      let chat = {
        userid: this.userid,
        nickname: (this.userInfo && this.userInfo.nickname) || "",
        chatTime: Date.parse(new Date()),
        chatMes: "on-line",
        chatToGroup: this.roomid,
        chatType: "tips" // chat/tips
      };
      // 3.on-line在线 room发送消息
      this.socket.removeAllListeners();
     
      let that = this;
      setTimeout(function() {
        that.socket.emit("joinToRoom", chat);
      }, 200);
    },
    sendEnTer() {
      this.editText = this.editText.replace(/\s+/g, "");
      if (this.editText.length > 0) {
        // 发送消息
        let chat = {
          userid: this.userid,
          nickname: (this.userInfo && this.userInfo.nickname) || "",
          chatTime: Date.parse(new Date()),
          chatMes: this.editText,
          chatToGroup: this.roomid,
          userurl:
            this.userInfo.imgurl ||
            "http://localhost:8888/public/images/noimage.jpg",
          chatType: "chat" // tips
        };
        console.log(chat,this.chatLog)
        // 发送
        this.socket.emit("emitChat", chat);
        console.log(chat,this.chatLog)
        // 发送成功之后
        this.editText = "";
        this.$refs.r_editText.focus();
        // 发送前更新本地chatLog
        chat.chatTime = formatDateTime(chat.chatTime);
        // this.chatLog.push(chat);
        this.getChatLog()
        console.log(chat,this.chatLog)
        // document.querySelector(".chat-log").scrollTo(0, 99999999999);
      } else {
        this.editText = "";
        this.$refs.r_editText.focus();
      }
    },
    talk() {
      this.socket.removeAllListeners();
      let that = this;
      this.socket.on("joinToRoom", function(data) {
        let chat = data;
        chat.chatTime = formatDateTime(chat.chatTime);
        that.chatLog.push(chat);
      });
      this.socket.on("leaveToRoom", function(data) {
        let chat = data;
        chat.chatTime = formatDateTime(chat.chatTime);
        that.chatLog.push(chat);
      });
      this.socket.on("updateGroupNumber", function(data) {
        let groupNumber = data;
        that.groupNumber = groupNumber;
      });
      this.socket.on("userQuit", function(data) {
        let chat = data;
        chat.chatTime = formatDateTime(chat.chatTime);
        //          that.chatLog.push(chat)
      });
      this.socket.on("broadChat", function(data) {
        let chat = data;
        chat.chatTime = formatDateTime(chat.chatTime);
        that.chatLog.push(chat);
      });
    },
  },
  updated() {
    // 保持滚动到底部
    document.querySelector(".chat-log").scrollTo(0, 99999999999);
  },
  beforeDestroy() {
    let chat = {
      userid: this.userid,
      nickname: (this.userInfo && this.userInfo.nickname) || "",
      chatTime: Date.parse(new Date()),
      chatMes: "off-line",
      chatToGroup: this.roomid,
      chatType: "tips" // chat/tips
    };
    // 3.on-line在线 room发送消息
    this.socket.removeAllListeners();
   
    let that = this;
    document
      .getElementsByTagName("body")[0]
      .setAttribute("style", "overflow: scroll !important");
    setTimeout(function() {
      that.socket.emit("leaveToRoom", chat);
    }, 200);
  },
  watch: {
    userid: {
      handler(newval, old) {
        
        this.joinRoom();
      },
      deep: true
    },
    userInfo: {
      handler(newval, old) {
        
        this.joinRoom();
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
  }
};
</script>
<style lang="scss" scope>
.c-chat {
  position: relative;
  height: 100%;
}
.hidden_tar {
  overflow: hidden !important;
}
.top-head {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.chat-log {
  background: #fff;
  border-radius: 5px;
  overflow-y: auto;
  height: 450px;
  padding: 40px 20px 100px;
  // padding: 55px 5px 105px;
  .mes-li {
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    list-style-type: none;
    .li-head {
      width: 40px;
      height: 40px;
      border-radius: 40px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 40px;
      }
    }
    .li-box {
      max-width: 75%;
      overflow: hidden;
      .box-name {
        margin-bottom: 2px;
        font-size: 14px;
        color: #01aefb;
        .time {
          display: inline-block;
          margin: 0 10px;
          padding: 0px 10px;
          font-size: 12px;
          color: #b8b8bb;
          border-radius: 5px;
          background: #f3f4f5;
        }
      }
      .box-mes {
        display: inline-block;
        padding: 3px 10px;
        font-size: 15px;
        color: #575758;
        background: #dbeef7;
        border-radius: 4px;
      }
    }
  }
  .mes-li-left {
    .li-head {
      float: left;
      margin-right: 8px;
    }
    .li-box {
      .box-name {
        .time {
          margin-left: 10px;
        }
      }
    }
  }
  .mes-li-right {
    .li-head {
      float: right;
      margin-left: 8px;
    }
    .li-box {
      float: right;
      .box-mes {
        float: right;
      }
      .box-name {
        text-align: right;
        .time {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
  .mes-li-center {
    text-align: center;
    .li-text {
      display: inline-block;
      padding: 4px 10px;
      font-size: 13px;
      color: #1fff18;
      border-radius: 5px;
      background: #f3f4f5;
    }
  }
}
//
.top-group {
  color: #232325;
  font-size: 16px;
}
.top-name {
  font-size: 24px;
  font-weight: 600;
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
</style>
