import mongo from '../../lib/mongo'
import C from '../../lib/constants'

const events = mongo('events')

const findAll = function* () {
  return yield events.find({})
}

const findByUser = function* (user) {
  return yield events.find({
    'user.name': user.name
  })
}

const findById = function* (id) {
  return yield events.findById(id)
}

const create = function* (data) {
  data.status = C.ACTIVE
  return yield events.insert(data)
}

const update = function* (id, data) {
  const options = {new: true}
    , query = {_id: id}
    , mod = {$set: data}
  return yield events.findAndModify(query, mod, options)
}

const remove = function* (id) {
  return yield events.remove({_id: id})
}

const cleardb = function* () {
  return yield events.remove()
}

export default {
  findAll,
  findByUser,
  findById,
  create,
  update,
  remove,
  cleardb
}
