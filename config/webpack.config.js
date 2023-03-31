import { realpathSync } from 'fs';
import path, { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const appDirectory = realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

export default {
  mode: 'production',
  entry: {
    popup: {
      import: resolveApp('src/popup/popup.tsx'),
      filename: 'popup/popup.js',
    },
    app: {
      import: resolveApp('src/app/app.tsx'),
      filename: 'scripts/app.js',
    },
    background: {
      import: resolveApp('src/scripts/background.ts'),
      filename: 'scripts/background.js',
    },
  },
  output: {
    path: resolveApp('build'),
    publicPath: resolveApp('build'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_moudles/,
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup/popup.html',
      template: resolveApp('src/popup/popup.html'),
      inject: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],
};
