import Users from '../../api/users/collection'

describe('Routes:Token', () => {

  describe('POST /v1/token', () => {

    const fixture = {
      name: 'foo',
      email: 'foo@gmail.com',
      password: '123456'
    }

    beforeEach(function* () {
      try {
        yield Users.cleardb()
        yield Users.create(fixture)
      } catch(err) {
        expect(err).to.not.exist
      }
    });

    describe('status 200', () => {
      it('returns authenticated user token', done => {
        request.
          post('/v1/token').
          send({
            email: fixture.email,
            password: fixture.password
          }).
          expect(200).
          end((err, res) => {
            expect(res.body).to.include.keys('token')
            done(err)
          })
      })
    })

    describe('status 401', () => {
      it('throws error when password is incorrect', done => {
        request.
          post('/v1/token').
          send({
            email: fixture.email,
            password: 'INVALID'
          }).
          expect(401, done)
      })

      it('throws error when email not exist', done => {
        request.
          post('/v1/token').
          send({
            email: 'INVALID',
            password: fixture.password
          }).
          expect(401, done)
      });

      it('throws error when email and password are blank', done => {
        request.
          post('/v1/token').
          expect(401, done)
      })
    })

  })

})
