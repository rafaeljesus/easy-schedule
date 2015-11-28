import * as User from '../../api/users/collection'
import db from '../../libs/db'

describe('Routes:Token', () => {

  describe('POST /v1/token', () => {

    let fixture

    beforeEach(function *() {
      fixture = {
        name: 'foo',
        email: 'foo@gmail.com',
        password: '12345678'
      }
      yield User.create(fixture)
    })

    afterEach(function *() {
      yield db('users').remove()
    })

    describe('status 200', () => {
      it('returns authenticated user token', done => {
        request.
          post('/v1/token').
          send({
            email: fixture.email,
            password: '12345678'
          }).
          expect(200).
          end((err, res) => {
            expect(res.body).to.include.keys('token')
            done(err)
          })
      })
    })

    describe('status 401', () => {
      it.skip('throws error when password is incorrect', done => {
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
            password: '12345678'
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
