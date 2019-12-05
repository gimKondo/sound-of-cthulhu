<template>
  <v-layout wrap>
    <v-flex xs6 md4 pa-1 v-for="(sound, index) in sounds" :key="sound.filePath">
      <BGMBox
        ref="soundBoxes"
        :context="context"
        :filePath="sound.filePath"
        :volume="sound.volume"
        @play-sound="pauseOtherBGMs(index)"
        @remove-sound="removeSound(index)"
        @apply-volume="applyVolume(index, $event)"
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
