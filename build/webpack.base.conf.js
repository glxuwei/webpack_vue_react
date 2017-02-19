var path = require('path')
var config = require('../config')
var webpack =require('webpack');
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var glob = require("glob");
var entrys_glob = glob.sync(path.join(projectRoot, "src/pages/**/*.entry.js*"));
var nodeModulesSrc = path.join(__dirname, '../node_modules');
var entrys = {};
entrys_glob.forEach(function (entry) {
  var entryName = entry.replace(/.*\/(\w*)\.entry\.jsx?/, '$1');
  entrys[entryName] = entry;
});
module.exports = {
  entry: entrys,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [nodeModulesSrc ],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'data': path.resolve(__dirname, '../src/data'),
      'components': path.resolve(__dirname, '../src/components'),
      'static': path.resolve(__dirname, '../static'),
      'views': path.resolve(__dirname, '../src/pages/views')
      // 'assets': path.resolve(__dirname, '../src/assets'),
    }
  },
  externals: {
      'vue': 'Vue'
  },
  resolveLoader: {
    modulesDirectories: ['custom_loaders', 'node_modules'],
    extensions: ['', '.loader.js', '.js'],
    fallback: [nodeModulesSrc]
  },
  module: {
    /* preLoaders: [ */
      // {
        // test: /\.vue$/,
        // loader: 'eslint',
        // include: projectRoot,
        // exclude: /node_modules/
      // },
      // {
        // test: /\.js$/,
        // loader: 'eslint',
        // include: projectRoot,
        // exclude: /node_modules/
      // }
    /* ], */
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel?presets[]=es2015&presets[]=react',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Vue': 'vue'
    })
  ],
  /* eslint: { */
    // formatter: require('eslint-friendly-formatter')
  /* }, */
  vue: {
    loaders: Object.assign({
      js: 'url_replace?env=' + process.env.NODE_ENV+'!babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
    }, utils.cssLoaders())
  }
}
