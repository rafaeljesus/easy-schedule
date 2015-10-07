import mongo from '../../lib/mongo'
import C from '../../lib/constants'

const events = mongo('events')

exports.findAll = function* () {
  return yield events.find({})
}

exports.findByUser = function* (user) {
  return yield events.find({
    'user.name': user.name
  })
}

exports.findById = function* (id) {
  return yield events.findById(id)
}

exports.create = function* (data) {
  data.status = C.ACTIVE
  return yield events.insert(data)
}

exports.update = function* (id, data) {
  let options = {new: true}
    , query = {_id: id}
    , mod = {$set: data}
  return yield events.findAndModify(query, mod, options)
}

exports.remove = function* (id) {
  return yield events.remove({_id: id})
}

exports.cleardb = function* () {
  return yield events.remove()
}
