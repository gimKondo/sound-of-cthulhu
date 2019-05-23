<template>
  <div class="bgm-box">
    <v-card>
      <v-layout class="bgm-box-title deep-purple darken-3">
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
            :value="volume"
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
import HasCurrentTime from '@/mixins/HasCurrentTime.js'
import RemoveSound from '@/components/RemoveSound.vue'
import SoundBoxTitle from '@/components/SoundBoxTitle.vue'
import PlayingToggle from '@/components/PlayingToggle.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import ProgressTime from '@/components/ProgressTime.vue'
import PlayingIndicator from '@/components/PlayingIndicator.vue'

export default {
  name: 'BGMBox',
  mixins: [
    SoundBox,
    HasCurrentTime
  ],
  components: {
    RemoveSound,
    SoundBoxTitle,
    PlayingToggle,
    VolumeControl,
    ProgressTime,
    PlayingIndicator
  },
  data () {
    return {
      loop: true,
      isStarted: false
    }
  },
  methods: {
    playSound () {
      this.resumeSound()
      if (!this.isStarted) {
        this.source.start()
        this.isStarted = true
      }
      this.startCurrentTimeInterval()
      this.$emit('play-sound')
    },
    pauseSound () {
      this.suspendSound()
      this.clearCurrentTimeInterval()
    }
  }
}
</script>

<style>
</style>
