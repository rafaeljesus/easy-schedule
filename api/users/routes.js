import koaRouter from 'koa-router'
import {create, remove} from './collection'

const router = koaRouter()

router.post('/', function* () {
  let login = this.request.body.login
    , password = this.request.body.password

  try {
    yield create(login, password)
    this.status = 201
    this.type = 'json'
    this.body = {message: 'User was successfully created'}
  } catch(err) {
    this.throw(500, err)
  }
})

/**
 * @api {delete} /v1/users Exclude a user
 * @apiGroup Users
 * @apiHeader {String} Basic Authorization
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 User was successfully deleted
 * @apiErrorExample {json} Error
 *    HTTP/1.1 422 Precondition Failed
 */
router.delete('/', function* () {
  let name = this.user.name
    , password = this.user.password

  try {
    yield remove(name, password)
    this.status = 200
    this.type = 'json'
    this.body = {message: 'User was successfully deleted'}
  } catch(err) {
    this.throw(422, err)
  }
})

export default router
