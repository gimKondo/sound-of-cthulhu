<template>
  <v-btn @click="toggle" small fab color="grey darken-2">
    <v-icon >volume_up</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'VolumeControlToggle',
  props: {
    isOpened: Boolean
  },
  methods: {
    toggle () {
      console.log('toggle')
      this.$emit('toggle-volume-control')
    }
  }
}
</script>

<style>
</style>
