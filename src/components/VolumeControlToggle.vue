<template>
  <v-btn @click="toggle" color="grey darken-2" class="btn--active">
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
      this.$emit('toggle-volume-control')
    }
  }
}
</script>

<style>
</style>
