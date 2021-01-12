const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {

    mode: 'production',

    entry: {
        // "bubble-spinner": path.join(__dirname, './game'),
        "bubble-spinner.min": path.join(__dirname, './game')
    },

    target: "es5",

    module: {
        rules: [{
            test: /libs/,
            use: 'null-loader'
        }, {
            test: /\.(j|t)sx?$/,
            exclude: [/node_modules/],
            use: {
                loader: "babel-loader",
            }
        }],
    },

    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js'
    },

    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                include: /\.min\.js$/,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    compress: true,
                    ie8: false,
                    ecma: 5,
                    output: { comments: false },
                    warnings: false
                },
                warningsFilter: () => false
            })
        ]
    },

    plugins: [
        new CleanWebpackPlugin()
    ],
}
