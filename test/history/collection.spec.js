import History from '../../api/history/collection'

describe('History:CollectionSpec', () => {

  let user = {name: 'foo'}
  let fixture = require('./fixture')()

  afterEach(function* () {
    try {
      yield History.cleardb()
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  describe('.findByUser', () => {

    before(function* () {
      try {
        fixture.history1.user = user
        fixture.history2.user = user
        yield [
          History.create(fixture.history1),
          History.create(fixture.history2)
        ]
      } catch(err) {
        expect(err).to.not.exist
      }
    })

    it('should find all history', function* () {
      try {
        let res = yield History.findByUser(user)
        expect(res.length).to.be.equal(2)
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.create', () => {

    it('should create a history event', function* () {
      try {
        let res = yield History.create(fixture.history1)
        expect(res._id).to.exist
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

})
