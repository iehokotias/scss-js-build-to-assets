const path = require('path');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const paths = {
  src: path.resolve(__dirname, './src'),
  build: path.resolve(__dirname, './assets'),
};

const names = {
  js: 'js/script.js',
  css: 'css/style.css',
};

const isProduction = process.env.NODE_ENV == 'production';

const options = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: names.css
  })
];

let minifyOptions = [];

if (isProduction) {
  minifyOptions = [
    new CssMinimizerPlugin({
      minify: CssMinimizerPlugin.cleanCssMinify,
    }),
  ];
}

const productionOptions = Object.assign(options, minifyOptions);

const config = {
  entry: {
    index: [paths.src + '/js/index.js'],
  },
  output: {
    path: paths.build,
    filename: names.js,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              exclude: './node_modules/',
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer', { grid: true }],
                  ['css-mqpacker', { sort: true }],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: isProduction ? productionOptions : options,
  target: 'web',
};

module.exports = () => {
  if (isProduction) config.mode = 'production';
  else config.mode = 'development';
  return config;
};
