const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'bundle.js',
    clean: true,
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devServer: {
    static: './dist',
    open: true,
    port:3001
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader','postcss-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
  ],
};