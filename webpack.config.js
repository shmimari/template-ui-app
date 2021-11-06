/* eslint-disable no-useless-escape */
require('dotenv').config();
const { join, resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const outputPath = join(__dirname, 'dist');
const devMode = process.env.NODE_ENV !== 'production';

const mode = devMode ? 'development' : 'production';
const devtool = devMode ? 'inline-cheap-module-source-map' : 'source-map';

const config = {
    mode,
    devtool,
    devServer: {
        port: process.env.PORT || 3000
    },
    entry: {
        app: ['./src/index.tsx']
    },

    output: {
        filename: '[name].js',
        path: outputPath,
        devtoolModuleFilenameTemplate: ({ absoluteResourcePath }) => resolve(absoluteResourcePath),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false }
                    }
                ]
            }
        ]
    },
    plugins: [new CleanWebpackPlugin()]
};

if (devMode) {
    Object.keys(config.entry).forEach((key) => {
        config.entry[key].unshift('webpack-hot-middleware/client?reload=true');
    });
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
}
module.exports = config;
