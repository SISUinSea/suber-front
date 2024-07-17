const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    host: 'localhost',
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
  publicPath: '/'
});