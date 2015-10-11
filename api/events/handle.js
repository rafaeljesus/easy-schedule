import co from 'co'
import request from 'co-request'
import History from '../history/collection'
import log from '../../lib/log'

const fn = event => {
  return co(function* () {
    let res = yield request(event.url)
    let logObj = {
      statusCode: res.statusCode,
      body: res.body,
      headers: res.headers
    }
    log.info('succesfully sent cron job request', logObj)
    logObj.event = event._id
    logObj.user = event.user
    logObj.url = event.url
    return yield History.create(logObj)
  }).
  catch(err => log.error('failed to send cron job request', err))
}

export default fn
