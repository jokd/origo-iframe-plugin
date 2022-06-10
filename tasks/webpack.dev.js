const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../out`,
    publicPath: '/build/js',
    filename: 'origoiframeetuna.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Origoiframeetuna'
  },
  mode: 'development',
  module: {
  },
  plugins: [
    new WriteFilePlugin()
  ],
  devServer: {
    contentBase: './',
    port: 9010
  }
});
