import mongo from '../../lib/mongo'

const history = mongo('history')

export function* findByUser(user) {
  return yield history.find({
    'user.name': user.name
  })
}

export function* create(data) {
  return yield history.insert(data)
}

export function* cleardb() {
  return yield history.remove()
}
