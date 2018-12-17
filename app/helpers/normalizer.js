class Normalizer {
  constructor() {
    this.handlers = {}
    this.normalize = this.normalize.bind(this)
  }
  registerHandler(field, fn) {
    this.handlers[field] = fn
  }
  registerMultipleKeysHandler(keys, fn) {
    keys.forEach(key => this.registerHandler(key, fn))
  }
  normalize(value, key) {
    const handler = this.handlers[key]
    return handler ? handler(value, key) : value
  }
}

module.exports = Normalizer
