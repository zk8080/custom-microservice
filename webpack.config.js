const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'src/index.ts'),
    externals: ['react', 'react-router-dom'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'micro.js',
        library: 'root',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            browsers: ['safari >= 7', 'ie >= 8', 'chrome >= 43']
                                        }
                                    }
                                ],
                                '@babel/preset-react'
                            ],
                            plugins: [
                                ['@babel/plugin-transform-runtime', {corejs: 3}],
                                ['@babel/plugin-proposal-class-properties', {loose: true}]
                            ]
                        }
                    },
                    'ts-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
