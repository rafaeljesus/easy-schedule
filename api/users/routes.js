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

router.delete('/', function* () {
  let name = this.user.name
    , password = this.user.password

  try {
    yield remove(name, password)
    this.status = 200
    this.type = 'json'
    this.body = {message: 'User was successfully deleted'}
  } catch(err) {
    this.throw(500, err)
  }
})

export default router
