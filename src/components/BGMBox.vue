<template>
  <div class="bgm-box">
    <v-card>
      <v-layout class="bgm-box-title deep-purple darken-3">
        <v-flex xs1>
          <RemoveSound
            text="clear"
            @remove-sound="removeSound"
          />
        </v-flex>
        <v-flex xs11>
          <SoundBoxTitle
            :text="name"
          />
        </v-flex>
      </v-layout>
      <v-layout align-center>
        <v-flex>
            <PlayingToggle
              v-if="source"
              :isPlaying="isPlaying"
              @play-sound="playSound"
              @pause-sound="pauseSound"
            />
            <ProgressTimeResetter
              @reset-progress-time="resetProgressTime"
            />
            <VolumeControlToggle
              :isOpened="isVolumeControlOpened"
              @toggle-volume-control="toggleVolumeControl"
            />
        </v-flex>
        <v-flex>
          <ProgressTime
            v-if="source"
            :currentTime="currentTime"
            :endTime="source.buffer.duration"
          />
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <VolumeControl
            v-if="source && isVolumeControlOpened"
            :value="volume"
            @input="applyVolume"
          />
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <PlayingIndicator
            :isPlaying="isPlaying"
          />
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import SoundBox from '@/mixins/SoundBox.js'
import RemoveSound from '@/components/RemoveSound.vue'
import SoundBoxTitle from '@/components/SoundBoxTitle.vue'
import PlayingToggle from '@/components/PlayingToggle.vue'
import VolumeControlToggle from '@/components/VolumeControlToggle.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import ProgressTime from '@/components/ProgressTime.vue'
import ProgressTimeResetter from '@/components/ProgressTimeResetter'
import PlayingIndicator from '@/components/PlayingIndicator.vue'
import CurrentTimeCounter from '@/services/CurrentTimeCounter'

export default {
  name: 'BGMBox',
  mixins: [
    SoundBox
  ],
  components: {
    RemoveSound,
    SoundBoxTitle,
    PlayingToggle,
    VolumeControlToggle,
    VolumeControl,
    ProgressTime,
    ProgressTimeResetter,
    PlayingIndicator
  },
  data () {
    return {
      currentTimeCounter: null,
      currentTime: 0,
      loop: true
    }
  },
  created () {
    this.currentTimeCounter = new CurrentTimeCounter(this.context, (value) => { this.currentTime = value })
  },
  beforeDestroy () {
    this.pauseSound()
  },
  methods: {
    playSound () {
      if (this.isPlaying) {
        return
      }
      this.startSource(this.currentTime)
      this.currentTimeCounter.start()
      this.$emit('play-sound')
    },
    pauseSound () {
      if (!this.isPlaying) {
        return
      }
      this.stopSource()
      this.currentTimeCounter.clear()
    },
    resetProgressTime () {
      const keepPlaying = this.isPlaying
      this.pauseSound()
      this.currentTimeCounter.backToZero()
      if (keepPlaying) {
        this.playSound()
      }
    }
  }
}
</script>

<style>
</style>
