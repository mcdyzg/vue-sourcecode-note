var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        // 如果.babelrc里没有配置babel-plugin-transform-runtime(for async,generator)的话，这里需要用babel-polyfill,如果用到了，那么省略polyfill就好
        // app:['babel-polyfill','./src/main.js'],
        app:['./src/app/main.js'],
        // app2:['./src/app/main2.js'],
        // 一个项目有多个入口时，尽量把vue和vue-router这种的包配置成externals，方便多个项目共用一套vue包；然后把一个项目多个入口页面中的公共包放到common里，比如说axios这样的包，方便多个入口页面使用缓存，节省空间。
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        // “path”仅仅告诉Webpack结果存储在哪里，然而“publicPath”项则被许多Webpack的插件用于在生产模式下更新内嵌到css、html文件里的url值。
        //引入的图片地址公共路径：本地环境为根目录‘/’，正式环境为cdn地址
        publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                {
                    loader:'url-loader',
                    options: {
                        limit: 8192,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }
                ],

            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: ['url-loader']
            }
        ]
    },
    // 配置了externals的话，html里必须要配置包的cdn路径
    // externals: {
    //     // 设置后浏览器的vue-devtool不可用，因此开发时注释，上线时放开
    //     'vue': 'Vue',
    //     'vue-router':'VueRouter'
    // },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': path.resolve(__dirname, 'lib/vue/dist/vue.esm.js'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    devServer: {
        host:'0.0.0.0',
        port: 8082,                 //设置默认监听端口，如果省略，默认为8080
        historyApiFallback: true,   //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        // hot: true,                  //是否热部署
        quiet: false,               //让dev server处于静默的状态启动
        contentBase:'./test',
        stats: {
            colors: true, // color is life
            chunks: false, // this reduces the amount of stuff I see in my terminal; configure to your needs
            'errors-only': true
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins:[
        // new webpack.optimize.CommonsChunkPlugin({names: ['common'], minChunks: Infinity}),
        new webpack.DefinePlugin({
            __LOCAL__: true,                                  // 本地环境
            __PRO__:   false
        }),
    ]
}
