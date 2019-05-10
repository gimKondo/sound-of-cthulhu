<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
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
    </v-layout>
    <v-layout wrap>
      <v-flex xs10>
        <BGMList
          :filePaths="bgmFilePaths"
          @add-sound="addBGM"
          @remove-sound="removeBGM"
        ></BGMList>
      </v-flex>
      <v-flex xs2>
        <SEList
          :filePaths="seFilePaths"
          @add-sound="addSE"
          @remove-sound="removeSE"
        ></SEList>
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
import BGMList from '@/components/BGMList.vue'
import SEList from '@/components/SEList.vue'

const remote = require('electron').remote
const { dialog } = require('electron').remote
const path = require('path')
const storage = require('electron-json-storage')

export default {
  name: 'Main',
  components: {
    BGMList,
    SEList
  },
  props: {
  },
  methods: {
    saveSoundList () {
      const soundList = {
        BGMs: this.bgmFilePaths,
        SEs: this.seFilePaths
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
        if (Object.keys(data).length === 0) {
          this.showSnackbar('No sound list', 'error')
          return
        }
        this.bgmFilePaths = data.BGMs || []
        this.seFilePaths = data.SEs || []
      })
    },
    addBGM () {
      addSound((filePath) => {
        this.bgmFilePaths = this.bgmFilePaths.concat([filePath])
      })
    },
    addSE () {
      addSound((filePath) => {
        this.seFilePaths = this.seFilePaths.concat([filePath])
      })
    },
    removeBGM (targetIndex) {
      const targetFilePath = this.bgmFilePaths[targetIndex]
      this.bgmFilePaths = removeSound(this.bgmFilePaths, targetIndex)
      this.showRemovedSnackbar(targetFilePath)
    },
    removeSE (targetIndex) {
      const targetFilePath = this.seFilePaths[targetIndex]
      this.seFilePaths = removeSound(this.seFilePaths, targetIndex)
      this.showRemovedSnackbar(targetFilePath)
    },
    showRemovedSnackbar (filepath) {
      this.showSnackbar(`"${path.basename(filepath, '.mp3')}" is removed`, 'info')
    },
    showSnackbar (text, color) {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  },
  created () {
    this.loadSoundList()
  },
  data () {
    return {
      soundListName: 'default',
      bgmFilePaths: [],
      seFilePaths: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: ''
    }
  }
}

function addSound (onSelectFile) {
  let window = remote.getCurrentWindow()
  let options = {
    title: 'File open',
    filters: [
      { name: 'sound', extensions: ['mp3'] }
    ],
    properties: ['openFile']
  }
  dialog.showOpenDialog(window, options,
    (filenames) => {
      onSelectFile(filenames[0])
    }
  )
}

function removeSound (filePaths, targetIndex) {
  return filePaths.filter((_, i) => i !== targetIndex)
}
</script>
