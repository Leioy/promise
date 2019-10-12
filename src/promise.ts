class Promise2 {
  state = 'pending'
  callbacks = []
  constructor (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise只接受一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  private resolveOrReject (state,data,i) {
    if (this.state !== 'pending') return
    this.state = state
    nextTick(() => {
      this.callbacks.forEach(callback => {
        if (typeof callback[i] === 'function') {
          let x
          try {
             x = callback[i].call(undefined,data)
          } catch (e) {
            return callback[2].reject(e)
          }
          callback[2].resolveWith(x)
        }
      })
    })
  }
  resolve (result) {
    this.resolveOrReject('fulfilled',result,0)
  }
  reject (reason) {
    this.resolveOrReject('rejected',reason,1)
  }
  resolveWithSelf () {
    this.reject(new TypeError())
  }
  resolveWithPromise (x) {
    x.then(
      result => {
        this.resolve(result)
      },
      reason => {
        this.reject(reason)
      }
    )
  }
  resolveWithObject (x) {
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
  }
  resolveWith (x) {
    if (this === x) {
      this.resolveWithSelf()
    } else if (x instanceof Promise2) {
      this.resolveWithPromise(x)
    } else if (x instanceof Object) {
      this.resolveWithObject(x)
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

function nextTick (fn) {
  if (process && typeof process.nextTick === 'function') {
    return process.nextTick(fn)
  } else {
    var counter = 1
    var observer = new MutationObserver(fn)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    counter = counter + 1
    textNode.data = String(counter)
  }
}