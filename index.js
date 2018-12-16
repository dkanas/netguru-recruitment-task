const server = require('./app/server')

const PORT = process.env.PORT || 3000

server.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) throw err
  else server.log.info(`Server listening on ${address}.`)
})
