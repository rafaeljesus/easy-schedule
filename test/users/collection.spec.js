import * as User from '../../api/users/collection'
import db from '../../libs/db'

describe('User:CollectionSpec', () => {

  let fixture = {
    email: 'foo@gmail.com',
    password: '123456'
  }

  afterEach(function *() {
    yield db('users').remove()
  })

  describe('.create', () => {

    it('should create a new user', function *() {
      try {
        let res = yield User.create(fixture)
        expect(res._id).to.exist
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.findByEmail', () => {

    beforeEach(function *() {
      yield User.create(fixture)
    })

    it('should find user by email', function *() {
      try {
        let user = yield User.findByEmail(fixture.email)
        expect(user).to.exist
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe.skip('.isPassword', () => {

    let user

    beforeEach(function *() {
      user = yield User.create(fixture)
    })

    it('should validate password', function *() {
      const check = User.isPassword(fixture.password, user.password)
      expect(check).to.be.true
    })

  })

})
