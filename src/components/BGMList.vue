<template>
  <v-layout wrap>
    <v-flex xs6 md4 pa-1 v-for="(filePath, index) in filePaths" :key="filePath">
      <BGMBox
        ref="soundBoxes"
        :filePath="filePath"
        @play-sound="pauseOtherBGMs(index)"
        @remove-sound="$emit('remove-sound', index)"
      />
    </v-flex>
    <v-icon @click="$emit('add-sound')" size='75'>playlist_add</v-icon>
  </v-layout>
</template>

<script>
import SoundList from '@/mixins/SoundList.js'
import BGMBox from '@/components/BGMBox.vue'

export default {
  name: 'BGMList',
  mixins: [
    SoundList
  ],
  components: {
    BGMBox
  },
  methods: {
    pauseOtherBGMs (playingIndex) {
      this.$refs.soundBoxes.forEach((soundBox, i) => {
        if (i !== playingIndex) {
          soundBox.pauseSound()
        }
      })
    }
  }
}
</script>
