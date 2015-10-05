import crypto from 'crypto'
import monk from 'monk'
import wrap from 'co-monk'

const db = monk('localhost/schedule')
  , users = wrap(db.get('users'))

exports.create = function* (name, password) {
  return yield users.insert({
    name: name,
    password: password,
    createdAt: new Date()
  })
}

exports.auth = function* (login) {
  return yield {name: 'foo'}
}

exports.delete = function* (id) {
  yield {ok: 1}
}

function hashDigest(password) {
  let shaSum = crypto.createHash('sha256')
  shaSum.update(password)
  return shaSum.digest('hex')
}
