<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid>
    <v-layout wrap>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon @click="saveSoundList" size='30' v-on="on">save_alt</v-icon>
        </template>
        <span>Save</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon @click="loadSoundList" size='30' v-on="on">open_in_browser</v-icon>
        </template>
        <span>Load</span>
      </v-tooltip>
      <OutputDeviceSelect
        :items="availableSoundDevices"
        @input="changeDestination"
      />
    </v-layout>
    <v-layout wrap>
      <v-flex xs10>
        <BGMList
          :context="context"
          :channel-splitter="channelSplitter"
          :sounds="BGMs"
          @add-sound="addBGM"
          @remove-sound="removeBGM"
          @apply-volume="applyBGMVolume"
        />
      </v-flex>
      <v-flex xs2>
        <SEList
          :context="context"
          :channel-splitter="channelSplitter"
          :sounds="SEs"
          @add-sound="addSE"
          @remove-sound="removeSE"
          @apply-volume="applySEVolume"
        />
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      :vertical="true"
    >
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import OutputDeviceSelect from '@/components/OutputDeviceSelect.vue'
import BGMList from '@/components/BGMList.vue'
import SEList from '@/components/SEList.vue'
import * as DiscordUtil from '@/services/DiscordUtil'

const remote = require('electron').remote
const { dialog } = require('electron').remote
const path = require('path')
const storage = require('electron-json-storage')

const { ipcRenderer } = require('electron')

const initialVolume = 50

export default {
  name: 'Main',
  components: {
    OutputDeviceSelect,
    BGMList,
    SEList
  },
  props: {
  },
  methods: {
    changeDestination (deviceId) {
      this.context.deviceId = deviceId
      if (deviceId !== DiscordUtil.DEVICE_ID) {
        // Since there is no official API, use the hacky method.
        const destination = this.context.createMediaStreamDestination()
        const audio = new Audio()
        audio.srcObject = destination.stream
        audio.setSinkId(deviceId)
        this.channelSplitter.disconnect()
        this.channelSplitter.connect(destination)
        audio.play()
      } else {
        ipcRenderer.invoke('discordJoin').then(({ isSuccess }) => {
          if (isSuccess) {
            this.showSnackbar('Success to login Discord.\nPlease type ":soc: join" on discord text channel.', 'info')
          }
        }).catch((err) => {
          this.showSnackbar(err, 'error')
        })
      }
    },
    saveSoundList () {
      const soundList = {
        BGMs: this.BGMs,
        SEs: this.SEs
      }
      storage.set(this.soundListName, soundList, (error) => {
        if (error) {
          this.showSnackbar('Fail to save', 'error')
          console.log(`Fail to save. error:[${error}]`)
          return
        }
        this.showSnackbar('Saved', 'info')
      })
    },
    loadSoundList () {
      storage.get(this.soundListName, (error, data) => {
        if (error) {
          this.showSnackbar(`Fail to load. error:[${error}]`, 'error')
          return
        }
        const extractSounds = (key) => {
          const sounds = data[key]
          if (!Array.isArray(sounds)) {
            this.showSnackbar(`No ${key}.`, 'error')
            return []
          }
          if (!sounds.every(isValidSound)) {
            this.showSnackbar(`Invalid ${key}.`, 'error')
            return []
          }
          return data[key]
        }
        this.BGMs = extractSounds('BGMs')
        this.SEs = extractSounds('SEs')
      })
    },
    addBGM () {
      this.addSound((sound) => {
        this.BGMs = this.BGMs.concat([sound])
      })
    },
    addSE () {
      this.addSound((sound) => {
        this.SEs = this.SEs.concat([sound])
      })
    },
    removeBGM (targetIndex) {
      this.BGMs = this.removeSound(this.BGMs, targetIndex)
    },
    removeSE (targetIndex) {
      this.SEs = this.removeSound(this.SEs, targetIndex)
    },
    applyBGMVolume (targetIndex, volume) {
      this.applyVolume(this.BGMs, targetIndex, volume)
    },
    applySEVolume (targetIndex, volume) {
      this.applyVolume(this.SEs, targetIndex, volume)
    },
    addSound (onSelectFile) {
      const window = remote.getCurrentWindow()
      const options = {
        title: 'File open',
        filters: [
          { name: 'sound', extensions: ['mp3'] }
        ],
        properties: ['openFile']
      }
      const filenames = dialog.showOpenDialogSync(window, options)
      if (filenames) {
        onSelectFile({
          filePath: filenames[0],
          volume: initialVolume
        })
      }
    },
    removeSound (sounds, targetIndex) {
      const targetFilePath = sounds[targetIndex].filePath
      const removedSounds = sounds.filter((_, i) => i !== targetIndex)
      this.showSnackbar(`"${path.basename(targetFilePath, '.mp3')}" is removed`, 'info')
      return removedSounds
    },
    applyVolume (sounds, targetIndex, volume) {
      sounds[targetIndex].volume = volume
    },
    showSnackbar (text, color) {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  },
  async created () {
    this.context.onstatechange = () => this.$forceUpdate()
    this.channelSplitter.connect(this.context.destination)
    this.availableOutputDevices = await getAvailableOutputDevices()
    this.availableSoundDevices = this.availableOutputDevices.concat(DiscordUtil.DEVICE_ID)

    this.loadSoundList()
  },
  data () {
    const context = new AudioContext()
    return {
      context: context,
      channelSplitter: context.createChannelSplitter(),
      soundListName: 'default',
      availableOutputDevices: [],
      availableSoundDevices: [],
      BGMs: [],
      SEs: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: ''
    }
  }
}

function isValidSound (sound) {
  return typeof sound.filePath === 'string' && Number.isInteger(sound.volume)
}

async function getAvailableOutputDevices () {
  return (await navigator.mediaDevices.enumerateDevices())
    .filter(device => device.kind === 'audiooutput')
}

</script>
