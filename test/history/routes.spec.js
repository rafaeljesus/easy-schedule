import User from '../../api/users/collection'
import History from '../../api/history/collection'

describe('History:RoutesSpec', () => {

  let fixture = require('./fixture')()
    , name = 'foo'
    , password = 'bar'

  beforeEach(function* () {
    try {
      fixture.history1.user = {name: name}
      fixture.history2.user = {name: name}
      yield [
        History.create(fixture.history1),
        History.create(fixture.history2),
        User.create(name, password)
      ]
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  afterEach(function* () {
    try {
      yield History.cleardb()
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  describe('GET /v1/history', () => {
    it('should find event history', done => {
      request.
        get('/v1/history').
        auth(name, password).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })
})
