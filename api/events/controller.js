'use strict'

const _   = require('lodash')
  , Event = require('./model')

exports.index = function* () {
  let login = this.user.login

  try {
    this.body = yield Event.find(login)
  } catch(err) {
    this.throw(500, err)
  }
}

exports.create = function* () {
  let login = this.user.login
    , event = this.request.body

  try {
    this.body = yield Event.create(login, event)
  } catch(err) {
    this.throw(500, err)
  }
}

exports.update = function* () {
  let login = this.user.login
    , body = this.request.body
    , id = this.params.id
    , event = _.assign(body, {id: id})

  try {
    this.body = yield Event.update(login, event)
  } catch(err) {
    this.throw(500, err)
  }
}

exports.show = function* () {
  let login = this.user.login
    , id = this.params.id

  try {
    this.body = yield Event.get(login, id)
  } catch(err) {
    console.log(err)
    this.throw(500, err)
  }
}

exports.delete = function* () {
  let login = this.user.login
    , id = this.params.id

  try {
    this.body = yield Event.delete(login, id)
  } catch(err) {
    this.throw(500, err)
  }
}
