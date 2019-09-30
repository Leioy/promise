class Promise2 {
  state = 'pending'
  callbacks = []
  constructor (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise只接受一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve (result) {
    if (this.state !== 'pending') return
    this.state = 'fulfilled'
    setTimeout(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[0] === 'function') {
          callback[0].call(undefined,result)
        }
      })
    }, 0)
  }
  reject (reason) {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    setTimeout(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[1] === 'function') {
          callback[1].call(undefined,reason)
        }
      })
    }, 0)
  }
  then (succeed?,fail?) {
    const handler = []
    if (typeof succeed === 'function') {
      handler[0] = succeed
    }
    if (typeof fail === 'function') {
      handler[1] = fail
    }
    this.callbacks.push(handler)
    return new Promise2(() => {})
  }
}

export default Promise2