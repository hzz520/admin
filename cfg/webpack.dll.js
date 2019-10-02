const {resolve, join} = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

const DIST_PATH = resolve(__dirname,'../pub/shop')
const DLL_PATH = resolve(__dirname,'../pub/shop/common')
module.exports = {
  entry: {
    vendors: [
        'axios',
        'superagent',
        'lodash',
        'qs',
        'babel-polyfill',
        'react',
        'react-dom',
        'react-redux',
        'react-router',
        'react-router-redux',
        'redux'
    ]
  },
  output: {
      path: DLL_PATH,
      filename: '[name]-[chunkhash:8].js',
      library: '[name]_library'
  },
  plugins: [
    new CleanWebpackPlugin([DLL_PATH], {
        root: DIST_PATH,
        verbose: true,
        dry: false,
    }),
    new webpack.DllPlugin({
        path: resolve(DLL_PATH, './[name]-manifest.json'),
        name: '[name]_library',
        context: DLL_PATH
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json', 
      path: DLL_PATH
  }),
  ]
}