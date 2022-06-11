const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const path = require('path');
const paths = require('./paths');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;

module.exports = env => {
    const getStyleLoaders = (cssOptions, preProcessor) => {
        const loaders = [
            {
                loader: MiniCssExtractPlugin.loader,
                options: { publicPath: '../../' },
            },
            {
                loader: require.resolve('css-loader'),
                options: cssOptions,
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        ident: 'postcss',
                        config: false,
                        plugins: [
                            'postcss-flexbugs-fixes',
                            [
                                'postcss-preset-env',
                                {
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                },
                            ],
                            'postcss-normalize',
                        ],
                    },
                    sourceMap: shouldUseSourceMap,
                },
            },
        ].filter(Boolean);
        if (preProcessor) {
            loaders.push(
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: shouldUseSourceMap,
                        root: paths.appSrc,
                    },
                },
                {
                    loader: require.resolve(preProcessor),
                    options: {
                        sourceMap: true,
                    },
                }
            );
        }
        return loaders;
    };

    return {
        stats: 'errors-warnings',
        mode: 'production',
        bail: true,
        devtool: 'source-map',
        entry: {
            content: './src/scripts/content.ts',
            background: './src/scripts/background.ts',
        },
        output: {
            filename: 'scripts/[name].js',
            path: paths.appBuild,
            publicPath: paths.appBuild,
        },
        // optimization: {
        //     minimize: true,
        //     minimizer: [
        //         new TerserPlugin({
        //             terserOptions: {
        //                 parse: {
        //                     ecma: 8,
        //                 },
        //                 compress: {
        //                     ecma: 5,
        //                     warnings: false,
        //                     comparisons: false,
        //                     inline: 2,
        //                 },
        //                 mangle: {
        //                     safari10: true,
        //                 },
        //                 keep_classnames: true,
        //                 keep_fnames: true,
        //                 output: {
        //                     ecma: 5,
        //                     comments: false,
        //                     ascii_only: true,
        //                 },
        //             },
        //         }),
        //         // This is only used in production mode
        //         new CssMinimizerPlugin(),
        //     ],
        // },
        resolve: {
            modules: ['node_modules', paths.appNodeModules],
            alias: {
                '@': path.resolve(__dirname, '../src'),
            },
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: require.resolve('source-map-loader'),
                },
                {
                    oneOf: [
                        {
                            test: /\.ts$/,
                            include: paths.appSrc,
                            use: 'ts-loader',
                        },
                        // {
                        //     test: /\.(js|mjs)$/,
                        //     exclude: /@babel(?:\/|\\{1,2})runtime/,
                        //     loader: require.resolve('babel-loader'),
                        //     options: {
                        //         babelrc: false,
                        //         configFile: false,
                        //         compact: false,
                        //         cacheDirectory: true,
                        //         cacheCompression: false,
                        //         sourceMaps: shouldUseSourceMap,
                        //         inputSourceMap: shouldUseSourceMap,
                        //     },
                        // },
                        // {
                        //     test: cssRegex,
                        //     use: getStyleLoaders({
                        //         importLoaders: 1,
                        //         sourceMap: shouldUseSourceMap,
                        //         modules: {
                        //             mode: 'icss',
                        //         },
                        //     }),
                        //     sideEffects: true,
                        // },
                        // {
                        //     test: sassRegex,
                        //     use: getStyleLoaders(
                        //         {
                        //             importLoaders: 3,
                        //             sourceMap: shouldUseSourceMap,
                        //             modules: {
                        //                 mode: 'icss',
                        //             },
                        //         },
                        //         'sass-loader'
                        //     ),
                        //     sideEffects: true,
                        // },
                        {
                            exclude: [
                                /^$/,
                                /\.(js|mjs|jsx|ts|tsx)$/,
                                /\.html$/,
                                /\.json$/,
                            ],
                            type: 'asset/resource',
                        },
                    ],
                },
            ].filter(Boolean),
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
    };
};
