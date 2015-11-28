import krouter from 'koa-router'
import * as User from './collection'
import auth from '../../libs/auth'

const router = krouter()

router.
  /**
   * @api {post} /v1/users Create User
   * @apiGroup Users
   * @apiParam {String} email Email
   * @apiParam {String} password Password
   * @apiParamExample {json} Input
   *    {
   *      "email": "rafael@gmail.com",
   *      "password": "123456"
   *    }
   * @apiSuccess {Number} id User Id
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 201 OK
   *    {
   *      "_id": 1,
   *    }
   * @apiErrorExample {json} Erro no cadastro
   *    HTTP/1.1 412 Precondition Failed
   */
  post('/v1/users', function *() {
    try {
      const res = yield User.create(this.request.body)
      this.status = 201
      this.body = res._id
    } catch (err) {
      this.throw(412, err)
    }
  }).
  /**
   * @api {delete} /v1/users Delete user
   * @apiGroup Users
   * @apiHeader {String} Authorization User Token
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Error
   *    HTTP/1.1 412 Precondition Failed
   */
  del('/v1/users', auth.authenticate(), function *() {
    const _id = this.params.id
    try {
      yield User.remove({_id: _id})
      this.status = 204
    } catch (err) {
      this.throw(412, err)
    }
  })

export default router
