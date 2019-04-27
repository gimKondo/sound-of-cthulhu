<template>
  <div class="bgm-box">
    <v-card v-on:click="playSound">
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
      <v-icon v-if="!playing">play_arrow</v-icon>
      <v-icon v-else>pause</v-icon>
    </v-card>
  </div>
</template>

<script>
const context = new AudioContext()
const electron = require('electron')
const fs = electron.remote.require('fs')
export default {
  name: 'BGMBox',
  props: {
    name: String
  },
  data () {
    return {
      playing: false
    }
  },
  methods: {
    playSound () {
      fs.readFile('public/bgm_sample.mp3', (error, data) => {
        if (error) {
          console.error(error)
        }
        const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
        context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
          const source = context.createBufferSource()
          source.buffer = decodedSoundBuffer
          source.connect(context.destination)
          source.start(0)
          this.playing = true
        }).then()
      })
    }
  }
}
</script>

<style>
.bgm-box-title {
  background-color:darkslateblue
}
</style>
