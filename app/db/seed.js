const connectToDB = require('./index').connect
const Movie = require('../models/movie')
const Comment = require('../models/comment')
const movies = require('./seedData/movies.json')
const comments = require('./seedData/comments.json')

connectToDB().then(async () => {
  console.log('Clearing and seeding DB...')
  await Movie.deleteMany()
  await Comment.deleteMany()
  await Movie.create(movies)
  await Comment.create(comments)
  console.log('Done!')
  process.exit()
})
