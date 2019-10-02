const {resolve, join} = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const os = require('os')
const HappyPack = require('happypack')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const rimraf = require('rimraf')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const ROOT_PATH = resolve(__dirname,'../')
const SRC_PATH = resolve(__dirname,'../src')
const LIBS_PATH = resolve(__dirname,'../libs')
const DIST_PATH = resolve(__dirname,'../dist')
const TEM_PATH = resolve(LIBS_PATH,'templete')
const DLL_PATH = resolve(__dirname,'../pub/shop/common')
const NODE_PATH = resolve(__dirname,'../node_modules')

// const bundleConfig = require("../pub/shop/common/bundle-config.json")
rimraf.sync('./dist')
module.exports = {
    // devtool: 'source-map',
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
        ],
        index: resolve(SRC_PATH, 'index.jsx')
    },
    output: {
        path: DIST_PATH,
        filename: 'js/[name]-[chunkhash:8].js',
        chunkFilename: 'js/[name]-[chunkhash:8].js',
        publicPath: '/static/admin/dist/'
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)?$/,
                include: SRC_PATH,
                use: ['happypack/loader?id=babel'],
            },
            {
                test: /\.(scss|css)?$/,
                include: [SRC_PATH,LIBS_PATH,resolve(NODE_PATH,'antd')],
                use:ExtractTextPlugin.extract({
                    fallback:['style-loader'],
                    use: ['happypack/loader?id=scss'],
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|svgz)?$/,
                include: SRC_PATH,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'image/[name]-[hash].[ext]'
                        }
                    },
                    {
                        loader:'image-webpack-loader',
                        options: {
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // Specifying webp here will create a WEBP version of your JPG/PNG images
                            webp: {
                                quality: 75
                            }
                        } 
                    }
                    
                ]
            }
        ]

    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss'],
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        modules: [NODE_PATH],
        // // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
        // mainFields: ['jsnext:main', 'main'],
        // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
        // mainFields: ['jsnext:main', 'browser', 'main']
    },
    plugins:[
         new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.BABEL_ENV': JSON.stringify('production')
        }),
        new CleanWebpackPlugin([DIST_PATH]),
        new ManifestPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CommonsChunkPlugin({
            name: 'vendors',
            filename: 'js/[name]-[chunkhash:8].js'
        }),
        new CommonsChunkPlugin({
            name: 'manifest',
            filename: 'js/[name]-[chunkhash:8].js'
        }),
        // 4-3使用HappyPack
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
            loaders: ['babel-loader?cacheDirectory'],
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            // 如何处理 .css 文件，用法和 Loader 配置中一样
            // 通过 minimize 选项压缩 CSS 代码
            // loaders: ['css-loader?minimize'],
            loaders: [
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }),
        new ExtractTextPlugin({
            filename: 'css/[name]-[contenthash:8].css',
            disable: false,
            allChunks: true
        }),
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            cacheDir: '.cache/babel-loader',
            uglifyJS: {
              output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
              },
              compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
              }
            },
        }),
        new HtmlWebpackPlugin({
            title: '后台管理',
            keywords: '后台管理',
            description: '后台管理',
            favicon:resolve(SRC_PATH,'favicon.ico'),
            filepath: DIST_PATH,
            template: resolve(TEM_PATH, 'tpl.html'),
            filename: 'index.html',
            inject: true
        }),
        // new webpack.DllReferencePlugin({
        //     context: DLL_PATH,
        //     manifest: require('../pub/shop/common/vendors-manifest.json'),
        // })
    ],
}