'use strict'

const supertest = require('supertest')
  , mocha       = require('mocha')
  , expect      = require('chai').expect
  , redis       = require('../../lib/redis')
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , User        = require('../../api/users/model')

require('co-mocha')(mocha)

describe('UserControllerSpec', () => {

  let login = 'user-login'
    , password = 'user-password'

  afterEach(function* () {
    try {
      yield redis.flushdb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('POST /v1/users', () => {
    it('should create a user', done => {
      request
        .post('/v1/users')
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .send({login: login, password: password})
        .expect('Content-Type', /json/)
        .expect(201, (err, res) => {
          if (err) return done(err)
          expect(res.statusCode).to.be.equal(201)
          expect(res.body.message).to.be.equal('User was successfully created')
          done()
        })
    })
  })

  describe('DELETE /v1/users', () => {

    before(function* () {
      try {
        yield User.create(login, password)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should delete a user', done => {
      request
        .delete('/v1/users')
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err) return done(err)
          expect(res.statusCode).to.be.equal(200)
          expect(res.body.message).to.be.equal('User was successfully deleted')
          done()
        })
    })
  })

})
