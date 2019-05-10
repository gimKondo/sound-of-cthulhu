<template>
  <div class="se-box">
    <v-card>
      <v-layout class="bgm-box-title teal darken-3">
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
import RemoveSound from '@/components/RemoveSound.vue'
import SoundBoxTitle from '@/components/SoundBoxTitle.vue'
import PlayingToggle from '@/components/PlayingToggle.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import PlayingIndicator from '@/components/PlayingIndicator.vue'

export default {
  name: 'SEBox',
  mixins: [
    SoundBox
  ],
  components: {
    RemoveSound,
    SoundBoxTitle,
    PlayingToggle,
    VolumeControl,
    PlayingIndicator
  },
  methods: {
    playSound () {
      this.resumeSound()
      this.source.start()
      this.source.onended = () => {
        this.suspendSound()
        this.reloadSource()
      }
    }
  },
  computed: {
    loop () {
      return false
    }
  }
}
</script>

<style>
</style>
