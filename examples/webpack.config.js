const fs = require('fs');
const path = require('path');
const { VueLoaderPlugin: VuePlugin } = require('vue-loader');

module.exports = {
  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  mode: process.env.NODE_ENV || 'development',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir);
    const newEntries = { ...entries };
    let entry = path.join(fullDir, 'app.js');

    if (!fs.existsSync(path.join(fullDir, 'app.js'))) {
      entry = path.join(fullDir, 'app.ts');
    }

    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      newEntries[dir] = [path.join(__dirname, '..', 'src', 'polyfill.ts'), entry];
    }

    return newEntries;
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
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
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vuex: 'vuex/dist/vuex.esm-browser',
      vue: 'vue/dist/vue.esm-browser',
      '@scandltd/vue-injector': path.join(__dirname, '..', 'src')
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        shared: {
          name: 'shared',
          chunks: 'all'
        }
      }
    }
  },

  plugins: [
    new VuePlugin()
  ],

  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};
