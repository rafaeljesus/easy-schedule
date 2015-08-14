'use strict'

const chai      = require('chai')
  , mocha       = require('mocha')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , User        = require('../../api/users/model')

require('co-mocha')(mocha)

describe('UserModel', function() {

  let login = 'rafaeljesus'
    , password = 'mypassword'

  afterEach(function* (done) {
    try {
      yield redis.flushdb()
      done()
    } catch(err) {
      done(err)
    }
  })

  describe('#create', function() {

    it('should create a new user', function* (done) {
      try {
        let res = yield User.create(login, password)
        expect(res).to.be.equal('OK')
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('#auth', function() {

    before(function* (done) {
      try {
        yield User.create(login, password)
        done()
      } catch(err) {
        done(err)
      }
    })

    it('should auth a user', function* (done) {
      try {
        let user = yield User.auth(login, password)
        expect(user).to.be.ok
        done()
      } catch(err) {
        done(err)
      }
    })
  })

  describe('#delete', function() {

    before(function* (done) {
      try {
        yield User.create(login, password)
        done()
      } catch(err) {
        done(err)
      }
    })

    it('should delete a user', function* (done) {
      try {
        let res = yield User.delete(login, password)
        expect(res).to.be.equal(1)
        done()
      } catch(err) {
        done(err)
      }
    })
  })

})
