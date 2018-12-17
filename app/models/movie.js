const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  year: Number,
  rated: String,
  released: Date,
  runtime: Number,
  genre: [String],
  director: [String],
  writer: String,
  actors: [String],
  plot: String,
  language: [String],
  country: [String],
  awards: String,
  poster: String,
  ratings: [{ source: String, value: Number }],
  metascore: Number,
  imdbRating: Number,
  imdbVotes: Number,
  imdbId: {
    type: String,
    unique: true
  },
  type: String,
  dvd: Date,
  boxOffice: String,
  production: String,
  website: String
})

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie
