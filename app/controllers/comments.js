const { ObjectId } = require('mongoose').Types
const Comment = require('../models/comment')
const Movie = require('../models/movie')
const {
  parseAndValidateLimit,
  buildResultsQuery,
  buildTotalCountQuery
} = require('../helpers/common')
const buildError = require('../helpers/error')

const PAGE_LIMIT = 10
function buildBaseQuery(model, params) {
  const { limit, page, movie } = params

  const validLimit = parseAndValidateLimit(limit, PAGE_LIMIT)
  const parsedPage = Number(page)
  const query = model.find()
  if (movie) query.where('movie').equals(movie)
  if (parsedPage) query.skip(validLimit * parsedPage)
  query.limit(validLimit)

  return query.lean()
}

const commentsController = (commentModel, movieModel) => ({
  get: async req => {
    const getBaseQuery = () => buildBaseQuery(commentModel, req.query)
    const [comments, totalCount] = await Promise.all([
      buildResultsQuery(getBaseQuery),
      buildTotalCountQuery(getBaseQuery)
    ])

    return { comments, totalCount }
  },
  create: async (req, rep) => {
    const { author, content, movie } = req.body

    if (!author) throw buildError(400, 'Author name missing!')
    if (!content) throw buildError(400, 'Content missing!')
    if (!movie) throw buildError(400, 'Movie id missing!')
    if (!ObjectId.isValid(movie)) throw buildError(400, 'Invalid movie id!')
    const assignedMovie = await movieModel.findById(movie)
    if (!assignedMovie) throw buildError(404, 'Assigned movie does not exist!')

    try {
      rep.status(201)
      return await commentModel.create(req.body)
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw buildError(400, 'Validation error!')
      }
    }
  }
})

module.exports = commentsController(Comment, Movie)
