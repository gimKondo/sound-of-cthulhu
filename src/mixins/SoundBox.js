const path = require('path')
const electron = require('electron')
const fs = electron.remote.require('fs')

export default {
  props: {
    context: AudioContext,
    filePath: String,
    volume: Number
  },
  data () {
    return {
      source: null,
      gainNode: null,
      isPlaying: false,
      isStarted: false,
      isVolumeControlOpened: false,
      decodedSoundBuffer: null
    }
  },
  created () {
    fs.readFile(this.filePath, (error, data) => {
      if (error) {
        console.error(error)
      }
      const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      this.context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
        this.decodedSoundBuffer = decodedSoundBuffer
        this.source = initializeSource(this.context, this.decodedSoundBuffer, this.loop)
        this.gainNode = initializeGainNode(this.context, this.volume)
        // source -> gainNode -> destination
        this.source.connect(this.gainNode)
        this.gainNode.connect(this.context.destination)
      }).then()
    })
  },
  methods: {
    removeSound () {
      this.$emit('remove-sound')
    },
    startSource (offset) {
      this.source.start(undefined, offset)
      this.isPlaying = true
    },
    stopSource () {
      this.source.stop()
      this.reloadSource()
      this.isPlaying = false
    },
    reloadSource () {
      this.source = initializeSource(this.context, this.decodedSoundBuffer, this.loop)
      this.source.connect(this.gainNode)
    },
    applyVolume (volume) {
      this.gainNode.gain.value = toRealVolume(volume)
      this.$emit('apply-volume', volume)
    },
    toggleVolumeControl () {
      this.isVolumeControlOpened = !this.isVolumeControlOpened
    }
  },
  computed: {
    name () {
      return path.basename(this.filePath, '.mp3')
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

function toRealVolume (percentValue) {
  return percentValue * 0.01
}
