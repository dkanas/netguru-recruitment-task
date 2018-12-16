const Movie = require('../models/movie')

const moviesController = model => ({
  getAll: (req, rep) => model.find().then(data => rep.send(data)),
  create: (req, rep) => rep.send(req.body)
})

module.exports = moviesController(Movie)
