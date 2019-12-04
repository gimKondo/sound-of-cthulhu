<template>
  <div class="se-box">
    <v-card>
      <v-layout class="bgm-box-title teal darken-3">
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
            :isPlaying="isPlaying()"
            @play-sound="playSound"
          />
            <VolumeControlToggle
              :isOpened="isVolumeControlOpened"
              @toggle-volume-control="toggleVolumeControl"
            />
          </v-btn-toggle>
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
            :isPlaying="isPlaying()"
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
    VolumeControlToggle,
    VolumeControl,
    PlayingIndicator
  },
  data () {
    return {
      loop: false
    }
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
  }
}
</script>

<style>
</style>
