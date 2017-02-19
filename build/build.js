// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'
var path = require('path')
var fs = require('fs');
var UglifyJS = require("uglify-js");
var CleanCss = require('clean-css');
var glob = require('glob');
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var utils = require('./utils')
var Title = require('../config/title');
var publicPath = config.build.assetsPublicPath;
var webpackConfig = require('./webpack.prod.conf')
var buildEntry = process.argv.splice(2).join(' ');
var templateDir = config.build.templateDir;
var symsLinkDir =config.build.symsLinkDir;

rm('-rf', symsLinkDir);
fs.symlink(path.resolve(__dirname, '../dist'), symsLinkDir, () => {});

// if (exec('git pull').code !== 0) {
//   echo('Error: Git pull failed');
//   exit(1);
// }

function createMinCommon () {
  var mapcssjs = function (item) {
    return path.join(__dirname, '../', item);
  }
  var styles = config.styles.map(mapcssjs);
  var scripts = config.scripts.map(mapcssjs);
  var jslib = path.join(__dirname, '../dist/static/common/lib.min.js');
  var csslib = path.join(__dirname, '../dist/static/common/common.min.css');

  fs.exists(jslib, function (exists) {
    if (!exists) {
      fs.writeFile(jslib, UglifyJS.minify(scripts).code, 'utf8');
    }
  });
  function cssMinifier(flieIn, fileOut) {
    var flieIn=Array.isArray(flieIn)? flieIn : [flieIn];
    var origCode,finalCode='';
    var minCss = new CleanCss();
    for(var i=0; i<flieIn.length; i++) {
      origCode = fs.readFileSync(flieIn[i], 'utf8').replace(/url\(['|"](.*['|"]\))/gi, 'url(' + publicPath + '$1');
      finalCode += minCss.minify(origCode).styles;
    }
    fs.writeFileSync(fileOut, finalCode, 'utf8');
  }
  fs.exists(csslib, function (exists) {
    if (!exists) {
      cssMinifier(styles, csslib);
    }
  });
}

var entrys = {};
Object.keys(webpackConfig.entry).forEach((name) => {
  if (buildEntry.indexOf(name) > -1) {
    entrys[name] = webpackConfig.entry[name];
  }
});
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
var entrysKeys = Object.keys(entrys);
if (entrysKeys.length) {
  webpackConfig.entry = entrys;
  fs.exists(templateDir, (ex) => {
    if (ex) {
      glob.sync(path.join(templateDir, '**/*')).forEach((pt) => {
        entrysKeys.forEach((key) => {
          if(pt.indexOf(key) > -1) {
            rm('-rf', pt);
          }
        });
      })
    } else {
      mkdir('-p', templateDir);
    }
  })
  fs.exists(assetsPath, function(ex){
    if (ex) {
      glob.sync(path.join(assetsPath, '**/*')).forEach((pt) => {
        entrysKeys.forEach((key) => {
          if(pt.indexOf(key) > -1) {
            rm('-rf', pt);
          }
        })
      });
    } else {
      mkdir('-p', path.join(assetsPath, 'common'));
      cp('-R', 'static/fonts', assetsPath);
      cp('-R', 'static/images', assetsPath);
      createMinCommon();
    }
  });
} else {
  rm('-rf', assetsPath);
  rm('-rf', templateDir);
  mkdir('-p', path.join(assetsPath, 'common'));
  mkdir('-p', templateDir);
  cp('-R', 'static/fonts', assetsPath);
  cp('-R', 'static/images', assetsPath);
  createMinCommon();
}

Object.keys(webpackConfig.entry).forEach(function (name) {
  // see https://github.com/ampedandwired/html-webpack-plugin
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      title: name + '页',
      filename: path.resolve(__dirname, templateDir, name + '.html'),
      templateContent: function () {
        var template = fs.readFileSync(path.join(__dirname, '../src/pages/layout/template.html'),'utf-8');
        // return template.replace(/<!--title-->/, Title[name] || '').replace(/<!--buildcss-->/, '<link rel="stylesheet" href="' + publicPath + '/' + utils.assetsPath('/common/common.min.css')+'"/>').replace(/<!--buildjs-->/, '<script src=" ' + publicPath + '/' +  utils.assetsPath('/common/lib.min.js') + '"></script>').replace(/<!--globalvar-->/, '<script>window.UserInfo={uid: "<!--{$_uid}-->", username: "<!--{$_uinfo.username}-->"}</script>');
        return template.replace(/<!--title-->/, Title[name] || '').replace(/<!--buildcss-->/, '<link rel="stylesheet" href="' + publicPath + '/' + utils.assetsPath('/common/common.min.css')+'"/>').replace(/<!--buildjs-->/, '<script src=" ' + publicPath + '/' +  utils.assetsPath('/common/lib.min.js') + '"></script>');
      },
      // chunks: ['manifest', 'vendor', name],
      chunks: [name],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  );
});

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)
var spinner = ora('building for production...')
spinner.start()

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
