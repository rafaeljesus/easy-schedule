import db from '../../libs/db'

const history = db('history')

const findByUser = function* (user) {
  return yield history.find({
    'user.name': user.name
  })
}

const create = function* (data) {
  return yield history.insert(data)
}

const cleardb = function* () {
  return yield history.remove()
}

export default {findByUser, create, cleardb}
