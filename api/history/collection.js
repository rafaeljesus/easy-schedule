import mongo from '../../lib/mongo'

const history = mongo('history')

exports.findByUser = function* (user) {
  return yield history.find({
    'user.name': user.name
  })
}

exports.create = function* (data) {
  return yield history.insert(data)
}

exports.cleardb = function* () {
  return yield history.remove()
}
