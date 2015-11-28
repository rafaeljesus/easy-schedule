import bcrypt from 'bcrypt'
import db from '../../libs/db'

const users = db('users')

export function *findById(_id) {
  return yield users.findById(_id)
}

export function *findByEmail(email) {
  return yield users.findOne({
    email: email
  })
}

export function *create(user) {
  user.password = bcrypt.hashSync(user.password, 6)
  user.createdAt = new Date()
  return yield users.insert(user)
}

export function isPassword(password, encodedPassword) {
  return bcrypt.compareSync(password, encodedPassword)
}
