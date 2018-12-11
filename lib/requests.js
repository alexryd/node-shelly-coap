const coap = require('coap')

const Message = require('./message')

const agent = new coap.Agent()
// Because of a bug in Shelly devices we need to override _nextToken()
agent._nextToken = () => Buffer.alloc(0)

const request = (host, pathname, opts) => {
  return new Promise((resolve, reject) => {
    coap.request(
      Object.assign({
        host,
        pathname,
        agent,
      }, opts)
    )
      .on('response', res => {
        resolve(new Message(res))
      })
      .on('error', err => {
        reject(err)
      })
      .end()
  })
}

const getDescription = host => request(host, '/cit/d')
const getStatus = host => request(host, '/cit/s')

module.exports = {
  agent,
  getDescription,
  getStatus,
  request,
}
