'use strict'

const History = require('./model')

exports.index = function* () {
  let login = this.user.login
  this.body = yield History.find(login)
}
