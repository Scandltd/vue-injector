/* const webpackConfig = {
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
      '**!/!*.spec.js'
    ],
    preprocessors: {
      '**!/!*.spec.js': ['webpack']
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
}*/

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['es6-shim', 'jasmine', 'karma-typescript'],
    client: {
      // leave Jasmine Spec Runner output visible in browser
      clearContext: false
    },
    files: [
      { pattern: '../../src/**/*.+(js|ts)' },
      { pattern: '../../test/**/*.spec.+(js|ts)' }
    ],
    preprocessors: {
      '../../src/**/*.+(js|ts)': ['karma-typescript'],
      '../../test/**/*.spec.+(js|ts)': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      tsconfig: '../../tsconfig.json',
      compilerOptions: {
        module: 'CommonJS'
      }
    },
    reporters: ['mocha', 'karma-typescript'],
    colors: true,
    singleRun: true,
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
      'karma-typescript',
      'karma-es6-shim'
    ]
  })
}
