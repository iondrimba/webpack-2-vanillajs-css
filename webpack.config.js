var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');
var isProduction = process.env.NODE_ENV == 'production';

var config = {
  devtool: 'source-map',
  context: __dirname,
  stats: 'errors-only',
  bail: true,
  cache: isProduction,
  watch: !isProduction,
  entry: {
    index: './src/js/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].js',
    publicPath: isProduction? '': 'http://localhost:9000/public',
  },
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'src/index.html')],
    historyApiFallback: true,
    hot: true,
    port: 9000,
    watchContentBase: !isProduction
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader', options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[local]'
            }
          },
          {
            loader: 'postcss-loader'
          }]
      },
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.html?$/,
        use: [
          'htmllint-loader',
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(jpg|svg|png|gif|jpeg)?$/,
        use: [
          'file-loader',
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2|woff)?$/,
        use: [
          'file-loader',
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      }
    ],
  },

  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.json', '.css']
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'css/[name].css', disable: !isProduction }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      context: __dirname,
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 4 version']
          })
        ]
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      }
    }),
    new CopyWebpackPlugin([
      { from: 'src/images', to: 'images' },
      { from: 'src/fonts/', to: 'fonts' },
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['common'],
      filename: 'js/webpack.js',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}

if (isProduction) {
  config.module.rules.shift();
  config.module.rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'postcss-loader']
    })
  })
  config.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }))
}

module.exports = config;
