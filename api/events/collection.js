import db from '../../libs/db'

const events = db('events')

export function *findAll() {
  return yield events.find({})
}

export function *findByUser(user) {
  return yield events.find({
    'user.name': user.name
  })
}

export function *findById(id) {
  return yield events.findById(id)
}

export function *create(data) {
  data.status = 'ACTIVE'
  return yield events.insert(data)
}

export function *update(id, data) {
  const options = {new: true}
    , query = {_id: id}
    , mod = {$set: data}
  return yield events.findAndModify(query, mod, options)
}

export function *remove(id) {
  return yield events.remove({_id: id})
}
