const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'playback-rate-plugin.js',
    library: 'PlaybackRatePlugin',
  },
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.html$/, use: ['html-loader'] },
      { test: /\.(gif)$/, use: ['file-loader'] },
    ]
  },
  devServer: {
    static: path.resolve(__dirname, 'public/'),
    compress: true,
    port: '8081',
  }
}
