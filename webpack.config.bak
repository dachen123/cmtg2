var webpack = require('webpack')
var path = require('path')

var CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
    entry: './static/web/js/create_index.js',
    output: {
        path: path.resolve(__dirname, './static/web/dist'),
        publicPath: '/static/web/dist/',
        filename: 'create_index.js'
    },
    resolve: {
        extensions: ['.css', '.js', '.vue'],

        alias: {
            'vue$': 'vue/dist/vue.common.js',
        }
    },
    module: {
        rules:[
        {test: /\.css$/, loader: 'style-loader!css-loader'},

        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                    // the "scss" and "sass" values for the lang attribute to the right configs here.
                    // other preprocessors should work out of the box, no loader config like this nessessary.
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                }
                         // other vue-loader options go here
            }
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }

        ]
    },
    devtool: '#source-map',
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   comments: false,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true
    // }),
     // new webpack.optimize.CommonsChunkPlugin({name:'vendor',  filename:'vendor.bundle.js'}),
    // new CompressionWebpackPlugin({ 
    //     asset: '[path].gz[query]',
    //     algorithm: 'gzip',
    //     test: new RegExp(
    //         '\\.(js|css)$'   
    //     ),
    //     threshold: 10240,
    //     minRatio: 0.8
    // })
        
    
    ]
}
