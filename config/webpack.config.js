const DotenvWebpackPlugin = require('dotenv-webpack');
const paths = require('./paths');

module.exports = env => {
  return {
    stats: 'errors-warnings',
    mode: 'production',
    bail: true,
    devtool: 'source-map',
    entry: {
      popup: {
        import: './src/popup/main.tsx',
        filename: 'popup/scripts/index.js',
      },
      background: {
        import: './src/scripts/background.ts',
        filename: 'scripts/background.js',
      },
      app: {
        import: './src/app/main.tsx',
        filename: 'scripts/app.js',
      },
    },
    output: {
      path: paths.appBuild,
      publicPath: paths.appBuild,
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
          test: /\.(ts|tsx)$/,
          include: paths.appSrc,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', 'solid'],
              },
            },
            {
              loader: 'ts-loader',
            },
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      new DotenvWebpackPlugin({
        path: '.env',
        safe: true,
      }),
    ],
  };
};
