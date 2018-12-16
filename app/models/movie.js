const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  year: Number,
  rated: String,
  released: Date,
  runtime: Number,
  genre: [String],
  director: String,
  writer: String,
  actors: [String],
  plot: String,
  language: String,
  country: String,
  awards: String,
  poster: String,
  ratings: [{ source: String, value: Number }],
  metascore: Number,
  imdbRating: Number,
  imdbVotes: Number,
  imdbID: String,
  type: String,
  dvd: Date,
  boxOffice: String,
  production: String,
  website: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
