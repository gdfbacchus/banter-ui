const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const StartServerPlugin = require('start-server-webpack-plugin');
const paths = require('../scripts/paths');
const { MATCH_JS, MATCH_CSS_LESS, DEFINE_PLUGIN } = require('./configUtils');
console.log("DEFINE_PLUGIN: ",DEFINE_PLUGIN);
module.exports = function createConfig(env = 'dev') {
  const IS_DEV = env === 'dev';

  console.log("WEBPACK SERVER -> env: ", env);
  console.log("WEBPACK SERVER -> IS_DEV: ", IS_DEV);
  console.log("WEBPACK SERVER -> paths.build: ", paths.build);

  const config = {
    mode: IS_DEV ? 'development' : 'production',
    target: 'node',
    entry: [paths.server],
    output: {
      path: paths.build,
      filename: 'server.js',
    },
    context: process.cwd(),
    externals: fs
      .readdirSync(path.resolve(paths.app, 'node_modules'))
      .map(module => ({ [module]: `commonjs ${module}` }))
      .reduce((a, b) => Object.assign({}, a, b), {}),
    node: {
      __filename: true,
      __dirname: true,
    },
    module: {
      rules: [
        {
          test: MATCH_JS,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react', 'stage-2'],
              plugins: ['transform-decorators-legacy', 'transform-runtime', 'dynamic-import-node'],
              cacheDirectory: true,
            },
          },
        },
      ],
    },
    plugins: [
      DEFINE_PLUGIN,
      new webpack.NormalModuleReplacementPlugin(MATCH_CSS_LESS, 'identity-obj-proxy'),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new WebpackBar({
        name: 'server',
        color: '#c065f4',
      }),
    ],
  };

  if (IS_DEV) {
    config.entry = ['webpack/hot/poll?300', ...config.entry];
    config.plugins = [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin([paths.assets]),
      new StartServerPlugin({
        name: 'server.js',
      }),
    ];
  }

  return config;
};
