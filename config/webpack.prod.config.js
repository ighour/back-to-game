const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 6,
                    module: true,
                    toplevel: true
                }
            }),
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
            filename: 'backtogame.zip',
            exclude: [/\.gitkeep$/]
        })
    ]
});