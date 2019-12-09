"use strict";

const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js"
  },
  devtool: "cheap-module-eval-source-map",
  devServer: config.dev.devServer,
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: config.dev.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
  ]
});
module.exports = devWebpackConfig;

