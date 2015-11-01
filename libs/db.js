import monk from 'monk'
import wrap from 'co-monk'

let db;

export default name => {
  if (!db) {
    db = monk('localhost/schedule')
  }
  return wrap(db.get(name))
}
