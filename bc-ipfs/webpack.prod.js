/* jshint esversion: 6 */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    contentBase: './public',
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    inline: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
