<template>
  <v-progress-linear v-if="!isPlaying" :value="0"></v-progress-linear>
  <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
</template>

<script>
export default {
  name: 'PlayingIndicator',
  props: {
    isPlaying: Boolean
  }
}
</script>

<style>
.v-progress-linear {
  margin: 0;
}
</style>
