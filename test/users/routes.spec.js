import User from '../../api/users/collection'

describe('UserRoutesSpec', () => {

  let name = 'user-login'
    , password = 'user-password'

  afterEach(function* () {
    try {
      yield User.cleardb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('POST /v1/users', () => {
    it('should create a user', done => {
      request.
        post('/v1/users').
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        send({name: name, password: password}).
        expect('Content-Type', /json/).
        expect(201, done)
    })
  })

  describe('DELETE /v1/users', () => {

    before(function* () {
      try {
        yield User.create(name, password)
      } catch(err) {
        expect(err).to.not.exist
      }
    })

    it('should delete a user', done => {
      request.
        delete('/v1/users').
        auth(name, password).
        set('Accept', 'application/json').
        set('Accept-Encoding', 'gzip').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

})
