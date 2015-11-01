import passport from 'passport'
import {Strategy} from 'passport-jwt'
import Users from '../api/users/collection'
import cfg from './config'

const options = {secretOrKey: cfg.jwt.secret}

module.exports = (() => {

  const strategy = Strategy(options, (payload, done) => {
    Users.findById(payload.id).
      then(user => {
        if (user) {
          return done(null, {
            id: user.id,
            email: user.email
          })
        }
        done(null, false)
      }).
      catch(error => done(error, null))
  })

  passport.use(strategy)

  return {
    initialize: () => {
      return passport.initialize()
    },
    authenticate: () => {
      return passport.authenticate('jwt', cfg.jwt.session)
    }
  }
})()
