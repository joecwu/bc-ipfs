/* jshint esversion: 6 */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    inline: false,
  },
});
