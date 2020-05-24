<template>
  <div>
    <mavon-editor
      v-model="content"
      ref="md"
      @imgAdd="$imgAdd"
      @change="change"
      style="min-height: 600px"
    />
    <!-- <button @click="submit">提交</button> -->
    <!-- <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :on-success="upScuccess"
      ref="upload"
      style="display:none"
    >
      <el-button
        size="small"
        type="primary"
        id="imgInput"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="插入中,请稍候"
      >点击上传</el-button>
    </el-upload>-->
  </div>
</template>

<script>
import { UploadImage } from "../../api/upload_api";
import axios from "axios";
export default {
  data() {
    return {
      content: this.content, // 文章内容
      html: "",
      fullscreenLoading: false,
      uploadType: ""
    };
  },
  props: {
    // content: {
    //   type: String,
    //   default: ""
    // }, // 文章内容
    uploadUrl: {
      type: String,
      default: ""
    }
  },
  mounted() {
    //
    
  },
  methods: {
    // 图片上传之前调取的函数
    beforeUpload(file) {
      
    },

    // 图片上传成功回调   插入到编辑器中
    upScuccess(e, file, fileList) {
      
      this.fullscreenLoading = false;
      let vm = this;
      let url = "";
      // 获得文件上传后的URL地址
      url = e.data.url;
      if (url != null && url.length > 0) {
        // 将文件上传后的URL地址插入到编辑器文本中
        let value = url;
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        this.$refs.md.$img2Url(this.pos, value);
      } else {
        this.$message.error(`${vm.uploadType}插入失败`);
      }
      this.$refs["upload"].clearFiles(); // 插入成功后清除input的内容
    },
    imgHandler(pos, file, e) {
      this.pos = pos;
      
      let input = document.getElementsByTagName("input");
      
      let fileInput = document.getElementById("imgInput");
      fileInput.click(); // 加一个触发事件
      this.uploadType = "image";
      this.$refs.upload.submit();
    },
    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append("file", $file);
      axios({
        url: "/api/upload/image",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          
          this.$refs.md.$img2Url(pos, res.data.data.url);
        })
        .catch(err => {
          
        });
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
      this.$emit("getValue", this.html);
    }
  }
};
</script>

<style>
</style>