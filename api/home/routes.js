import koaRouter from 'koa-router'

const router = koaRouter()

/**
 * @api {get} / API Status
 * @apiGroup Status
 * @apiSuccess {String} status API status message
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "Easy Schedule API"
 *    }
 */
router.get('/', function* () {
  this.type = 'json'
  this.status = 200
  this.body = {status: 'Easy Schedule API'}
})

export default router
