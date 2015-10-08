import utils from '../lib/utils'

const isPlainObject = utils.isPlainObject

describe('UtilsSpec', () => {

  describe('.isPlainObject', () => {
    it('should return truthy', () => {
      expect(isPlainObject({})).to.be.true
    })

    it('should return falsy', () => {
      expect(isPlainObject([{foo: 'bar'}])).to.be.false
    })
  })

})
