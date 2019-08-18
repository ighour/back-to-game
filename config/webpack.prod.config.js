const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new ZipPlugin({
            path: '../dist_zip',
            filename: 'backtohash.zip',
            exclude: [/\.gitkeep$/]
        })
    ]
});