const fastify = require('fastify')({ logger: process.env.ENABLE_LOGGER })
const helmet = require('fastify-helmet')
const router = require('./router')
const db = require('./db').connectWithFastify

// fastify-helmet for basic security
fastify.register(helmet)

//db
fastify.register(db)

// routing
fastify.register(router)

module.exports = fastify
