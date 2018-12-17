const axios = require('axios')
const BASE_URL = 'https://www.omdbapi.com/'
const { OMDB_API_KEY } = process.env

const service = axios.create({ baseURL: BASE_URL, params: { apikey: OMDB_API_KEY } })

module.exports = service
