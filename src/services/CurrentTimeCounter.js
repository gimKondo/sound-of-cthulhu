export default class CurrentTimeCounter {
  #startTime = 0
  #stackTime = 0
  #playingTime = 0
  #intervalId = null

  constructor (context, setter) {
    console.assert(context)
    this.context = context
    this.setter = setter
  }

  start () {
    this.#startTime = this.context.currentTime
    this.#intervalId = setInterval(() => {
      this.#playingTime = this.context.currentTime - this.#startTime
      this.setter(this.#stackTime + this.#playingTime)
    }, 200)
  }

  clear () {
    this.#stackTime = this.#stackTime + this.#playingTime
    this.#playingTime = 0
    clearInterval(this.#intervalId)
  }
}
