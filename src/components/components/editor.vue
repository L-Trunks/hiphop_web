<template>
  <div>
    <!-- quill-editor插件标签 分别绑定各个事件-->
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
    <!-- 文件上传input 将它隐藏-->
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :data="uploadData"
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
    </el-upload>
  </div>
</template>

<script>
import * as Quill from "quill"; // 引入编辑器
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "editor",
  data() {
    return {
      content: this.content, // 文章内容
      uploadType: "",
      addRange: []
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
    },
    editorOption: {
      type: Object,
      default: () => {
        return {};
      }
    }, // 编辑器选项
    // addRange: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // },
    uploadData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    photoUrl: {
      type: String,
      default: ""
    }, // 上传图片地址
    // uploadType: {
    //   type: String,
    //   default: ""
    // }, // 上传的文件类型（图片、视频）
    fullscreenLoading: {
      type: Boolean,
      default: false
    }
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
        vm.addRange = vm.$refs.myQuillEditor.quill.getSelection();
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        vm.$refs.myQuillEditor.quill.insertEmbed(
          vm.addRange !== null ? vm.addRange.index : 0,
          vm.uploadType,
          value,
          Quill.sources.USER
        ); // 调用编辑器的 insertEmbed 方法，插入URL
      } else {
        this.$message.error(`${vm.uploadType}插入失败`);
      }
      this.$refs["upload"].clearFiles(); // 插入成功后清除input的内容
    },
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
      this.uploadType = "image";
    },

    // 点击视频ICON触发事件
    videoHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
      this.uploadType = "video";
    },

    // 编辑器光标离开 将编辑器内容发射给父组件
    onEditorBlur(editor) {
      this.$emit("getValue", this.content);
    },

    // 编辑器获得光标
    onEditorFocus(editor) {
      editor.enable(true); // 实现达到上限字符可删除
    },

    // 编辑器文本发生变化
    onEditorChange({ editor, html, text }) {
      this.$emit("getValue", this.content);
    },

    // 清除编辑器内容
    callMethod() {
      this.content = "";
    }
  },
  // 页面加载后执行 为编辑器的图片图标和视频图标绑定点击事件
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("video", this.videoHandler); // 为视频ICON绑定事件
  }
};
</script>

<style scoped>
.quill-editor {
  height: 500px;
}
.ql-container {
  height: 400px;
}
.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;
}
.limit span {
  color: #ee2a7b;
}
.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}
</style>