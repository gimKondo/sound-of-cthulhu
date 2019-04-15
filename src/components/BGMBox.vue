<template>
  <div class="bgm-box">
    <v-card v-on:click="playSound">
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BGMBox',
  props: {
    name: String
  },
  methods: {
    playSound: function () {
      alert('playing sound: ' + this.name)
      let audio = new Audio(require('path').resolve('../sound/bgm_sample.mp3'))
      audio.play()
    }
  }
}
</script>

<style>
.bgm-box-title {
  background-color:darkslateblue
}
</style>
