const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

// This config is used to build the electron-dev directory for development
module.exports = merge(common, {
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'cheap-module-source-map',
  
  output: {
    path: path.resolve(__dirname, '..', 'electron-dev'),
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: './',
  },

  module: {
    rules: [
      // CSS and SCSS
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                auto: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ['node_modules'],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BUILD_TARGET': JSON.stringify('electron-renderer'),
    }),
    
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].chunk.css',
    }),
    
    // Copy electron-specific files
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'public', 'electron-starter.js'),
          to: path.resolve(__dirname, '..', 'electron-dev', 'electron-starter.js'),
        },
        {
          from: path.resolve(__dirname, '..', 'public', 'package.json'),
          to: path.resolve(__dirname, '..', 'electron-dev', 'package.json'),
        },
        {
          from: path.resolve(__dirname, '..', 'public', 'components'),
          to: path.resolve(__dirname, '..', 'electron-dev', 'components'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, '..', 'public', 'icons'),
          to: path.resolve(__dirname, '..', 'electron-dev', 'icons'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
  },

  externals: {
    'archiver': 'require("archiver")',
    'fs-extra': 'commonjs2 fs-extra',
  },
});