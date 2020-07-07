const path = require('path')
const electron = require('electron')
const { ipcRenderer } = require('electron')
const fs = electron.remote.require('fs')

export default {
  props: {
    context: AudioContext,
    channelSplitter: ChannelSplitterNode,
    filePath: String,
    volume: Number
  },
  data () {
    return {
      source: null,
      gain: null,
      isPlaying: false,
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
        this.gain = initializeGainNode(this.context, this.volume)
        // Source -> Gain -> ChannelSplitter
        this.source.connect(this.gain)
        this.gain.connect(this.channelSplitter)
      }).then()
    })
  },
  methods: {
    removeSound () {
      this.$emit('remove-sound')
    },
    startSource (offset) {
      if (this.context.deviceId != 'Discord API') {
	this.source.start(undefined, offset)
      } else {
	ipcRenderer.send('discordPlay', {filePath: this.filePath, volume: this.volume, offset: offset} ) 
      }
      this.isPlaying = true
    },
    stopSource () {
      if (this.context.deviceId != 'Discord API') {
	this.source.stop()
	this.reloadSource()
      } else {
	ipcRenderer.send('discordStop', {filePath: this.filePath})
      }
      this.isPlaying = false
    },
    reloadSource () {
      if (this.context.deviceId != 'Discord API') {
	this.source = initializeSource(this.context, this.decodedSoundBuffer, this.loop)
	this.source.connect(this.channelSplitter)
      }
    },
    applyVolume (volume) {
      if (this.context.deviceId != 'Discord API') {
	this.gain.gain.value = toRealVolume(volume)
      } else {
	this.$emit('apply-volume', volume)
	ipcRenderer.send('discordSoundChange', {'filePath': this.filePath, 'volume': this.volume} )
      }
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
  const gain = context.createGain()
  gain.gain.value = toRealVolume(volume)
  return gain
}

function toRealVolume (percentValue) {
  return percentValue * 0.01
}
