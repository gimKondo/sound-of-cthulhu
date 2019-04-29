<template>
  <v-container>
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
  </v-container>
</template>

<script>
import BGMBox from '@/components/BGMBox.vue'
import SEBox from '@/components/SEBox.vue'

const remote = require('electron').remote
const { dialog } = require('electron').remote

export default {
  name: 'SoundList',
  components: {
    BGMBox,
    SEBox
  },
  props: {
  },
  methods: {
    addBGM: function () {
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
    }
  },
  data () {
    return {
      bgmFiles: ['public/bgm_sample.mp3', 'public/short_sample.mp3'],
      seNames: ['bang', 'bomb'],
      currentBGM: null
    }
  }
}
</script>
