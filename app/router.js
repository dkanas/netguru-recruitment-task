const moviesController = require('./controllers/movies')
const commentsController = require('./controllers/comments')

const router = async fastify => {
  // movies routes
  fastify.get('/movies', moviesController.get)
  fastify.post('/movies', moviesController.create)

  // comments routes
  fastify.get('/comments', commentsController.getAll)
  fastify.post('/comments', commentsController.create)
}

module.exports = router
