<template>
  <v-chip>{{text()}}</v-chip>
</template>

<script>
export default {
  name: 'ProgressTime',
  props: {
    currentTime: Number,
    endTime: Number
  },
  data () {
    return {
    }
  },
  methods: {
    text () {
      const pad2Zero = (value) => {
        return ('00' + value).slice(-2)
      }
      const convert = (time) => {
        return `${pad2Zero(Math.floor(time / 60))}:${pad2Zero(Math.floor(time % 60))}`
      }
      const currentLoopTime = this.endTime !== 0 ? this.currentTime % this.endTime : 0
      return `${convert(currentLoopTime)} / ${convert(this.endTime)}`
    }
  }
}
</script>

<style>
</style>
