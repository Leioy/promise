class Promise2 {
  succeed = null
  fail = null
  constructor (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise只接受一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve () {
    setTimeout(() => {
      if (typeof this.succeed === 'function') {
        this.succeed()
      }
    }, 0)
  }
  reject () {
    setTimeout(() => {
      if (typeof this.fail === 'function') {
        this.fail()
      }
    }, 0)
  }
  then (succeed?,fail?) {
    if (typeof succeed === 'function') {
      this.succeed = succeed
    }
    if (typeof fail === 'function') {
      this.fail = fail
    }
  }
}

export default Promise2