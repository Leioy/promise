import * as chai from 'chai'
import Promise from '../src/promise'
const assert = chai.assert
describe('Promise',() => {
  it('是一个类',() => {
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
})