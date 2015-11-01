import krouter from 'koa-router'
import {findByUser} from './collection'

const router = krouter()

router.
  get('/', function* () {
    try {
      this.body = yield findByUser(this.user)
    } catch(err) {
      this.throw(500, err)
    }
  })

export default router
