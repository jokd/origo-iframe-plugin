const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../../origo/plugins`,
    publicPath: '/build/js',
    filename: 'origoiframeetuna.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'Origoiframeetuna'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {},
  devServer: {
    static: './',
    port: 9001,
    devMiddleware: {
      //index: true,
      //mimeTypes: { 'text/html': ['phtml'] },
      //publicPath: '/publicPathForDevServe',
      //serverSideRender: true,
      writeToDisk: true,
    },
    
  }
});
