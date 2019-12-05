let startTime = 0
let stackTime = 0
let currentTimeIntervalId = null

export default {
  data () {
    return {
      playingTime: 0
    }
  },
  methods: {
    startCurrentTimeInterval () {
      startTime = this.context.currentTime
      currentTimeIntervalId = setInterval(() => {
        this.playingTime = this.context.currentTime - startTime
      }, 200)
    },
    clearCurrentTimeInterval () {
      stackTime = stackTime + this.playingTime
      this.playingTime = 0
      clearInterval(currentTimeIntervalId)
    },
    currentTime () {
      return stackTime + this.playingTime
    }
  },
  beforeDestroy () {
    this.clearCurrentTimeInterval()
  }
}
