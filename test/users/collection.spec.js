import User from '../../api/users/collection'

describe('User:CollectionSpec', () => {

  let fixture = {
    email: 'foo@gmail.com',
    password: '123456'
  }

  afterEach(function* () {
    try {
      yield User.cleardb()
    } catch(err) {
      expect(err).to.not.exist
    }
  })

  describe('.create', () => {

    it('should create a new user', function* () {
      try {
        let res = yield User.create(fixture)
        expect(res._id).to.exist
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe('.findByEmail', () => {

    before(function* () {
      try {
        yield User.create(fixture)
      } catch(err) {
        expect(err).to.not.exist
      }
    })

    it('should find user by email', function* () {
      try {
        let user = yield User.findByEmail(fixture.email)
        expect(user).to.exist
      } catch(err) {
        expect(err).to.not.exist
      }
    })
  })

  describe.skip('.isPassword', () => {

  })

})
