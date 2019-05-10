import RemoveSound from '@/components/RemoveSound.vue'
import SoundBoxTitle from '@/components/SoundBoxTitle.vue'
import PlayingToggle from '@/components/PlayingToggle.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import ProgressTime from '@/components/ProgressTime.vue'
import PlayingIndicator from '@/components/PlayingIndicator.vue'

const path = require('path')
const electron = require('electron')
const fs = electron.remote.require('fs')

export default {
  components: {
    RemoveSound,
    SoundBoxTitle,
    PlayingToggle,
    VolumeControl,
    ProgressTime,
    PlayingIndicator
  },
  props: {
    filePath: String
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
    fs.readFile(this.filePath, (error, data) => {
      if (error) {
        console.error(error)
      }
      const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      this.context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
        this.source = initializeSource(this.context, decodedSoundBuffer, this.loop)
        this.gainNode = initializeGainNode(this.context, this.initialVolume)
        connectAll(this.context, this.source, this.gainNode)
      }).then()
    })
  },
  beforeDestroy () {
    this.context.close()
    clearInterval(this.intervalId)
  },
  methods: {
    removeSound () {
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
      this.gainNode.gain.value = toRealVolume(volume)
    },
    isPlaying () {
      return this.context.state === 'running'
    }
  },
  computed: {
    name () {
      return path.basename(this.filePath, '.mp3')
    },
    initialVolume () {
      return 50
    }
  }
}

function initializeSource (context, buffer, loop) {
  const source = context.createBufferSource()
  source.buffer = buffer
  source.loop = loop
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
