import User from '../../api/users/collection'
import {findByUser, create, cleardb} from '../../api/history/collection'

describe('History:RoutesSpec', () => {

  let fixture = require('./fixture')()
    , name = 'foo'
    , password = 'bar'

  beforeEach(function* () {
    try {
      fixture.history1.user = {name: name}
      fixture.history2.user = {name: name}
      yield [
        create(fixture.history1),
        create(fixture.history2),
        User.create(name, password)
      ]
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  afterEach(function* () {
    try {
      yield cleardb()
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
        expect(200, (err, res) => {
          if (err) return done(err)
          expect(res.body).to.have.length(2)
          done()
        })
    })
  })
})
