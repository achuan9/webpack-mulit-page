const path = require('path')
module.exports = {
  dev: {
    assetsPublicPath: '',
    assetsSubDirectory: 'static',
    devServer: {
      openPage: 'app-download/',
      contentBase: './dist',
      hot: true,
      open: false,
      port: 8080,
      clientLogLevel: 'error'
    }
  },
  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: './h5', // 访问路径
    assetsSubDirectory: '', // 静态文件目录
    sourceMap: true,
    gzip: false,
    bundleAnalyzerReport: false
  }
};
