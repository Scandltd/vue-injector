/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
const express = require('express');
const rewrite = require('express-urlrewrite');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const fs = require('fs');
const path = require('path');
const WebpackConfig = require('./webpack.config');

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
}));

fs.readdirSync(__dirname).forEach((file) => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite(`/${file}/*`, `/${file}/index.html`));
  }
});

app.use(express.static(__dirname));

const port = process.env.PORT || 8080;
module.exports = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`);
});
