const path = require('path')
const electron = require('electron')
const fs = electron.remote.require('fs')

export default {
  props: {
    filePath: String,
    volume: Number
  },
  data () {
    return {
      context: new AudioContext(),
      source: null,
      gainNode: null,
      isStarted: false,
      isVolumeControlOpened: false,
      decodedSoundBuffer: null
    }
  },
  created () {
    this.context.onstatechange = () => this.$forceUpdate()
    this.suspendSound()
    fs.readFile(this.filePath, (error, data) => {
      if (error) {
        console.error(error)
      }
      const arraySoundBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      this.context.decodeAudioData(arraySoundBuffer, (decodedSoundBuffer) => {
        this.decodedSoundBuffer = decodedSoundBuffer
        this.source = initializeSource(this.context, this.decodedSoundBuffer, this.loop)
        this.gainNode = initializeGainNode(this.context, this.volume)
        connectAll(this.context, this.source, this.gainNode)
      }).then()
    })
  },
  beforeDestroy () {
    this.context.close()
  },
  methods: {
    removeSound () {
      this.$emit('remove-sound')
    },
    resumeSound () {
      this.context.resume().then()
    },
    suspendSound () {
      this.context.suspend().then()
    },
    reloadSource () {
      this.source = initializeSource(this.context, this.decodedSoundBuffer, this.loop)
      connectAll(this.context, this.source, this.gainNode)
    },
    applyVolume (volume) {
      this.gainNode.gain.value = toRealVolume(volume)
      this.$emit('apply-volume', volume)
    },
    isPlaying () {
      return this.context.state === 'running'
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

function connectAll (context, source, gainNode) {
  source.connect(gainNode)
  gainNode.connect(context.destination)
}

function toRealVolume (percentValue) {
  return percentValue * 0.01
}
