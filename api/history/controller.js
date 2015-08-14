'use strict'

const History = require('./model')

exports.index = function* (next) {
  let login = this.user.login
  this.body = yield History.find(login)
}
