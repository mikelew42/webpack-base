var globule = require('globule');
var path = require("path");

var entry = {
  // "./public/main": './src/entry.js'
};

var files = globule.find("./**/*.test.js", "!./node_modules/**", "!./jasmine/**").forEach(function(filePath){
  entry[filePath.replace(path.extname(filePath), "")] = filePath;
});

module.exports = {
  devtool: 'inline-source-map',
  entry: entry,
  output: {
    path: './',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      { test: /\.useable\.css$/, loader: "style/useable!css" },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};
