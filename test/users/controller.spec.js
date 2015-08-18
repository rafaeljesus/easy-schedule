'use strict'

const supertest = require('supertest')
  , mocha       = require('mocha')
  , expect      = require('chai').expect
  , redis       = require('../../lib/redis')
  , app         = require('../../app')
  , request     = supertest(app.listen())
  , User        = require('../../api/users/model')

require('co-mocha')(mocha)

describe('UserControllerSpec', function() {

  let login = 'user-login'
    , password = 'user-password'

  afterEach(function* (done) {
    try {
      yield redis.flushdb()
      done()
    } catch(err) {
      done(err)
    }
  })

  describe('POST /v1/users', function() {
    it('should create a user', function(done) {
      request
        .post('/v1/users')
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .send({login: login, password: password})
        .expect('Content-Type', /json/)
        .expect(201, function(err, res) {
          if (err) return done(err)
          expect(res.statusCode).to.be.equal(201)
          expect(res.body.message).to.be.equal('User was successfully created')
          done()
        })
    })
  })

  describe('DELETE /v1/users', function() {

    beforeEach(function* (done) {
      try {
        yield User.create(login, password)
        done()
      } catch(err) {
        done(err)
      }
    })

    it('should delete a user', function(done) {
      request
        .delete('/v1/users')
        .auth(login, password)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) return done(err)
          expect(res.statusCode).to.be.equal(200)
          expect(res.body.message).to.be.equal('User was successfully deleted')
          done()
        })
    })
  })

})
