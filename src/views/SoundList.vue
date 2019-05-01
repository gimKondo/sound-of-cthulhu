<template>
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
        <v-layout wrap>
          <v-flex xs6 md4 pa-1 v-for="(filepath, index) in bgmFiles" :key="index">
            <BGMBox :filepath="filepath" :currentBGM="currentBGM" @play-sound="changeCurrentBGM($event)"/>
          </v-flex>
          <v-icon @click="addBGM" size='75'>playlist_add</v-icon>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout wrap>
          <v-flex xs12 pa-1 v-for="(name, index) in seNames" :key="index">
            <SEBox :name="name"/>
          </v-flex>
        </v-layout>
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
import BGMBox from '@/components/BGMBox.vue'
import SEBox from '@/components/SEBox.vue'

const remote = require('electron').remote
const { dialog } = require('electron').remote
const storage = require('electron-json-storage')

export default {
  name: 'SoundList',
  components: {
    BGMBox,
    SEBox
  },
  props: {
  },
  methods: {
    saveSoundList () {
      const soundList = {
        BGMs: this.bgmFiles
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
        this.bgmFiles = data.BGMs
      })
    },
    addBGM () {
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
          this.bgmFiles.push(filenames[0])
        }
      )
    },
    changeCurrentBGM (name) {
      this.currentBGM = name
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
      bgmFiles: ['public/bgm_sample.mp3', 'public/short_sample.mp3'],
      seNames: ['bang', 'bomb'],
      currentBGM: null,
      snackbar: false,
      snackbarText: '',
      snackbarColor: ''
    }
  }
}
</script>
