import User from '../../api/users/collection'

describe('HomeRoutesSpec', () => {

  let name = 'user-login'
    , pass = 'user-password'

  before(function* () {
    try {
      yield User.create(name, pass)
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  afterEach(function* () {
    try {
      yield User.cleardb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  it('should respond 200', done => {
    request.
      get('/v1').
      auth(name, pass).
      expect('Content-Type', /json/).
      expect(200, done)
  })

})
