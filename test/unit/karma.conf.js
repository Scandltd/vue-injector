const webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'flow-vue'],
          plugins: [
            'syntax-dynamic-import',
            'transform-decorators-legacy'
          ]
        },
        exclude: /node_modules/
      }
    ]
  }
}

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      '../../node_modules/@babel/polyfill/dist/polyfill.js',
      '**/*.spec.js'
    ],
    preprocessors: {
      '**/*.spec.js': ['webpack']
    },
    reporters: ['mocha'],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true,
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
      'karma-webpack'
    ]
  })
}
