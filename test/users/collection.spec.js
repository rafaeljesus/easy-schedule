import User from '../../api/users/collection'

describe('User:CollectionSpec', () => {

  let name = 'rafaeljesus'
    , password = 'mypassword'

  afterEach(function* () {
    try {
      yield User.cleardb()
    } catch(err) {
      expect(err).to.not.be.ok
    }
  })

  describe('.create', () => {

    it('should create a new user', function* () {
      try {
        let res = yield User.create(name, password)
        expect(res._id).to.exist
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.auth', () => {

    before(function* () {
      try {
        yield User.create(name, password)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should auth a user', function* () {
      try {
        let user = yield User.auth(name, password)
        expect(user).to.exist
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

  describe('.delete', () => {

    before(function* () {
      try {
        yield User.create(name, password)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })

    it('should delete a user', function* () {
      try {
        let res = yield User.remove(name, password)
        expect(res).to.be.equal(1)
      } catch(err) {
        expect(err).to.not.be.ok
      }
    })
  })

})
