/* jshint esversion: 6 */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ConfigWebpackPlugin = require('config-webpack');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      inject: 'body',
    }),
    new ConfigWebpackPlugin(),
  ],
};
