import bcrypt from 'bcrypt'
import db from '../../libs/db'

const users = db('users')

const findByEmail = function* (email) {
  return yield users.find({
    email: email
  })
}

const isPassword = (encodedPassword, password) => {
  return bcrypt.compareSync(encodedPassword, password)
}

const create = function* (user) {
  const salt = bcrypt.genSaltSync()
  user.password = bcrypt.hashSync(user.password, salt)
  user.createdAt = new Date()
  return yield users.insert(user)
}

const cleardb = function* () {
  return yield users.remove()
}

export default {
  create,
  findByEmail,
  isPassword,
  cleardb
}
