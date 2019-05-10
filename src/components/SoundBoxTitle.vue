<template>
  <v-card-title class="font-weight-bold">{{text}}</v-card-title>
</template>

<script>

export default {
  name: 'SoundBoxTitle',
  props: {
    text: String,
  }
}
</script>

<style>
.v-card-title {
  word-wrap: break-word;
}
</style>
