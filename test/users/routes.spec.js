import jwt from 'jwt-simple'
import * as User from '../../api/users/collection'
import cfg from '../../libs/config'
import db from '../../libs/db'

describe('User:RoutesSpec', () => {

  afterEach(function *() {
    yield db('users').remove()
  })

  describe('POST /v1/users', () => {
    it('should create a user', done => {
      request.
        post('/v1/users').
        // set('Accept', 'application/json').
        // set('Accept-Encoding', 'gzip').
        send({email: 'rafael@gmail.com', password: '123456'}).
        expect('Content-Type', /json/).
        expect(201).
        end((err, res) => {
          expect(res.body._id).to.exist
        })
    })
  })

  describe('DELETE /v1/users', () => {

    let token
      , body = {email: 'rafael@gmail.com', password: '123456'}

    beforeEach(function *() {
      try {
        let res = yield User.create(body)
        token = jwt.encode({_id: res._id}, cfg.jwt.secret)
      } catch (err) {
        expect(err).to.not.exist
      }
    })

    it('should delete a user', done => {
      request.
        delete('/v1/users').
        set('Accept', 'application/json').
        set('Authorization', `JWT ${token}`).
        set('Accept-Encoding', 'gzip').
        expect(204, done)
    })
  })

})
