<template>
  <v-card-title class="font-weight-bold" :class="color">{{text}}</v-card-title>
</template>

<script>

export default {
  name: 'SoundBoxTitle',
  props: {
    text: String,
    color: String
  }
}
</script>

<style>
.v-card-title {
  word-wrap: break-word;
}
</style>
