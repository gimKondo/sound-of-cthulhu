<template>
  <div class="bgm-box">
    <v-card v-on:click="playSound">
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
    </v-card>
  </div>
</template>

<script>
const path = require('path');
export default {
  name: 'BGMBox',
  props: {
    filepath: String
  },
  methods: {
    playSound: function () {
      alert('playing sound: ' + this.name)
      const context = new AudioContext()
      const electron = require('electron')
      const fs = electron.remote.require('fs')
      const toArrayBuffer = function (buf) {
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
      }
      fs.readFile(this.filepath, (err, data) => {
        context.decodeAudioData(toArrayBuffer(data), function (buffer) {
          const source = context.createBufferSource()
          source.buffer = buffer
          source.connect(context.destination)
          source.start(0)
        }).then()
      })
    }
  },
  computed: {
    name: function() {
      return path.basename(this.filepath)
    }
  }
}
</script>

<style>
.bgm-box-title {
  background-color:darkslateblue;
  word-wrap: break-word;
}
</style>
