<template>
  <div class="bgm-box">
    <v-card>
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
      <v-layout>
        <v-flex xs2>
          <v-btn @click="togglePlaying" small fab color="grey darken-2">
            <v-icon v-if="!isPlaying">play_arrow</v-icon>
            <v-icon v-else>pause</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs10>
          <v-slider append-icon="volume_up" prepend-icon="volume_down" v-model="volume" @change="applyVolume"></v-slider>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-chip>{{progressTimeText()}}</v-chip>
      </v-layout>
      <v-progress-linear v-if="!isPlaying" :value="0"></v-progress-linear>
      <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
const path = require('path')
const electron = require('electron')
const fs = electron.remote.require('fs')
function initializeSource (context, buffer) {
  const source = context.createBufferSource()
  source.buffer = buffer
  source.loop = true
  return source
}
function initializeGainNode (context, volume) {
  const gainNode = context.createGain()
  gainNode.gain.value = toRealVolume(volume)
  return gainNode
}
function connectAll (context, source, gainNode) {
  source.connect(gainNode)
  gainNode.connect(context.destination)
}
function toRealVolume (percentValue) {
  return percentValue * 0.01
}
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
      source: null,
      gainNode: null,
      isStarted: false,
      volume: 50,
      currentTime: 0,
      intervalId: null
    }
  },
  created () {
    this.context.suspend().then()
    fs.readFile(this.filepath, (error, data) => {
      if (error) {
        console.error(error)
      }
      const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      this.context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
        this.source = initializeSource(this.context, decodedSoundBuffer)
        this.gainNode = initializeGainNode(this.context, this.volume)
        connectAll(this.context, this.source, this.gainNode)
      }).then()
    })
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    togglePlaying () {
      if (!this.source) {
        return
      }
      if (this.isPlaying) {
        this.$emit('play-sound', null)
        this.pauseSound()
      } else {
        this.$emit('play-sound', this.filepath)
        this.playSound()
      }
    },
    playSound () {
      this.context.resume().then()
      if (!this.isStarted) {
        this.source.start(0)
        this.isStarted = true
      }
      this.intervalId = setInterval(() => {
        this.currentTime = this.context.currentTime
      }, 200)
    },
    pauseSound () {
      this.context.suspend().then()
      clearInterval(this.intervalId)
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
    },
    applyVolume () {
      if (!this.gainNode) {
        return
      }
      this.gainNode.gain.value = toRealVolume(this.volume)
    }
  },
  computed: {
    name () {
      return path.basename(this.filepath)
    },
    isPlaying () {
      const isCurrent = this.filepath === this.currentBGM
      if (!isCurrent) {
        this.pauseSound()
      }
      return isCurrent
    },
    endTime () {
      if (!this.source) {
        return 0
      }
      return this.source.buffer.duration;
    }
  }
}
</script>

<style>
.v-slider {
  margin-left: 8px;
  margin-right: 8px;
}
.v-input--slider {
  margin-left: 8px;
  margin-right: 8px;
}
.v-input--slider .v-input__slot {
  margin-bottom: 0;
}
.v-progress-linear {
  margin: 0;
}
.bgm-box-title {
  background-color:darkslateblue;
  word-wrap: break-word;
}
</style>
