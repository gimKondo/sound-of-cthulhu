export default {
  data () {
    return {
      currentTime: 0,
      currentTimeIntervalId: null
    }
  },
  methods: {
    startCurrentTimeInterval () {
      this.currentTimeIntervalId = setInterval(() => {
        this.currentTime = this.context.currentTime
      }, 200)
    },
    clearCurrentTimeInterval () {
      clearInterval(this.currentTimeIntervalId)
    }
  }
}
