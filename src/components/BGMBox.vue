<template>
  <div class="bgm-box">
    <v-card>
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
      <v-icon large @click="playSound" v-if="!isPlaying">play_circle_outline</v-icon>
      <v-icon large @click="pauseSound" v-else>pause_circle_outline</v-icon>
    </v-card>
    <p v-if="isNowPlaying">再生中</p>
    <p v-else>停止</p>
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
    filepath: String,
    nowBgm: String
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
      this.$emit('play-event', this.filepath)
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
    },
    isNowPlaying: function () {
      return this.filepath === this.nowBgm
    }
  }
}
</script>

<style>
.v-icon {
  padding: 4px
}
.bgm-box-title {
  background-color:darkslateblue;
  word-wrap: break-word;
}
</style>
