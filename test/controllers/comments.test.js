const chai = require('chai')
const mongoose = require('mongoose')
const server = require('../../app/server')
const seedDb = require('../../app/db/seed')
const commentsSeedData = require('../../app/db/seedData/comments.json')

const { expect } = chai

const movie = '5c15afd96197100a1201cc59'
describe('Comments controller', () => {
  // hooks for setup
  before(function() {
    this.timeout(20000)
    return seedDb()
  })

  describe('GET /comments', () => {
    it('should use default limit if no limit specified', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/comments'
      })

      const { comments, totalCount } = JSON.parse(res.body)
      expect(comments).to.have.lengthOf(10)
      expect(totalCount).to.equal(commentsSeedData.length)
    })

    it('should limit results based on query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/comments?limit=5'
      })

      const { comments, totalCount } = JSON.parse(res.body)
      expect(comments).to.have.lengthOf(5)
      expect(totalCount).to.equal(commentsSeedData.length)
    })

    it('should not exceed default limit', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/comments?limit=15'
      })

      const { comments, totalCount } = JSON.parse(res.body)
      expect(comments).to.have.lengthOf(10)
      expect(totalCount).to.equal(commentsSeedData.length)
    })

    it('should return comments based on movie id', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/comments?movie=' + movie
      })

      const { comments } = JSON.parse(res.body)
      expect(comments).to.have.lengthOf(10)
      comments.forEach(comment => {
        expect(comment.movie).to.equal(movie)
      })
    })
  })

  describe('POST /comments', () => {
    it('should fail when author is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { content: 'a'.repeat(400), movie }
      })

      expect(res.statusCode).to.equal(400)
    })

    it('should fail when content is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { author: 'author'.repeat(50), movie }
      })

      expect(res.statusCode).to.equal(400)
    })

    it('should fail when movie is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { author: 'author', content: 'a'.repeat(400) }
      })

      expect(res.statusCode).to.equal(400)
    })

    it('should fail when content is too long', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { content: 'a'.repeat(8500), author: 'author', movie }
      })

      expect(res.statusCode).to.equal(400)
    })

    it('should fail when author is too long', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { author: 'author'.repeat(50), content: 'a'.repeat(400), movie }
      })

      expect(res.statusCode).to.equal(400)
    })

    it('should fail when assigned movie is not found', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { author: 'author', movie: '5c183052ae735e8f7057ffb0', content: 'more gibberish' }
      })

      expect(res.statusCode).to.equal(404)
    })

    it('should fail if assigned movie id is invalid', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/comments',
        body: { author: 'author', movie: 'gibberish', content: 'more gibberish' }
      })

      expect(res.statusCode).to.equal(400)
    })
  })
})
