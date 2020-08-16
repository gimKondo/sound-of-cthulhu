module.exports = {
  devServer: {
    port: 8081
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        asar: false,
        asarUnpack: [
          'node_modules/ffmpeg-static'
        ],
        extraFiles: {
          'from': 'node_modules/ffmpeg-static',
          'to': './Resources/app/node_modules/ffmpeg-static/',
          'filter': ['**/*']
        },
        win: {
          target: 'portable'
        }
      },
      externals: ['discord.js']
    }
  }
}
