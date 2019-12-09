"use strict";
const path = require("path");
const utils = require("./utils");
const appConfig = require("../app.json");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const {entry, plugins} = utils.generatePages(appConfig)
module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: entry,
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      "@": resolve("src"),
      static: resolve("static")
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: utils.generateStyleLoaders("sass")
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [resolve("src")],
        exclude: [resolve("src/libs")]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:4].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:4].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:4].[ext]")
        }
      }
    ]
  },
  plugins: [...plugins]
};
