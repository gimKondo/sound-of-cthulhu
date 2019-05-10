<template>
  <div class="bgm-box">
    <v-card>
      <v-layout class="bgm-box-title deep-purple">
        <v-flex xs1>
          <RemoveSound
            text="clear"
            @remove-sound="removeSound"
          ></RemoveSound>
        </v-flex>
        <v-flex xs11>
          <SoundBoxTitle
            :text="name"
          ></SoundBoxTitle>
        </v-flex>
      </v-layout>
      <div>メモ</div>
      <v-layout>
        <v-flex xs2>
          <PlayingToggle
            v-if="source"
            :isPlaying="isPlaying()"
            @play-sound="playSound"
            @pause-sound="pauseSound"
          ></PlayingToggle>
        </v-flex>
        <v-flex xs10>
          <VolumeControl
            v-if="source"
            :value="initialVolume"
            @input="applyVolume"
          ></VolumeControl>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <ProgressTime
            v-if="source"
            :currentTime="currentTime"
            :endTime="source.buffer.duration"
          ></ProgressTime>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <PlayingIndicator
            :isPlaying="isPlaying()"
          ></PlayingIndicator>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import SoundBox from '@/mixins/SoundBox.js'

export default {
  name: 'BGMBox',
  mixins: [
    SoundBox
  ],
  computed: {
    loop () {
      return true
    }
  }
}
</script>

<style>
</style>
