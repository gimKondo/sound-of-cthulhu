module.exports = {
  devServer: {
    port: 8081
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          target: 'portable'
        }
      }
    }
  }
}
