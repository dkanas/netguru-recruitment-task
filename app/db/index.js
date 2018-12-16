const mongoose = require('mongoose')
const times = require('lodash/times')
mongoose.Promise = Promise

const INITIAL_CONNECT_RETRIES = 5
const INITIAL_CONNECT_RETRIES_INTERVAL = 5000
const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
const connect = async retryCount => {
  try {
    await mongoose.connect(process.env.DB_URI)
  } catch (err) {
    if (retryCount === 0) throw err
    await sleep(INITIAL_CONNECT_RETRIES_INTERVAL)
    return connect(retryCount - 1)
  }
}

const connectWithFastify = async fastify =>
  connect()
    .then(() => fastify.log.info('Connected to DB'))
    .catch(err => fastify.log.error(err))

module.exports = {
  connectWithFastify,
  connect
}
