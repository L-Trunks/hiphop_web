const webpack = require('webpack')
module.exports = {
  // 基本路径
  // baseUrl: './',
  // 输出文件目录
  lintOnSave: false,
  outputDir: 'dist',
  runtimeCompiler: true,
  publicPath: './', // 设置打包文件相对路径
  devServer: {
    port: 8080,
    // open: true, //配置自动启动浏览器 
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888/api', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill/dist/quill.js',
      'Quill': 'quill/dist/quill.js'
    }]);
  }
}