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
  it('Promise/A+ 2.2.3', done => {
    const fn = sinon.fake()
    const promise = new Promise((resolve,reject) => {
      assert.isFalse(fn.called)
      reject(233)
      reject(2333)
      setTimeout(() => {
        assert(promise.state === 'rejected')
        assert.isTrue(fn.called)
        assert(fn.calledWith(233))
        done()
      }, 0)
    })
    promise.then(null,fn)
  })
  it('Promise/A+ 2.2.4 在我的代码执行完成之前，不得调用then后面的两个函数', done => {
    const fn = sinon.fake()
    const promise = new Promise((resolve,reject) => {
      resolve()
    })
    promise.then(fn)
    assert.isFalse(fn.called)
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    }, 0)
  })
  it('Promise/A+ 2.2.4 在我的代码执行完成之前，不得调用then后面的两个函数', done => {
    const fn = sinon.fake()
    const promise = new Promise((resolve,reject) => {
      reject()
    })
    promise.then(null,fn)
    assert.isFalse(fn.called)
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    }, 0)
  })
  it('Promise/A+ 2.2.5', done => {
    const promise = new Promise(resolve => {
      resolve()
    })
    promise.then(function () {
      'use strict'
      assert(this === undefined)
      done()
    })
  })
  it('2.2.6 then可以在同一个promise里被多次调用', done => {
    const promise = new Promise(resolve => {
      resolve()
    })
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()]
    promise.then(callbacks[0])
    promise.then(callbacks[1])
    promise.then(callbacks[2])
    setTimeout(() => {
      callbacks.forEach(callback => {assert(callback.called)})
      assert(callbacks[1].calledAfter(callbacks[0]))
      assert(callbacks[2].calledAfter(callbacks[1]))
      done()
    }, 0)
  })
  it('2.2.6 then可以在同一个promise里被多次调用', done => {
    const promise = new Promise((resolve,reject) => {
      reject()
    })
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()]
    promise.then(null,callbacks[0])
    promise.then(null,callbacks[1])
    promise.then(null,callbacks[2])
    setTimeout(() => {
      callbacks.forEach(callback => {assert(callback.called)})
      assert(callbacks[1].calledAfter(callbacks[0]))
      assert(callbacks[2].calledAfter(callbacks[1]))
      done()
    }, 0)
  })
  it('2.2.7 then必须返回一个promise', () => {
    const promise = new Promise(resolve => {
      resolve()
    })
    const promise2 = promise.then(() => {},() => {})
    assert(promise2 instanceof Promise)
  })
  it('2.2.7.1 如果then(success,fail)中success返回一个值x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)',done => {
    const promise1 = new Promise(resolve => {
      resolve()
    })
    promise1.then(() => 'success',() => {}).then(result => {
      assert.equal(result,'success')
      done()
    })
  })
  it('2.2.7.1.1 success 的返回值是一个Promise实例',done => {
    const promise = new Promise(resolve => {
      resolve()
    })
    const fn = sinon.fake()
    promise
    .then(() => new Promise((resolve) => {
      resolve()
    }),() => {})
    .then(fn)
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    })
  })
  it('2.2.7.1.2 success 的返回值是一个Promise实例，且失败了',done => {
    const promise = new Promise(resolve => {
      resolve()
    })
    const fn = sinon.fake()
    promise
    .then(() => new Promise((resolve,reject) => {
      reject()
    }),() => {})
    .then(null,fn)
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    })
  })
  it('2.2.7.1.3 fail 的返回值是一个Promise实例',done => {
    const promise = new Promise((resolve,reject) => {
      reject()
    })
    const fn = sinon.fake()
    promise
    .then(null,() => new Promise(resolve => resolve()))
    .then(fn) 
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    })
  })
  it('2.2.7.1.4 fail 的返回值是一个Promise实例，且失败了',done => {
    const promise = new Promise((resolve,reject) => {
      reject()
    })
    const fn = sinon.fake()
    promise
    .then(null,() => new Promise((resolve,reject) => reject()))
    .then(null,fn) 
    setTimeout(() => {
      assert.isTrue(fn.called)
      done()
    })
  })
})