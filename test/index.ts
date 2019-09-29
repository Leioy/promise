import * as chai from 'chai'
import Promise from '../src/promise'
const assert = chai.assert
describe('Promise',() => {
  it('是一个类',() => {
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
  it('new Promise必须接受一个函数', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise()
    })
    assert.throw(() => {
      new Promise(1)
    })
    assert.throw(() => {
      new Promise(false)
    })
  })
  it('new Promise(fn)会生成一个对象，对象有then方法', () => {
    const promise = new Promise(() => {})
    assert.isFunction(promise.then)
  })
})