require('babel-core/register');
require('babel-polyfill');

const path = require('path');
const src = path.resolve(__dirname, 'src');
const docs = path.resolve(__dirname, 'docs');

module.exports = {
  entry: [src + '/main.jsx'],
  output: {
    path: docs,
    filename: '[name].bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: docs,
    disableHostCheck: true
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss$)/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(svg|otf|jpg|png|ttf|woff2?)$/,
        loader: 'url-loader'
      },
      {
        test: /\.glsl$/,
        loader: 'glsl-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(txt)$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};
