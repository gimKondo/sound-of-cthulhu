<template>
  <v-card-title class="font-weight-bold">{{text}}</v-card-title>
</template>

<script>

export default {
  name: 'SoundBoxTitle',
  props: {
    text: String
  }
}
</script>

<style>
.v-card__title {
  word-wrap: break-word;
  padding: 8px;
}
</style>
