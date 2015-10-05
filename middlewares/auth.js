import User from '../api/users/collection'

const unauthorized = function* (next) {
  let isCreateUser = this.method === 'POST' &&
    this.path === '/v1/users'

  if (isCreateUser) return yield* next

  this.status = 401
  this.set('WWW-Authenticate', 'Basic realm="sample"')

  if (this.accepts(['html', 'json']) === 'json') {
    this.body = {
      error: 'unauthorized',
      reason: 'login first'
    }
  } else {
    this.body = 'login first'
  }
}

const Auth = function() {
  return function* (next) {
    let authorization = ((this.get('authorization') || '').split(' ')[1] || '').trim()

    if (!authorization) {
      return yield* unauthorized.call(this, next)
    }

    authorization = new Buffer(authorization, 'base64').toString().split(':')

    if (authorization.length !== 2) {
      return yield* unauthorized.call(this, next)
    }

    let user
      , login = authorization[0]
      , password = authorization[1]

    try {
      user = yield User.auth(login, password)
    } catch(err) {
      this.throw(500, err)
    }

    if (!user) return yield* unauthorized.call(this, next)

    this.user = {name: login, password: password}
    yield* next
  }
}

module.exports = Auth
