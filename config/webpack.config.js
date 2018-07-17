/**
 * Provides a base webpack configuration to be extended.
 * There is no "mode" defined, and this configuration cannot be used directly;
 * see ./webpack.config.prod or ./webpack.config.dev.
 *
 * Defines:
 * - [resolve](https://webpack.js.org/configuration/resolve/)
 * - [module](https://webpack.js.org/configuration/module/)
 * - [plugins](https://webpack.js.org/configuration/plugins/)
 * - [node](https://webpack.js.org/configuration/node/)
 *
 * The order of `module.rules` is sensitive; env-specific configs should not modify.
 *
 * Env-specific configs must define, at a minimum:
 * - mode ("production" | "development")
 * - [entry](https://webpack.js.org/configuration/entry-context/)
 * - [output](https://webpack.js.org/configuration/output/)
 */

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// style files regexes
const cssRegex = /\.css$/;
// const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
// const sassModuleRegex = /\.module\.(scss|sass)$/;

const isProduction = env.stringified['process.env'].NODE_ENV === '"production"';
const shouldUseSourceMap = isProduction && (process.env.GENERATE_SOURCEMAP !== 'false');

const cssFilenameTemplate = 'static/css/[name].[contenthash:8].css';

// common function to get style loaders
const getStyleLoaders = (preProcessor) => {
  // importLoaders: See https://webpack.js.org/loaders/css-loader/#importloaders
  let importLoaders = 1; // for postcss-loader
  if (preProcessor) {
    importLoaders += 1; // for preProcessor
  }

  let inlineStyleLoader = require.resolve('style-loader');
  if (isProduction) {
    // Output CSS files, and rewrite paths relative from CSS dir
    const cssRelativePath = Array(cssFilenameTemplate.split('/').length).join('../');
    inlineStyleLoader = {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: cssRelativePath },
    };
  }

  const loaders = [
    inlineStyleLoader,
    {
      loader: require.resolve('css-loader'),
      options: { importLoaders },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          autoprefixer({
            flexbox: 'no-2009',
          }),
        ],
        sourceMap: shouldUseSourceMap,
      },
    },
  ];
  if (preProcessor) {
    loaders.push(require.resolve(preProcessor));
  }
  return loaders;
};

const loaderRules = Object.freeze([
  // Disable require.ensure as it's not a standard language feature.
  { parser: { requireEnsure: false } },

  // First, run the linter.
  // It's important to do this before Babel processes the JS.
  {
    test: /\.(js|jsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: eslintFormatter,
          eslintPath: require.resolve('eslint'),

        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    include: paths.appSrc,
  },
  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          // Set limit to 1, to effectively force all images to be read from disk.
          // Otherwise, we could change CSP settings, but the cost of this is minimal.
          // If there end up being many small images, we can revisit.
          limit: 1,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve('thread-loader'),
            options: {
              // In dev, keep workers alive for more effective watch mode
              poolTimeout: isProduction ? 500 : Infinity,
            },
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              compact: isProduction,
              cacheDirectory: !isProduction,
            },
          },
        ],
      },
      {
        test: /\.woff2?$|\.woff$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'static/fonts/[name].[ext]',
          },
        }],
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      // By default we support CSS Modules with the extension .module.css
      {
        test: cssRegex,
        use: getStyleLoaders(),
      },
      // Opt-in support for SASS (using .scss or .sass extensions).
      // Chains the sass-loader with the css-loader and the style-loader
      // to immediately apply all styles to the DOM.
      // By default we support SASS Modules with the
      // extensions .module.scss or .module.sass
      {
        test: sassRegex,
        use: getStyleLoaders('sass-loader'),
      },
      {
        loader: require.resolve('file-loader'),
        // Exclude `js` files to keep "css" loader working as it injects
        // it's runtime that would otherwise processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.js$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
]);

const webpackPlugins = [
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml,
  }),
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // In prod, it is absolutely essential that NODE_ENV was set to production here.
  // Otherwise React will be compiled in the very slow development mode.
  new webpack.DefinePlugin(env.stringified),
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

if (isProduction) {
  // Included here (and not in config.prod) to coordinate with the loader above
  webpackPlugins.push(new MiniCssExtractPlugin({
    filename: cssFilenameTemplate,
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  }));
}

module.exports = {
  resolve: {
    modules: ['node_modules'].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
    ),
    alias: {},
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: loaderRules,
  },
  plugins: webpackPlugins,
  node: false,
};
