const path = require('path')
const buble = require('rollup-plugin-buble')
const typescript = require('rollup-plugin-typescript')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/*!
  * @scandltd/vue-injector v${version}
  * (c) ${new Date().getFullYear()} Scandltd
  * @license GPL-2.0
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  // browser dev
  {
    file: resolve('dist/vue-injector.js'),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve('dist/vue-injector.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve('dist/vue-injector.common.js'),
    format: 'cjs'
  },
  {
    file: resolve('dist/vue-injector.esm.js'),
    format: 'es'
  }
].map(genConfig)

function genConfig (opts) {
  const config = {
    input: {
      input: resolve('src/index.ts'),
      plugins: [
        typescript(),
        babel({
          babelrc: false,
          presets: [['env', { modules: false }]],
          exclude: 'node_modules/**',
          plugins: [
            'syntax-dynamic-import',
            'transform-decorators-legacy',
            'transform-class-properties',
            'external-helpers'
          ]
        }),
        node(),
        cjs(),
        replace({
          __VERSION__: version
        }),
        buble()
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueInjector'
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}
