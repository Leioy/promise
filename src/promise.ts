class Promise2 {
  constructor (fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise只接受一个函数')
    }
    fn()
  }
  then () {}
}

export default Promise2