<template>
  <v-btn @click="toggle" small fab color="grey darken-2">
    <v-icon v-if="!isPlaying">play_arrow</v-icon>
    <v-icon v-else>pause</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'PlayingToggle',
  props: {
    isPlaying: Boolean
  },
  methods: {
    toggle () {
      if (this.isPlaying) {
        this.$emit('pause-sound')
      } else {
        this.$emit('play-sound')
      }
    }
  }
}
</script>

<style>
</style>
