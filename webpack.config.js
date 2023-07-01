const path = require('path');
const EslingPlugin = require('eslint-webpack-plugin');

module.exports = {
    target: "node",
    entry: {
        'server': path.resolve(__dirname, './src/server.ts'),
        'cluster': path.resolve(__dirname, './src/cluster.ts')
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './dist'),
        assetModuleFilename: pathData => {
            const filepath = path.dirname(pathData.filename).split('/').slice(1).join('/');
            return `${filepath}/[name][ext]`;
        },
    },
    module: {
        rules: [
            { test: /\.ts$/i, use: 'ts-loader' }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new EslingPlugin({ extensions: 'ts' })
    ],
};