require('shelljs/global')
var config = require('../config')
var Title = require('../config/title');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var cssLinks = '';
var scripts = '';
config.scripts.forEach(function (item) {
  scripts = scripts + '<script src="' + item +'"></script>'
});
config.styles.forEach(function (item) {
  cssLinks = cssLinks + '<link rel="stylesheet" href="' + item + '"/>';
});
var devConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  vue: {
    loaders: {
      js: 'url_replace?env=development!babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
    }
  },
  // eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]
});
var globalDir = path.resolve(__dirname, '../config/global.js');
var globalStr = '';
if (fs.existsSync(globalDir)) {
  globalStr = fs.readFileSync(globalDir, 'utf-8');
} else {
  touch(globalDir);
}
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
  // https://github.com/ampedandwired/html-webpack-plugin
  devConfig.plugins.push(new HtmlWebpackPlugin({
    filename: name + '.html',
    chunks: [name],
    templateContent: function () {
      var template = fs.readFileSync(path.join(__dirname, '../src/pages/layout/template.html'),'utf-8');
      return template.replace(/<!--title-->/, Title[name] || '').replace(/<!--buildcss-->/, cssLinks).replace(/<!--buildjs-->/, scripts).replace(/<!--globalvar-->/, `<script>${globalStr}</script>`);
    },
    inject: true
  }));
})

module.exports = devConfig;
