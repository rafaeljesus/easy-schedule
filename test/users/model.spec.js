'use strict'

const chai      = require('chai')
  , mocha       = require('mocha')
  , expect      = chai.expect
  , redis       = require('../../lib/redis')
  , User        = require('../../api/users/model')

require('co-mocha')(mocha)

describe('UserModel', () => {

  let login = 'rafaeljesus'
    , password = 'mypassword'

  afterEach(function* () {
    try {
      yield redis.flushdb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('.create', () => {

    it('should create a new user', function* () {
      try {
        let res = yield User.create(login, password)
        expect(res).to.be.equal('OK')
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.auth', () => {

    before(function* () {
      try {
        yield User.create(login, password)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should auth a user', function* () {
      try {
        let user = yield User.auth(login, password)
        expect(user).to.be.ok
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.delete', () => {

    before(function* () {
      try {
        yield User.create(login, password)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should delete a user', function* () {
      try {
        let res = yield User.delete(login, password)
        expect(res).to.be.equal(1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

})
