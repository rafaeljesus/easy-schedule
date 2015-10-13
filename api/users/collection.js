import mongo from '../../lib/mongo'

const users = mongo('users')

const create = function* (name, password) {
  return yield users.insert({
    name: name,
    password: password,
    createdAt: new Date()
  })
}

const auth = function* (name, password) {
  return yield users.find({
    name: name,
    password: password
  })
}

const remove = function* (name, password) {
  return yield users.remove({
    name: name,
    password: password
  })
}

const cleardb = function* () {
  return yield users.remove()
}

export default {
  create,
  auth,
  remove,
  cleardb
}
