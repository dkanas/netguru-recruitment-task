const expect = require('chai').expect
const mongoose = require('mongoose')
const server = require('../../app/server')
const seedDb = require('../../app/db/seed')
const moviesSeedData = require('../../app/db/seedData/movies.json')

describe('Movies controller', () => {
  // hooks for setup and teardown
  before(function() {
    this.timeout(20000)
    return seedDb()
  })
  after(() => {
    server.close()
    mongoose.disconnect()
  })

  describe('GET /movies', () => {
    it('should use default limit if no limit specified', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/movies'
      })

      const movies = JSON.parse(res.body)
      expect(movies).to.have.lengthOf.at.most(10)
    })

    it('should limit results based on query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/movies?limit=5'
      })

      const movies = JSON.parse(res.body)
      expect(movies).to.have.lengthOf.at.most(5)
    })

    it('should not exceed default limit', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/movies?limit=15'
      })

      const movies = JSON.parse(res.body)
      expect(movies).to.have.lengthOf.at.most(10)
    })

    it('should return movie based on imdb id', async () => {
      const imdbId = 'tt0068646'
      const res = await server.inject({
        method: 'GET',
        url: '/movies?imdbId=' + imdbId
      })

      const movies = JSON.parse(res.body)
      const seedDataMovie = moviesSeedData.find(m => m.imdbId === imdbId)
      expect(movies).to.have.lengthOf(1)
      expect(movie).to.eql(seedDataMovie)
    })
  })
})
