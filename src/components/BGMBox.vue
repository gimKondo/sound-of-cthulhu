<template>
  <div class="bgm-box">
    <v-card>
      <v-layout class="bgm-box-title">
        <v-flex xs1>
          <v-icon @click="removeBGM">clear</v-icon>
        </v-flex>
        <v-flex xs11>
          <v-card-title class="font-weight-bold">{{name}}</v-card-title>
        </v-flex>
      </v-layout>
      <div>メモ</div>
      <v-layout>
        <v-flex xs2>
          <PlayingToggle
            v-if="source"
            :isPlaying="isPlaying()"
            @play-sound="playSound"
            @pause-sound="pauseSound"
          ></PlayingToggle>
        </v-flex>
        <v-flex xs10>
          <VolumeControl
            v-if="source"
            :value="initialVolume"
            @input="applyVolume"
          ></VolumeControl>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <ProgressTime
            v-if="source"
            :currentTime="currentTime"
            :endTime="source.buffer.duration"
          ></ProgressTime>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <PlayingIndicator
            :isPlaying="isPlaying()"
          ></PlayingIndicator>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import PlayingToggle from '@/components/PlayingToggle.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import ProgressTime from '@/components/ProgressTime.vue'
import PlayingIndicator from '@/components/PlayingIndicator.vue'

const path = require('path')
const electron = require('electron')
const fs = electron.remote.require('fs')

export default {
  name: 'BGMBox',
  components: {
    PlayingToggle,
    VolumeControl,
    ProgressTime,
    PlayingIndicator
  },
  props: {
    filepath: String
  },
  data () {
    return {
      context: new AudioContext(),
      source: null,
      gainNode: null,
      isStarted: false,
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
        this.source = this.initializeSource(this.context, decodedSoundBuffer)
        this.gainNode = this.initializeGainNode(this.context, this.initialVolume)
        this.connectAll(this.context, this.source, this.gainNode)
      }).then()
    })
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    removeBGM () {
      this.$emit('remove-sound')
    },
    playSound () {
      this.context.resume().then(() => this.$forceUpdate())
      if (!this.isStarted) {
        this.source.start(0)
        this.isStarted = true
      }
      this.intervalId = setInterval(() => {
        this.currentTime = this.context.currentTime
      }, 200)
      this.$emit('play-sound')
    },
    pauseSound () {
      this.context.suspend().then(() => this.$forceUpdate())
      clearInterval(this.intervalId)
    },
    applyVolume (volume) {
      this.gainNode.gain.value = this.toRealVolume(volume)
    },
    initializeSource (context, buffer) {
      const source = context.createBufferSource()
      source.buffer = buffer
      source.loop = true
      return source
    },
    initializeGainNode (context, volume) {
      const gainNode = context.createGain()
      gainNode.gain.value = this.toRealVolume(volume)
      return gainNode
    },
    connectAll (context, source, gainNode) {
      source.connect(gainNode)
      gainNode.connect(context.destination)
    },
    toRealVolume (percentValue) {
      return percentValue * 0.01
    },
    isPlaying () {
      return this.context.state === 'running'
    }
  },
  computed: {
    name () {
      return path.basename(this.filepath, '.mp3')
    },
    initialVolume () {
      return 50
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
