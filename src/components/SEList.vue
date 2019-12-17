<template>
  <v-layout wrap>
    <v-flex xs12 pa-1 v-for="(sound, index) in sounds" :key="sound.filePath">
      <SEBox
        :context="context"
        :channel-splitter="channelSplitter"
        :filePath="sound.filePath"
        :volume="sound.volume"
        @remove-sound="removeSound(index)"
        @apply-volume="applyVolume(index, $event)"
      />
    </v-flex>
    <v-icon @click="$emit('add-sound')" size='75'>playlist_add</v-icon>
  </v-layout>
</template>

<script>
import SoundList from '@/mixins/SoundList.js'
import SEBox from '@/components/SEBox.vue'

export default {
  name: 'SEList',
  mixins: [
    SoundList
  ],
  components: {
    SEBox
  },
  created () {

  }
}
</script>
