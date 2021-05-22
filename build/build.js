const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
const WebpackConfig = require('./webpack.config');
const configs = require('./configs');

if (fs.existsSync('dist')) {
  fs.rmdirSync('dist', { recursive: true });
}

fs.mkdirSync('dist');

function getSize(size) {
  return `${(size / 1024).toFixed(2)}kb`;
}

function blue(str) {
  return `\x1b[1m\x1b[34m${str}\x1b[39m\x1b[22m`;
}

function write(dest, zip) {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(dest);

    function report(extra) {
      // eslint-disable-next-line no-console
      console.log(
        blue(path.relative(process.cwd(), dest)),
        ' ',
        getSize(file.byteLength),
        (extra || '')
      );

      resolve();
    }

    if (zip) {
      zlib.gzip(file, (err, { length }) => {
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
      if (err) console.error(err);

      const json = stats.toJson();

      if (json.errors.length) console.error(json.errors);

      const { chunks: [chank] } = json;

      write(path.join(__dirname, '..', 'dist', chank.files[0]), true);
    });
  });
}

build(configs);
