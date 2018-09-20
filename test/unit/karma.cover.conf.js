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
            'transform-decorators-legacy',
            ['istanbul', {
              exclude: [
                'test/'
              ]
            }]
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
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: '../../coverage', subdir: '.' },
        { type: 'text-summary', dir: '../../coverage', subdir: '.' }
      ]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true,
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
      'karma-webpack'
    ]
  })
}
