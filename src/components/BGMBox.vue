<template>
  <div class="bgm-box">
    <v-card>
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
      <v-layout>
        <v-flex xs-3>
          <v-btn @click="togglePlaying" small fab color="grey darken-2">
            <v-icon v-if="!isPlaying">play_arrow</v-icon>
            <v-icon v-else>pause</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs-9>
          <v-card-text class="subheading">{{progressTimeText()}}</v-card-text>
        </v-flex>
      </v-layout>
      <v-progress-linear v-if="!isPlaying" :value="0"></v-progress-linear>
      <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
    </v-card>
    <p v-if="isNowPlaying">再生中</p>
    <p v-else>停止</p>
  </div>
</template>

<script>
const path = require('path')
const electron = require('electron')
const fs = electron.remote.require('fs')
export default {
  name: 'BGMBox',
  props: {
    // Now, BGM is indentified by file path.
    // `currentBGM` is current BGM's file path
    filepath: String,
    currentBGM: String
  },
  data () {
    return {
      context: new AudioContext(),
      isStarted: false,
      isPlaying: false,
      currentTime: 0,
      endTime: 0,
      intervalId: null
    }
  },
  created () {
    fs.readFile(this.filepath, (error, data) => {
      if (error) {
        console.error(error)
      }
      const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      this.context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
        const source = this.context.createBufferSource()
        source.buffer = decodedSoundBuffer
        source.connect(this.context.destination)
        source.loop = true
        this.endTime = source.buffer.duration
        this.context.source = source
        this.context.suspend()
      }).then()
    })
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    togglePlaying () {
      if (this.isPlaying) {
        this.pauseSound()
      } else {
        this.playSound()
      }
    },
    playSound () {
      this.$emit('play-event', this.filepath)
      if (!this.context.source) {
        return
      }
      this.context.resume().then()
      if (!this.isStarted) {
        this.context.source.start(0)
        this.isStarted = true
      }
      this.intervalId = setInterval(() => {
        this.currentTime = this.context.currentTime
      }, 200)
      this.isPlaying = true
    },
    pauseSound () {
      this.context.suspend().then()
      clearInterval(this.intervalId)
      this.isPlaying = false
    },
    progressTimeText () {
      const pad2Zero = (value) => {
        return ('00' + value).slice(-2)
      }
      const convert = (time) => {
        return `${pad2Zero(Math.floor(time / 60))}:${pad2Zero(Math.floor(time % 60))}`
      }
      const currentLoopTime = this.endTime !== 0 ? this.currentTime % this.endTime : 0
      return `${convert(currentLoopTime)} / ${convert(this.endTime)}`
    }
  },
  computed: {
    name: function () {
      return path.basename(this.filepath)
    },
    isNowPlaying: function () {
      return this.filepath === this.currentBGM
    }
  }
}
</script>

<style>
.v-progress-linear {
  margin: 0;
}
.bgm-box-title {
  background-color:darkslateblue;
  word-wrap: break-word;
}
</style>
