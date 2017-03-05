var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/js/app.js"
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "",
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 9000,
    watchContentBase: true
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: [
          path.resolve(__dirname, "node_modules")
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader", options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[local]'
            }
          }]
      },
      {
        test: "\.html$",
        use: [
          "htmllint-loader",
          {
            loader: "html-loader"
          }
        ]
      }
    ],
  },

  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [".js", ".json", ".css"]
  },
  devtool: "source-map",
  context: __dirname,
  stats: "errors-only",
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["common"],
      filename: "webpack.js",
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: true
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("1"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object")
    })
  ],
  bail: true,
  cache: false,
  watch: true,
}
