const coap = require('coap')

const listen = networkInterface => {
  const server = coap.createServer({
    multicastAddress: '224.0.1.187',
    multicastInterface: networkInterface,
  })

  server.on('request', (req, res) => {
    console.log('Request!')
    console.log(req)
    console.log('payload:', req.payload.toString())
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
