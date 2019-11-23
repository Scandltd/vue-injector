const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
const WebpackConfig = require('./webpack.config');
const configs = require('./configs');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

function getSize(size) {
  return `${(size / 1024).toFixed(2)}kb`;
}

function blue(str) {
  return `\x1b[1m\x1b[34m${str}\x1b[39m\x1b[22m`;
}

function write(dest, size, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      // eslint-disable-next-line no-console
      console.log(
        blue(path.relative(process.cwd(), dest)),
        ' ',
        getSize(size),
        (extra || '')
      );

      resolve();
    }

    if (zip) {
      zlib.gzip(fs.readFileSync(dest), (err, { length }) => {
        if (err) return reject(err);
        report(` (gzipped: ${getSize(length)})`);
      });
    }
  });
}

function build(builds) {
  builds.forEach((config) => {
    const mode = config.env === 'production';

    webpack({
      ...WebpackConfig,
      output: {
        ...WebpackConfig.output,
        libraryTarget: config.format,
        filename: config.file
      },
      optimization: {
        ...WebpackConfig.optimization,
        minimize: mode
      }
    }, (err, stats) => {
      const chank = stats.toJson().assets[0];
      write(path.join(__dirname, '..', 'dist', chank.name), chank.size, true);
    });
  });
}

build(configs);
