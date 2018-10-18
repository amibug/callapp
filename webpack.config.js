var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'callapp';

var plugins = [];

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({
    minimize: true
  }));
}

var config = {
  entry: {
    callapp: __dirname + '/src/callapp.js',
  },
  // devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: libraryName + '.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
        test: /(\.js)$/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['babel-plugin-add-module-exports']
        }
      }, {
        test: /\.less/,
        loaders: ['style', 'css', 'autoprefixer', 'less'],
      }
      // {
      //   test: /(\.js)$/,
      //   loader: "eslint-loader",
      //   exclude: /node_modules/
      // }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  eslint: {
    configFile: '.eslintrc.js'
  },
  plugins: plugins
};

module.exports = config;
