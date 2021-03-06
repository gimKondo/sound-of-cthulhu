export default {
  props: {
    context: AudioContext,
    channelSplitter: ChannelSplitterNode,
    sounds: Array
  },
  methods: {
    removeSound (index) {
      this.$emit('remove-sound', index)
    },
    applyVolume (index, volume) {
      this.$emit('apply-volume', index, volume)
    }
  }
}
