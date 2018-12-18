const Normalizer = require('./normalizer')
const { camelCase, isArray, isPlainObject } = require('lodash')

// takes a string, replaces all non-numeric and non-dot characters
// and parses the result as float
function removeNonNumericAndParse(str) {
  return parseFloat(str.replace(/[^\d.]/g, ''), 10)
}

// splits comma+space separated strings
function valuesStrToArr(str, delimiter = ', ') {
  return str.split(delimiter)
}

function transformObject(obj, reducer) {
  return Object.entries(obj).reduce(reducer, {})
}

// recursively transform data from OMDB api
// obj: movie from omdb
// transKeyFn: (key) => key
// transValueFn: (value, key) => value
function getNormalizedData(obj, transKeyFn = key => key, transValFn = val => val) {
  const recurCall = arg => getNormalizedData(arg, transKeyFn, transValFn)

  const maybeArray = arg => isArray(arg) && arg.map(recurCall)
  const maybeObject = arg => isPlainObject(arg) && recurCall(arg)

  // resolve the value
  const resolve = (val, key) => maybeArray(val) || maybeObject(val) || transValFn(val, key)

  // reducer fn for transforming the object
  const reducer = (acc, [key, val]) => ({ ...acc, [transKeyFn(key)]: resolve(val, key) })
  return transformObject(obj, reducer)
}

function normalizeMovieFromOMDB(movie) {
  const normalizer = new Normalizer()
  normalizer.registerMultipleKeysHandler(
    ['BoxOffice', 'Year', 'Runtime', 'Metascore', 'imdbRating', 'imdbVotes'],
    removeNonNumericAndParse
  )
  normalizer.registerMultipleKeysHandler(
    ['Genre', 'Actors', 'Language', 'Country', 'Director'],
    str => valuesStrToArr(str)
  )
  normalizer.registerHandler('Value', val => parseFloat(val.replace(', ', '.')))
  return getNormalizedData(movie, camelCase, normalizer.normalize)
}

function parseAndValidateLimit(limit, maxLimit) {
  const parsedLimit = Number(limit)
  return parsedLimit && parsedLimit <= maxLimit ? parsedLimit : maxLimit
}

function buildResultsQuery(getBaseQuery) {
  return getBaseQuery().exec()
}

function buildTotalCountQuery(getBaseQuery) {
  return getBaseQuery()
    .skip(0)
    .limit(0)
    .count()
    .exec()
}

module.exports = {
  removeNonNumericAndParse,
  valuesStrToArr,
  normalizeMovieFromOMDB,
  parseAndValidateLimit,
  buildResultsQuery,
  buildTotalCountQuery
}
