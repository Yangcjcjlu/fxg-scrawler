const webpack = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

function root(args) {
    var _root = path.resolve(__dirname);
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

module.exports = {
    entry: {
        'crawler/gree.crawler': root('./src/crawler/gree.crawler.ts'),
        'crawler/gree-settlement.crawler': root('./src/crawler/gree-settlement.crawler.ts'),
        'crawler/gree-settlements.crawler': root('./src/crawler/gree-settlements.crawler.ts'),
        'crawler/gree-fitting.crawler': root('./src/crawler/gree-fitting.crawler.ts'),
        'crawler/gree-detail.crawler': root('./src/crawler/gree-detail.crawler.ts'),
        'crawler/gree-send.crawler': root('./src/crawler/gree-send.crawler.ts'),
        'crawler/gree-install-send.crawler': root('./src/crawler/gree-install-send.crawler.ts'),
        'crawler/gree-fitting-model.crawler': root('./src/crawler/gree-fitting-model.crawler.ts'),
        'crawler/gree-address.crawler': root('./src/crawler/gree-address.crawler.ts'),
        'crawler/gree-feedback.crawler': root('./src/crawler/gree-feedback.crawler.ts'),
        'crawler/gree-install.crawler': root('./src/crawler/gree-install.crawler.ts'),
        'crawler/gree-install-detail.crawler': root('./src/crawler/gree-install-detail.crawler.ts'),
        'crawler/gree-install-settlement.crawler': root('./src/crawler/gree-install-settlement.crawler.ts'),
        'crawler/gree-install-settlements.crawler': root('./src/crawler/gree-install-settlements.crawler.ts'),
        'crawler/midea-install-order.crawler': root('./src/crawler/midea-install-order.crawler.ts'),
        'crawler/midea-maintain-order.crawler': root('./src/crawler/midea-maintain-order.crawler.ts'),
        'crawler/daemon': root('./src/crawler/daemon.ts'),
        'pages/popup/popup': root('./src/pages/popup/popup.tsx'),
        'pages/main/main': root('./src/pages/main/main.tsx'),
    },
    output: {
        path: root('./dist'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: "initial"
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin('[name].css'),
        new CopyWebpackPlugin([
            {
                context: root('./src/assets'),
                from: "**",
                to: "assets",
                ignore: ['*.scss'],
            }
        ]),
        new CopyWebpackPlugin([
            {
                context: root('./src'),
                from: "**/*.html"
            }
        ]),
        new CopyWebpackPlugin([
            {
                context: root('./src'),
                from: "**/*.json"
            }
        ]),
    ]
};
