var webpack = require('webpack')
var path = require('path')

var CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
    entry: {
        create_index:'./static/web/js/create_index.js',
        create_project:'./static/web/js/create_project.js',
        create_company:'./static/web/js/create_company.js',
        company_info:'./static/web/js/company_info.js',
        create_index:'./static/web/js/create_index.js',
        edit_project:'./static/web/js/edit_project.js',
        edit_user:'./static/web/js/edit_user.js',
        homepage:'./static/web/js/homepage.js',
        line_chart:'./static/web/js/line_chart.js',
        project_info:'./static/web/js/project_info.js',
        event_list:'./static/web/js/event_list.js',
        upload_excel:'./static/web/js/upload_excel.js',
    },
    output: {
        path: path.resolve(__dirname, './static/web/dist'),
        publicPath: '/static/web/dist/',
        filename: '[name].js'
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
