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
    setImmediate(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[0] === 'function') {
          const x = callback[0].call(undefined,result)
          callback[2].resolveWith(x)
        }
      })
    }, 0)
  }
  reject (reason) {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    setImmediate(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[1] === 'function') {
          const x = callback[1].call(undefined,reason)
          callback[2].resolveWith(x)
        }
      })
    }, 0)
  }
  resolveWith (x) {
    if (this === x) {
      this.reject(new TypeError())
    } else if (x instanceof Promise2) {
      x.then(
        result => {
          this.resolve(result)
        },
        reason => {
          this.reject(reason)
        }
      )
    } else if (x instanceof Object) {
      let then
      try {
        then = x.then
      } catch (e) {
        this.reject(e)
      }
      if (then instanceof Function) {
        try {
          x.then(y => {
            this.resolveWith(y)
          },
          r => {
            this.reject(r)
          })
          // then.call(x, (y) => {
          //   this.resolveWith(y)
          // }, (r) => {
          //   this.reject(r)
          // })
        } catch (e) {
          this.reject(e)
        }
      } else {
        this.resolve(x)
      }
    } else {
      this.resolve(x)
    }
  }
  then (succeed?,fail?) {
    const handler = []
    if (typeof succeed === 'function') {
      handler[0] = succeed
    }
    if (typeof fail === 'function') {
      handler[1] = fail
    }
    handler[2] = new Promise2(() => {})
    this.callbacks.push(handler)
    return handler[2]
  }
}

export default Promise2