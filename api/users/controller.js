'use strict'

const User  = require('./model')

exports.create = function* (next) {
  let login = this.request.body.login
    , password = this.request.body.password

  try {
    yield User.create(login, password)
    this.status = 201
    this.type = 'json'
    this.body = {message: 'User was successfully created'}
  } catch(err) {
    this.throw(500, err)
  }
}

exports.delete = function* (next) {
  let login = this.user.login
    , password = this.user.password

  try {
    yield User.delete(login, password)
    this.status = 200
    this.type = 'json'
    this.body = {message: 'User was successfully deleted'}
  } catch(err) {
    this.throw(500, err)
  }
}
