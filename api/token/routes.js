import jwt from 'jwt-simple'
import krouter from 'koa-router'
import {findByEmail, isPassword} from '../users/collection'
import cfg from '../../libs/config'

const router = krouter()
/**
 * @api {post} /token Auth token
 * @apiGroup Credentials
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParamExample {json} Input
 *    {
 *      "email": "john@connor.net",
 *      "password": "123456"
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
router.
  post('/', function* () {
    const email = this.request.body.email
      , password = this.request.body.password

    if (!email || !password) {
      return this.status = 401
    }

    try {
      let res = yield findByEmail(email)
      let user = res && res[0]

      if (!isPassword(user.password, password)) {
        return this.status = 401
      }

      const payload = {_id: user._id}
      this.type = 'json'
      this.status = 200
      this.body = {
        token: jwt.encode(payload, cfg.jwt.secret)
      }
    } catch(err) {
      this.status = 401
    }
  })

export default router
