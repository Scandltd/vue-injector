module.exports = [
  // browser dev
  {
    file: 'vue-injector.js',
    format: 'umd',
    env: 'development'
  },
  {
    file: 'vue-injector.min.js',
    format: 'umd',
    env: 'production'
  },
  {
    file: 'vue-injector.common.js',
    format: 'commonjs'
  },
  {
    file: 'vue-injector.esm.js',
    format: 'commonjs-module'
  }
];
