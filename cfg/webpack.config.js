const {resolve} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const ROOT_PATH = resolve(__dirname,'../')
const SRC_PATH = resolve(__dirname,'../src')
const LIBS_PATH = resolve(__dirname,'../libs')
const DIST_PATH = resolve(SRC_PATH,'dist')
const TEM_PATH = resolve(LIBS_PATH,'templete')

const port = '4700'

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        index: resolve(SRC_PATH, 'index.jsx')
    },
    output: {
        path: DIST_PATH,
        filename: '[name].js'
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)?$/,
                include: SRC_PATH,
                use: ['happypack/loader?id=babel'],
            },
            {
                test: /\.(css|scss)?$/,
                include: ROOT_PATH,
                use: ['happypack/loader?id=scss'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|svgz)?$/,
                include: SRC_PATH,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'image/[name]-[contenthash].[ext]'
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
        extensions: ['.js', '.jsx', '.json', '.scss']
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new HappyPack({
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
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            title: '后台管理',
            keywords: '后台管理',
            description: '后台管理',
            favicon:resolve(SRC_PATH,'favicon.ico'),
            filepath: DIST_PATH,
            template: resolve(TEM_PATH, 'tpl.html'),
            chunks: ['index'],
            filename: 'index.html',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.BABEL_ENV': JSON.stringify('development')
        }),
        new OpenBrowserPlugin({ url: `http://0.0.0.0:${port}` })
    ],
    watchOptions: {
        // 4-5使用自动刷新：不监听的 node_modules 目录下的文件
        ignored: /node_modules/,
    },
    devServer:{
        inline: true,
        hot: true,
        historyApiFallback: true,
        contentBase: ROOT_PATH,
        host: '0.0.0.0',
        port: port,
        proxy: [{
            context: ['/chat/*'],
            target: 'http://localhost:4003',
            host:'0.0.0.0',
            changeOrigin: true,
            ws: true,
            secure: false
        }]
    }
}