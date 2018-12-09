const coap = require('coap')

const Message = require('./message')

const listen = (requestHandler, networkInterface) => {
  const server = coap.createServer({
    multicastAddress: '224.0.1.187',
    multicastInterface: networkInterface,
  })

  server.on('request', req => {
    if (req.code === '0.30' && req.url === '/cit/s' && requestHandler) {
      requestHandler.call(server, new Message(req))
    }
  })

  return new Promise((resolve, reject) => {
    server.listen(err => {
      if (err) {
        reject(err, server)
      } else {
        resolve(server)
      }
    })
  })
}

module.exports = listen
