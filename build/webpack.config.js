const path = require('path');
const { BannerPlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { version: packageVersion } = require('../package.json');

const version = process.env.VERSION || packageVersion;
const banner = `
  @scandltd/vue-injector v${version}
  (c) ${new Date().getFullYear()} Scandltd
  @license GPL-2.0
`;

module.exports = {
  mode: 'production',

  entry: path.join(__dirname, '..', 'src', 'index.ts'),

  output: {
    path: path.join(__dirname, '..', 'dist'),
    library: 'Vue-injector',
    libraryTarget: 'umd',
    libraryExport: 'default',
    // See https://github.com/webpack/webpack/issues/6522
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },

  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }, 'eslint-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json']
  },

  optimization: {
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      })
    ]
  },

  plugins: [
    new BannerPlugin({
      banner
    })
  ]
};
