<template>
  <v-icon @click="$emit('remove-sound')" :color="color">{{text}}</v-icon>
</template>

<script>
export default {
  name: 'RemoveSound',
  props: {
    text: String,
    color: String
  }
}
</script>

<style>
</style>
