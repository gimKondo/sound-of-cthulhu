<template>
  <v-layout wrap>
    <v-flex xs12 pa-1 v-for="(filePath, index) in filePaths" :key="filePath">
      <SEBox
        :filePath="filePath"
        @remove-sound="$emit('remove-sound', index)"
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
