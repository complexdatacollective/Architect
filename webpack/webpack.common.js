const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const appDirectory = path.resolve(__dirname, '..');
const srcDirectory = path.resolve(appDirectory, 'src');
const buildDirectory = path.resolve(appDirectory, 'www');
const publicDirectory = path.resolve(appDirectory, 'public');

module.exports = {
  entry: path.resolve(srcDirectory, 'index.js'),
  
  output: {
    path: buildDirectory,
    clean: true,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@app': srcDirectory,
      '@components': path.resolve(srcDirectory, 'components'),
      '@selectors': path.resolve(srcDirectory, 'selectors'),
      '@hooks': path.resolve(srcDirectory, 'hooks'),
      '@modules': path.resolve(srcDirectory, 'ducks', 'modules'),
      '@utils': path.resolve(srcDirectory, 'utils'),
      'concaveman': path.resolve(srcDirectory, 'utils', 'webShims', 'concavemock.js'),
    },
  },

  module: {
    rules: [
      // JavaScript and JSX
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(@codaco\/protocol-validation))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-nullish-coalescing-operator',
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
            ],
            cacheDirectory: true,
          },
        },
      },
      
      // Images
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1, // Force all images to be emitted as files
          },
        },
        generator: {
          filename: 'static/media/[name].[hash:8][ext]',
        },
      },
      
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]',
        },
      },
      
      // Other files
      {
        test: /\.(mp3|mp4|wav|pdf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8][ext]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(publicDirectory, 'index.html'),
      inject: true,
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        {
          from: publicDirectory,
          to: buildDirectory,
          globOptions: {
            ignore: ['**/index.html'],
          },
          // Don't process electron-starter.js
          filter: (resourcePath) => {
            return !resourcePath.includes('electron-starter.js');
          },
        },
        {
          from: path.resolve(publicDirectory, 'electron-starter.js'),
          to: path.resolve(buildDirectory, 'electron-starter.js'),
          // Copy as-is without processing
          noErrorOnMissing: true,
        },
      ],
    }),
    
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: ['node_modules', 'public', 'www', 'electron-dev'],
      context: srcDirectory,
      failOnError: false,
      emitWarning: true,
    }),
    
    new Dotenv({
      systemvars: true,
    }),
  ],

  // Ignore moment.js locales
  ignoreWarnings: [
    {
      module: /moment/,
      message: /locale/,
    },
  ],
};