const escapeRegexString = require('escape-regex-string')
const get = require('lodash/get')

const Movie = require('../models/movie')
const omdb = require('../services/omdb')
const { normalizeMovieFromOMDB, parseAndValidateLimit } = require('../helpers/common')
const buildError = require('../helpers/error')

const PAGE_LIMIT = 10

function buildQuery(model, params) {
  const {
    title,
    minYear,
    maxYear,
    minRuntime,
    maxRuntime,
    genre,
    director,
    actor,
    language,
    country,
    imdbId,
    id,
    limit,
    search,
    page
  } = params

  const query = model.find()

  if (title) query.where('title').equals(title)
  if (minYear) query.where('year').gte(Number(minYear))
  if (maxYear) query.where('year').lte(Number(maxYear))
  if (minRuntime) query.where('runtime').gte(Number(minRuntime))
  if (maxRuntime) query.where('runtime').lte(Number(maxRuntime))
  if (genre) query.where('genre').equals(genre)
  if (director) query.where('director').equals(director)
  if (actor) query.where('actors').equals(actor)
  if (language) query.where('language').equals(language)
  if (country) query.where('country').equals(country)
  if (imdbId) query.where('imdbId').equals(imdbId)
  if (id) query.where('_id').equals(id)
  if (search) query.regex('title', escapeRegexString(search), 'i')
  if (title || id || imdbId) query.limit(1)
  else {
    const validLimit = parseAndValidateLimit(limit, PAGE_LIMIT)
    const parsedPage = Number(page)
    query.limit(validLimit)
    if (parsedPage) query.skip(parsedPage * PAGE_LIMIT)
  }

  return query.lean().exec()
}

const moviesController = model => ({
  get: async req => {
    // only search for one document if unique query params
    return await buildQuery(model, req.query)
  },
  create: async (req, rep) => {
    const title = get(req, 'body.title')
    if (!title) throw buildError(400, 'Missing title!')
    const existingMovie = await model
      .findOne({ title })
      .lean()
      .exec()
    if (existingMovie) throw buildError(409, 'Movie already exists!')

    const omdbRes = await omdb.get('/', {
      params: { t: title, plot: 'full' }
    })

    if (omdbRes.data.Response === 'False') throw buildError(404, 'Movie not found')
    const normalizedMovie = normalizeMovieFromOMDB(omdbRes.data)
    rep.status(201)
    return model.create(normalizedMovie)
  }
})

module.exports = moviesController(Movie)
