const Comment = require('../models/comment')

const commentsController = model => ({
  getAll: (req, rep) => model.find().then(data => rep.send(data)),
  create: (req, rep) => rep.send(req.body)
})

module.exports = commentsController(Comment)
