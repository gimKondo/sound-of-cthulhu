module.exports = {
  devServer: {
    port: 8081
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        mac: {
          icon: 'build/icon.png'
        }
      }
    }
  }
}
