<template>
  <v-btn @click="emit" icon>
    <v-icon>replay</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'ProgressTimeResetter',
  methods: {
    emit () {
      this.$emit('reset-progress-time')
    }
  }
}
</script>

<style>
</style>
