import db from '../../libs/db'

const history = db('history')

export function *findByUser(user) {
  return yield history.find({
    'user.name': user.name
  })
}

export function *create(data) {
  return yield history.insert(data)
}
