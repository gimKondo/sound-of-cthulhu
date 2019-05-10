<template>
  <v-icon @click="$emit('remove-sound')">{{text}}</v-icon>
</template>

<script>
export default {
  name: 'RemoveSound',
  props: {
    text: String,
  }
}
</script>

<style>
</style>
