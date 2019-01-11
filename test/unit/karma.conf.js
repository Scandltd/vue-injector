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
        module: 'CommonJS',
        target: 'es5'
      },
      coverageOptions: {
        instrumentation: false
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
      'karma-coverage',
      'karma-es6-shim'
    ]
  })
}
