"use strict";
const path = require("path");
const config = require("../config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const resolvePage = p => path.resolve(__dirname, "../src/web", p);
exports.assetsPath = function(_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === "production"
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};

exports.generateStyleLoaders = (loader, loaderOptions = {}) => {
  const isProd = process.env.NODE_ENV === "production";
  const sourceMap = isProd ? config.build.sourceMap : true;
  const loaders = [
    {
      loader: "css-loader",
      options: { sourceMap }
    },
    {
      loader: "postcss-loader",
      options: { sourceMap }
    }
  ];

  if (loader) {
    loaders.push({
      loader: loader + "-loader",
      options: { sourceMap }
    });
  }

  if (isProd) {
    return [
      {
        loader: MiniCssExtractPlugin.loader,
        options: { sourceMap }
      }
    ].concat(loaders);
  } else {
    return ["style-loader"].concat(loaders);
  }
};
// 通过命令行中的 --dir=[target] 来过滤target目录
function filterPages(apps) {
  const curArgv = process.argv.find(item => ~item.indexOf("--dir"));
  const curDir = curArgv ? curArgv.replace(/--dir=(.+)/, "$1") : "";
  return curDir ? { [curDir]: apps[curDir] } : apps;
}

exports.generatePages = apps => {
  const retEntry = {};
  const plugins = [];
  apps = filterPages(apps)
  
  for (const app in apps) {
    for (const page of apps[app]) {
      const { filename, chunks, title } = page;
      retEntry[`${app}_${filename}`] = resolvePage(`${app}/js/${filename}.js`);
      plugins.push(
        new HtmlWebpackPlugin({
          title,
          filename: `${app}/${filename}.html`,
          template: resolvePage(`${app}/${filename}.html`),
          chunks: [...chunks, `${app}_${filename}`],
          inject: true,
          chunksSortMode: "dependency"
        })
      );
    }
  }
  return { entry: retEntry, plugins };
};

exports.createNotifierCallback = () => {
  const notifier = require("node-notifier");

  return (severity, errors) => {
    if (severity !== "error") return;

    const error = errors[0];
    const filename = error.file && error.file.split("!").pop();

    notifier.notify({
      title: "notifier.notify",
      message: severity + ": " + error.name,
      subtitle: filename || ""
      // icon: path.join(__dirname, "logo.png")
    });
  };
};
