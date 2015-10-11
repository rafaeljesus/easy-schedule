const fnToString = Function.prototype.toString
const objCtorString = fnToString.call(Object)
const getPrototypeOf = Object.getPrototypeOf
let proto = Object.prototype

exports.isPlainObject = value => {
  if (typeof value.constructor === 'function') {
    proto = getPrototypeOf(value)
  }
  if (!proto) return true
  const Ctor = proto.constructor

  return typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    fnToString.call(Ctor) === objCtorString
}
