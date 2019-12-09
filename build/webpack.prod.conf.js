"use strict";
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: chunkData => {
      const [app, filename] = chunkData.chunk.name.split("_");
      return `${app}/js/${filename}.[contenthash].js`;
    },
    chunkFilename: utils.assetsPath("js/[name].[chunkhash].js"),
    hashDigestLength: 4
  },
  devtool: false,

  plugins: [
    new webpack.DefinePlugin({
      "process.env": require("../config/prod.env")
    }),
    new MiniCssExtractPlugin({
      moduleFilename: chunkData => {
        const [app, filename] = chunkData.name.split("_");
        return `${app}/css/${filename}.[contenthash].css`;
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: config.build.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
  ]
});

if (config.build.gzip) {
  const CompressionWebpackPlugin = require("compression-webpack-plugin");

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: new RegExp(
        "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
