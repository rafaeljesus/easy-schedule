import co from 'co'
import passport from 'passport'
import {Strategy} from 'passport-jwt'
import User from '../api/users/collection'
import cfg from './config'

const options = {secretOrKey: cfg.jwt.secret}

module.exports = (() => {

  const strategy = new Strategy(options, (payload, done) => {
    return co(function *() {
      try {
        console.log('on strategy')
        let user = yield User.findById(payload._id)
        if (!user) return done(null, false)
        return done(null, user)
      } catch (err) {
        console.log('failed to authenticate user', err)
        done(err, null)
      }
    })
  })

  passport.use(strategy)

  return {
    initialize: () => {
      return function *() {
        return passport.initialize()
      }
    },

    authenticate: () => {
      return function *() {
        console.log('authenticate')
        return passport.authenticate('jwt', cfg.jwt.session)
      }
    }
  }

})()
