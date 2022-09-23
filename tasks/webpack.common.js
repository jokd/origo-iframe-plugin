const path = require("path");

module.exports = {
  entry: [
    './origoiframeetuna.js'
  ],
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/
    }]
  },
  externals: ['Origo'],
  resolve: {
    extensions: ['*', '.js', '.scss'],
    alias: {
      'Origo$': path.resolve(__dirname, "../../origo/origo.js")
    }
  }
};
