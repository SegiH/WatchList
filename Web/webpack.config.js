const path = require("path");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  target: 'web',
  resolve: {
    extensions: ['.tsx','.ts', '.js','.css','.png','.ico'],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/dist",
  },
  module: {
    rules:[
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ], 
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
    hot: false
  },
  plugins:[
     new Dotenv(),
     new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      inject: false
    }),
  ]
}