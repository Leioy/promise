import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import Promise from '../src/promise'
chai.use(sinonChai)
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
  it('new Promise(fn)中的fn立即执行', () => {
    const fn = sinon.fake()
    new Promise(fn)
    assert(fn.called)
  })
  it('new Promise(fn)中的fn接受resolve和reject两个函数', () => {
    new Promise((resolve,reject) => {
      assert.isFunction(resolve)
      assert.isFunction(reject)
    })
  })
  it('promise.then(success)中的success会在resolve被调用的时候执行', done => {
    const fn = sinon.fake()
    const promise = new Promise((resolve) => {
      assert.isFalse(fn.called)
      resolve()
      setTimeout(() => {
        assert.isTrue(fn.called)
        done()
      }, 0)
    })
    promise.then(fn)
  })
  it('promise.then(null,fail)中的fail会在reject被调用的时候执行', done => {
    const fn = sinon.fake()
    const promise = new Promise((resolve,reject) => {
      assert.isFalse(fn.called)
      reject()
      setTimeout(() => {
        assert.isTrue(fn.called)
        done()
      }, 0)
    })
    promise.then(null,fn)
  })
  it('Promise/A+ 2.2.1 then的两个参数都是可选参数，并且如果不是函数必须忽略', () => {
    const promise = new Promise((resolve,reject) => {
      resolve()
    })
    promise.then(false,null)
  })
  it('Promise/A+ 2.2.2', done => {
    const fn = sinon.fake()
    const promise = new Promise((resolve) => {
      assert.isFalse(fn.called)
      resolve(233)
      resolve(2333)
      setTimeout(() => {
        assert(promise.state === 'fulfilled')
        assert.isTrue(fn.called)
        assert(fn.calledWith(233))
        done()
      }, 0)
    })
    promise.then(fn)
  })
  
})