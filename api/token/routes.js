import jwt from 'jwt-simple'
import krouter from 'koa-router'
import * as User from '../users/collection'
import cfg from '../../libs/config'

const router = krouter()

router.
  /**
  * @api {post} /token Auth token
  * @apiGroup Credentials
  * @apiParam {String} email User email
  * @apiParam {String} password User password
  * @apiParamExample {json} Input
  *    {
  *      "email": "rafael@gmail.com",
  *      "password": "12345678"
  *    }
  * @apiSuccess {String} token Token of authenticated user
  * @apiSuccessExample {json} Success
  *    HTTP/1.1 200 OK
  *    {
  *      "token": "xyz.abc.123.hgf"
  *    }
  * @apiErrorExample {json} Auth error
  *    HTTP/1.1 401 Unauthorized
  */
  post('/v1/token', function *() {
    const email = this.request.body.email
    const password = this.request.body.password

    if (!email || !password) {
      return this.status = 401
    }

    try {
      let user = yield User.findByEmail(email)
      if (!user) return this.status = 401

      // FIXME
      // if (!isPassword(password, user.password)) {
      //   return this.status = 401
      // }

      const payload = {_id: user._id}
      this.status = 200
      this.body = {
        token: jwt.encode(payload, cfg.jwt.secret)
      }
    } catch (err) {
      this.status = 401
    }
  })

export default router
