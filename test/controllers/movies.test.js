const chai = require('chai')
const mongoose = require('mongoose')
const server = require('../../app/server')
const seedDb = require('../../app/db/seed')
const moviesSeedData = require('../../app/db/seedData/movies.json')

const { expect } = chai

const checkForParams = async (params, expectedSeedData) => {
  const res = await server.inject({
    method: 'GET',
    url:
      '/movies?' +
      Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
  })

  const body = JSON.parse(res.body)
  expect(body.length).to.equal(expectedSeedData.length)
  body.forEach(movie => {
    const movieInExpectedSeedData = expectedSeedData.find(m => m._id === movie._id)
    expect(movie).to.eql(movieInExpectedSeedData)
  })
}

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
      expect(movies).to.have.lengthOf(10)
    })

    it('should limit results based on query', async () => {
      try {
        const res = await server.inject({
          method: 'GET',
          url: '/movies?limit=5'
        })

        const movies = JSON.parse(res.body)
        expect(movies).to.have.lengthOf(5)
      } catch (err) {
        console.error(err)
      }
    })

    it('should not exceed default limit', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/movies?limit=15'
      })

      const movies = JSON.parse(res.body)
      expect(movies).to.have.lengthOf(10)
    })

    it('should return movie based on imdb id', async () => {
      const imdbId = 'tt0068646'
      const expectedSeedData = moviesSeedData.filter(m => m.imdbId === imdbId)
      await checkForParams({ imdbId }, expectedSeedData)
    })

    it('should return movie based on id', async () => {
      const id = '5c15afd96197100a1201cc59'
      const expectedSeedData = moviesSeedData.filter(m => m._id === id)
      await checkForParams({ id }, expectedSeedData)
    })

    it('should return movie based on title', async () => {
      const title = 'The Godfather'
      const expectedSeedData = moviesSeedData.filter(m => m.title === title)
      await checkForParams({ title }, expectedSeedData)
    })

    it('should return movies based on search param', async () => {
      const title = 'the godfather'
      const expectedSeedData = moviesSeedData.filter(m => {
        const rgx = new RegExp(title, 'i')
        rgx.test(m.title)
      })
      await checkForParams({ title }, expectedSeedData)
    })

    it('should return movies released in given years range', async () => {
      const minYear = 1990
      const maxYear = 1995
      const expectedSeedData = moviesSeedData
        .filter(m => m.year >= minYear && m.year <= maxYear)
        .slice(0, 10)
      await checkForParams({ minYear, maxYear }, expectedSeedData)
    })

    it('should return movies with given runtime', async () => {
      const minRuntime = 130
      const maxRuntime = 135
      const expectedSeedData = moviesSeedData
        .filter(m => m.runtime >= minRuntime && m.runtime <= maxRuntime)
        .slice(0, 10)
      await checkForParams({ minRuntime, maxRuntime }, expectedSeedData)
    })

    it('should return movies with given genre', async () => {
      const genre = 'Drama'
      const expectedSeedData = moviesSeedData.filter(m => m.genre.includes(genre)).slice(0, 10)
      await checkForParams({ genre }, expectedSeedData)
    })

    it('should return movies with given actor', async () => {
      const actor = 'Marlon Brando'
      const expectedSeedData = moviesSeedData.filter(m => m.actors.includes(actor)).slice(0, 10)
      await checkForParams({ actor }, expectedSeedData)
    })

    it('should return movies with given director', async () => {
      const director = 'Francis Ford Coppola'
      const expectedSeedData = moviesSeedData
        .filter(m => m.director.includes(director))
        .slice(0, 10)
      await checkForParams({ director }, expectedSeedData)
    })

    it('should return movies with given language', async () => {
      const language = 'English'
      const expectedSeedData = moviesSeedData
        .filter(m => m.language.includes(language))
        .slice(0, 10)
      await checkForParams({ language }, expectedSeedData)
    })

    it('should return movies with given country', async () => {
      const country = 'USA'
      const expectedSeedData = moviesSeedData.filter(m => m.country.includes(country)).slice(0, 10)
      await checkForParams({ country }, expectedSeedData)
    })

    it('should get second page', async () => {
      // count from 0
      const page = 1
      const expectedSeedData = moviesSeedData.slice(10, 20)
      await checkForParams({ page }, expectedSeedData)
    })
  })

  describe('POST /movies', () => {
    it('should fail when title is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/movies'
      })

      expect(res.statusCode).to.equal(400)
    })

    it('should fail if movie already exists', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/movies',
        body: { title: 'The Godfather' }
      })

      expect(res.statusCode).to.equal(409)
    })

    it("should fail if movie doesn't exist on omdb", async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/movies',
        body: { title: '!this-movie-doesntExist' }
      })

      expect(res.statusCode).to.equal(404)
    })

    it('should fetch rest of the data from omdb, save and return', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/movies',
        body: { title: 'Braveheart' }
      })

      expect(res.statusCode).to.equal(201)
    })
  })
})
