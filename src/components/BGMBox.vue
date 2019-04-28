<template>
  <div class="bgm-box">
    <v-card>
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
      <v-layout>
        <v-flex xs-3>
          <v-btn small fab color="grey darken-2">
            <v-icon @click="playSound" v-if="!isPlaying">play_arrow</v-icon>
            <v-icon @click="pauseSound" v-else>pause</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-progress-linear v-if="!isPlaying" :value="0"></v-progress-linear>
      <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
const path = require('path')
const context = new AudioContext()
const electron = require('electron')
const fs = electron.remote.require('fs')
export default {
  name: 'BGMBox',
  props: {
    filepath: String
  },
  data () {
    return {
      source: null,
      isStarted: false,
      isPlaying: false
    }
  },
  created () {
    fs.readFile(this.filepath, (error, data) => {
      if (error) {
        console.error(error)
      }
      const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
        const source = context.createBufferSource()
        source.buffer = decodedSoundBuffer
        source.connect(context.destination)
        this.source = source
      }).then()
    })
  },
  methods: {
    playSound () {
      if (!this.source) {
        return
      }
      if (this.isStarted) {
        context.resume().then()
      } else {
        this.source.start(0)
        this.isStarted = true
      }
      this.isPlaying = true
    },
    pauseSound () {
      context.suspend().then()
      this.isPlaying = false
    }
  },
  computed: {
    name: function () {
      return path.basename(this.filepath)
    }
  }
}
</script>

<style>
.bgm-box-title {
  background-color:darkslateblue;
  word-wrap: break-word;
}
</style>
