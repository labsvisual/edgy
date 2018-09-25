import path from 'path';
import info from './package.json';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const config = {

    mode: process.env.NODE_ENV || 'development',
    devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-cheap-module-source-map',
    entry: [ '@babel/polyfill', path.join( __dirname, './lib/index.js' ) ],
    output: {
        path: path.join( __dirname, 'build' ),
        filename: `edgy-build-${ info.version }-browser.js`
    },
    optimization: {
        minimizer: [ new UglifyJsPlugin() ]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }

};

export default config;
