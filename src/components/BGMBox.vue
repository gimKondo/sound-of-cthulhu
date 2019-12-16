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
      <v-layout>
        <v-flex>
          <v-btn-toggle multiple>
            <PlayingToggle
              v-if="source"
              :isPlaying="isPlaying"
              @play-sound="playSound"
              @pause-sound="pauseSound"
            />
            <VolumeControlToggle
              :isOpened="isVolumeControlOpened"
              @toggle-volume-control="toggleVolumeControl"
            />
          </v-btn-toggle>
        </v-flex>
        <v-flex>
          <ProgressTime
            v-if="source"
            :currentTime="currentTime()"
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
import HasCurrentTime from '@/mixins/HasCurrentTime.js'
import RemoveSound from '@/components/RemoveSound.vue'
import SoundBoxTitle from '@/components/SoundBoxTitle.vue'
import PlayingToggle from '@/components/PlayingToggle.vue'
import VolumeControlToggle from '@/components/VolumeControlToggle.vue'
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
    VolumeControlToggle,
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
      if (this.isPlaying) {
        return
      }
      this.startSource(this.currentTime())
      this.startCurrentTimeInterval()
      this.$emit('play-sound')
    },
    pauseSound () {
      if (!this.isPlaying) {
        return
      }
      this.stopSource()
      this.clearCurrentTimeInterval()
    }
  }
}
</script>

<style>
</style>
