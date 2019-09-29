class Promise2 {
  succeed = null
  constructor (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise只接受一个函数')
    }
    fn(() => {
      setTimeout(() => {
        this.succeed()
      }, 0)
    }, () => {})
  }
  then (succeed) {
    this.succeed = succeed
  }
}

export default Promise2